import { createGzip } from "node:zlib";
import { mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const sourceDir = resolve(root, "src", "data");
const outputDir = resolve(root, "public", "wp-data");

function normalizePath(path) {
  if (!path) return "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

function cleanName(value, fallback = "misc") {
  return (
    String(value || fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90) || fallback
  );
}

function firstSegment(item, fallback) {
  const parts = normalizePath(item.path).split("/").filter(Boolean);
  return cleanName(parts[0] || fallback);
}

function serviceSlug(item) {
  const parts = normalizePath(item.path).split("/").filter(Boolean);
  return parts[0] === "services" && parts[1] ? cleanName(parts[1]) : null;
}

function gzipBuffer(input) {
  return new Promise((resolvePromise, reject) => {
    const gzip = createGzip({ level: 9 });
    const chunks = [];
    gzip.on("data", (chunk) => chunks.push(chunk));
    gzip.on("error", reject);
    gzip.on("end", () => resolvePromise(Buffer.concat(chunks)));
    gzip.end(input);
  });
}

async function writeGzipJson(relativePath, data) {
  const target = resolve(outputDir, relativePath);
  await mkdir(dirname(target), { recursive: true });
  const json = JSON.stringify(data);
  await writeFile(target, await gzipBuffer(json));
  return { file: relativePath.replaceAll("\\", "/"), count: Array.isArray(data) ? data.length : undefined };
}

function addRef(map, key, ref) {
  if (!key) return;
  if (!map[key]) map[key] = [];
  map[key].push(ref);
}

function categoryName(term) {
  return term?.name || term?.slug || "Uncategorized";
}

function postDateValue(item) {
  const value = Date.parse(item.post_date || "");
  return Number.isFinite(value) ? value : 0;
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function summaryFor(item, file) {
  return {
    id: item.id,
    file,
    slug: item.slug || "",
    path: normalizePath(item.path) || `/blog/${item.slug || item.id}`,
    title: stripTags(item.title) || item.slug || `Item ${item.id}`,
    excerpt: stripTags(item.excerpt || item.content).slice(0, 260),
    date: item.post_date || "",
    modified: item.post_modified || "",
    featured_image: item.fifu_image_url || null,
    featured_alt: item.fifu_image_alt || item.title || "",
  };
}

async function readJson(file) {
  return JSON.parse(await readFile(resolve(sourceDir, file), "utf8"));
}

async function main() {
  const [posts, pages, terms] = await Promise.all([
    readJson("wp-posts-manifest.json"),
    readJson("wp-pages-manifest.json"),
    readJson("wp-terms-manifest.json"),
  ]);

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const postBuckets = new Map();
  const pageBuckets = new Map();
  const serviceBuckets = new Map();

  for (const post of posts) {
    const bucket = `posts/${firstSegment(post, "posts")}.json.gz`;
    if (!postBuckets.has(bucket)) postBuckets.set(bucket, []);
    postBuckets.get(bucket).push(post);
  }

  for (const page of pages) {
    const svc = serviceSlug(page);
    if (svc) {
      const bucket = `services/${svc}.json.gz`;
      if (!serviceBuckets.has(bucket)) serviceBuckets.set(bucket, []);
      serviceBuckets.get(bucket).push(page);
      continue;
    }
    const bucket = `pages/${firstSegment(page, "pages")}.json.gz`;
    if (!pageBuckets.has(bucket)) pageBuckets.set(bucket, []);
    pageBuckets.get(bucket).push(page);
  }

  const index = {
    version: 2,
    generatedAt: new Date().toISOString(),
    counts: {
      posts: posts.length,
      pages: pages.length,
      terms: terms.length,
      servicePages: 0,
      serviceRoots: 0,
      serviceChildren: 0,
    },
    files: {
      posts: {},
      pages: {},
      services: {},
      terms: "terms/all.json.gz",
    },
    slugs: {},
    paths: {},
    postsByDate: [],
    serviceChildren: {},
    services: [],
    categories: {},
  };

  const writeBuckets = async (kind, buckets) => {
    for (const [file, items] of [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      items.sort((a, b) => normalizePath(a.path).localeCompare(normalizePath(b.path)) || a.id - b.id);
      await writeGzipJson(file, items);
      index.files[kind][file] = items.length;
      for (const item of items) {
        const ref = { kind, file, id: item.id };
        addRef(index.slugs, item.slug, ref);
        const path = normalizePath(item.path);
        if (path) index.paths[path] = ref;
      }
    }
  };

  await writeBuckets("posts", postBuckets);
  await writeBuckets("pages", pageBuckets);
  await writeBuckets("services", serviceBuckets);
  await writeGzipJson(index.files.terms, terms);

  const serviceLines = [];
  for (const [file, items] of serviceBuckets) {
    const roots = items.filter((item) => /^\/services\/[^/]+$/.test(normalizePath(item.path)));
    const rootItem = roots[0] || items[0];
    const slug = normalizePath(rootItem.path).split("/").filter(Boolean)[1] || rootItem.slug;
    const rootPath = `/services/${slug}`;
    const children = items
      .filter((item) => normalizePath(item.path).startsWith(`${rootPath}/`))
      .sort((a, b) => normalizePath(a.path).localeCompare(normalizePath(b.path)) || a.id - b.id);
    const childCount = children.length;
    serviceLines.push({
      slug,
      path: rootPath,
      title: rootItem.title || slug.replace(/-/g, " "),
      excerpt: rootItem.excerpt || "",
      count: childCount,
      file,
    });
    index.serviceChildren[slug] = children.slice(0, 500).map((item) => summaryFor(item, file));
  }
  serviceLines.sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
  index.services = serviceLines;
  index.counts.servicePages = [...serviceBuckets.values()].reduce((sum, items) => sum + items.length, 0);
  index.counts.serviceRoots = serviceLines.length;
  index.counts.serviceChildren = Math.max(0, index.counts.servicePages - index.counts.serviceRoots);

  const categoryTerms = new Map();
  for (const term of terms) {
    if (term.taxonomy === "category") {
      categoryTerms.set(term.slug, { slug: term.slug, name: categoryName(term), taxonomy: term.taxonomy, count: 0, posts: [] });
    }
  }
  for (const [file, items] of postBuckets) {
    for (const item of items) {
      if (item.status === "publish") index.postsByDate.push(summaryFor(item, file));
      for (const term of item.terms || []) {
        if (term.taxonomy !== "category") continue;
        if (!categoryTerms.has(term.slug)) {
          categoryTerms.set(term.slug, { slug: term.slug, name: categoryName(term), taxonomy: term.taxonomy, count: 0, posts: [] });
        }
        const category = categoryTerms.get(term.slug);
        category.count += 1;
        category.posts.push({ id: item.id, file, date: item.post_date || "" });
      }
    }
  }
  index.postsByDate.sort((a, b) => postDateValue({ post_date: b.date }) - postDateValue({ post_date: a.date }));
  for (const category of categoryTerms.values()) {
    category.posts.sort((a, b) => Date.parse(b.date || "") - Date.parse(a.date || ""));
    delete category.date;
  }
  index.categories = Object.fromEntries([...categoryTerms.entries()].sort(([a], [b]) => a.localeCompare(b)));

  await writeGzipJson("wp-data-index.json.gz", index);

  console.log(`Split ${posts.length.toLocaleString()} posts into ${postBuckets.size} post files.`);
  console.log(`Split ${pages.length.toLocaleString()} pages into ${pageBuckets.size} page files and ${serviceBuckets.size} service files.`);
  console.log(`Preserved ${terms.length.toLocaleString()} terms.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
