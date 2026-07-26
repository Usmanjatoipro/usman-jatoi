import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzip } from "node:zlib";
import type { Database } from "@/integrations/supabase/types";

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export interface ContentTypeStat {
  post_type: string;
  label: string;
  published: number;
  sample_path: string | null;
}

export interface LocalServiceLine {
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  count: number;
}

type LocalPost = {
  id: number;
  post_type: string;
  status: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content?: string | null;
  permalink?: string | null;
  path: string | null;
  post_date?: string | null;
  post_modified?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  featured_media_id?: number | null;
  fifu_image_url?: string | null;
  fifu_image_alt?: string | null;
  meta?: Record<string, string | string[]> | null;
  terms?: { taxonomy: string; slug: string; name: string }[];
};

type WpDataRef = {
  kind: "posts" | "pages" | "services";
  file: string;
  id: number;
};

type WpCategoryIndex = {
  slug: string;
  name: string;
  taxonomy: string;
  count: number;
  posts: { id: number; file: string; date: string }[];
};

type WpDataIndex = {
  counts: {
    posts: number;
    pages: number;
    terms: number;
    servicePages: number;
    serviceRoots: number;
    serviceChildren: number;
  };
  files: {
    posts: Record<string, number>;
    pages: Record<string, number>;
    services: Record<string, number>;
    terms: string;
  };
  slugs: Record<string, WpDataRef[]>;
  paths: Record<string, WpDataRef>;
  services: (LocalServiceLine & { file: string })[];
  categories: Record<string, WpCategoryIndex>;
};

const LABELS: Record<string, string> = {
  page: "Pages",
  post: "Posts",
  product: "Products",
  courses: "Courses",
};

export const getContentTypeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ stats: ContentTypeStat[]; mediaCount: number }> => {
    const sb = serverClient();
    const types = ["page", "post", "product", "courses"];
    const stats: ContentTypeStat[] = [];
    for (const t of types) {
      const { count } = await sb
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("post_type", t)
        .eq("status", "publish");
      const { data: sample } = await sb
        .from("wp_posts")
        .select("path")
        .eq("post_type", t)
        .eq("status", "publish")
        .limit(1)
        .maybeSingle();
      stats.push({
        post_type: t,
        label: LABELS[t] ?? t,
        published: count ?? 0,
        sample_path: sample?.path ?? null,
      });
    }
    const { count: mediaCount } = await sb
      .from("wp_media")
      .select("id", { count: "exact", head: true });
    return { stats, mediaCount: mediaCount ?? 0 };
  },
);

let localImportCache:
  | {
      postCount: number;
      pageCount: number;
      servicePageCount: number;
      serviceRootCount: number;
      serviceChildCount: number;
      serviceLines: LocalServiceLine[];
    }
  | null = null;
const localManifestCache = new Map<string, LocalPost[]>();
let wpDataIndexCache: WpDataIndex | null = null;
const wpShardCache = new Map<string, LocalPost[]>();
const wpJsonCache = new Map<string, unknown>();
function gunzipAsync(input: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    gunzip(input, (error, output) => {
      if (error) reject(error);
      else resolve(output);
    });
  });
}

function normalizePath(path: string | null | undefined) {
  if (!path) return "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

function decodeHtml(value: string | null | undefined) {
  return (value || "")
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function readLocalManifest(filename: string): Promise<LocalPost[]> {
  if (localManifestCache.has(filename)) return localManifestCache.get(filename)!;
  const cwd = process.cwd();
  const candidates = [
    { path: resolve(cwd, "src", "data", filename), gz: false },
    { path: resolve(cwd, "public", "wp-data", `${filename}.gz`), gz: true },
    { path: resolve(cwd, ".output", "public", "wp-data", `${filename}.gz`), gz: true },
    { path: resolve(cwd, "..", "public", "wp-data", `${filename}.gz`), gz: true },
  ];

  let raw = "";
  const errors: string[] = [];
  for (const candidate of candidates) {
    try {
      if (candidate.gz) {
        const inflated = await gunzipAsync(await readFile(candidate.path));
        raw = inflated.toString("utf8");
      } else {
        raw = await readFile(candidate.path, "utf8");
      }
      break;
    } catch (error) {
      errors.push(`${candidate.path}: ${(error as Error).message}`);
    }
  }

  if (!raw) {
    throw new Error(`Unable to load ${filename}. Tried ${errors.join(" | ")}`);
  }

  const data = JSON.parse(raw) as LocalPost[];
  localManifestCache.set(filename, data);
  return data;
}

async function readWpDataJson<T>(relativePath: string): Promise<T> {
  if (wpJsonCache.has(relativePath)) return wpJsonCache.get(relativePath) as T;
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, "public", "wp-data", relativePath),
    resolve(cwd, ".output", "public", "wp-data", relativePath),
    resolve(cwd, "..", "public", "wp-data", relativePath),
  ];
  const errors: string[] = [];
  for (const filePath of candidates) {
    try {
      const inflated = await gunzipAsync(await readFile(filePath));
      const data = JSON.parse(inflated.toString("utf8")) as T;
      wpJsonCache.set(relativePath, data);
      return data;
    } catch (error) {
      errors.push(`${filePath}: ${(error as Error).message}`);
    }
  }
  throw new Error(`Unable to load split WP data ${relativePath}. Tried ${errors.join(" | ")}`);
}

async function getWpDataIndex() {
  if (wpDataIndexCache) return wpDataIndexCache;
  wpDataIndexCache = await readWpDataJson<WpDataIndex>("wp-data-index.json.gz");
  return wpDataIndexCache;
}

async function readWpShard(file: string) {
  if (wpShardCache.has(file)) return wpShardCache.get(file)!;
  const data = await readWpDataJson<LocalPost[]>(file);
  wpShardCache.set(file, data);
  return data;
}

async function findItemFromRefs(refs: WpDataRef[] | undefined, predicate: (item: LocalPost) => boolean) {
  for (const ref of refs || []) {
    const items = await readWpShard(ref.file);
    const found = items.find((item) => item.id === ref.id && predicate(item));
    if (found) return found;
  }
  return null;
}

async function findItemByPath(path: string) {
  const index = await getWpDataIndex();
  const ref = index.paths[normalizePath(path)];
  if (!ref) return { item: null as LocalPost | null, ref: null as WpDataRef | null, siblings: [] as LocalPost[] };
  const siblings = await readWpShard(ref.file);
  return {
    item: siblings.find((entry) => entry.id === ref.id) || null,
    ref,
    siblings,
  };
}

function directChildren(items: LocalPost[], parentPath: string) {
  const wanted = normalizePath(parentPath);
  const prefix = `${wanted}/`;
  const segCount = wanted.split("/").filter(Boolean).length;
  return items
    .filter((item) => {
      const childPath = normalizePath(item.path);
      return (
        item.status === "publish" &&
        childPath.startsWith(prefix) &&
        childPath.split("/").filter(Boolean).length === segCount + 1
      );
    })
    .slice(0, 500)
    .map((item) => ({
      id: item.id,
      title: stripTags(item.title) || item.slug,
      path: normalizePath(item.path),
      slug: item.slug,
      excerpt: stripTags(item.excerpt).slice(0, 160),
      featured_media_id: item.featured_media_id || null,
    }));
}

function stripTags(value: string | null | undefined) {
  return decodeHtml(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string | null | undefined) {
  return decodeHtml(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metaString(meta: LocalPost["meta"], key: string) {
  const value = meta?.[key];
  if (Array.isArray(value)) return value.find(Boolean) || "";
  return value || "";
}

function labelFromKey(key: string) {
  const labels: Record<string, string> = {
    aboutexpertise_section: "About Expertise",
    BestPracticesTips: "Best Practices & Tips",
    CommonMistakesMyths: "Common Mistakes & Myths",
    GlossaryRelatedTerms: "Glossary & Related Terms",
    "ProcessStep-by-Step": "Process Step by Step",
    WhatisX: "What Is It?",
    _cached_industries_block: "Industries We Serve",
    _cached_locations_block_v4: "Locations We Serve",
    beginners_tips: "Beginner Tips",
    advanced_tips: "Advanced Tips",
    comparison_tables: "Comparison Tables",
    hero_section: "Hero Section",
    our_services: "Our Services",
    pros_cons: "Pros & Cons",
    why_important: "Why It Matters",
  };
  return labels[key] || key.replace(/^_+/, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseJson(value: string) {
  const text = value.trim();
  if (!/^[{[]/.test(text)) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function itemTitle(item: any, fallback: string) {
  return stripTags(item?.title || item?.heading || item?.name || item?.topic || item?.question || fallback);
}

function itemDescription(item: any) {
  return stripTags(item?.description || item?.subtitle || item?.answer || item?.content || item?.text || "");
}

function listHtml(items: any[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : itemTitle(item, "Item"))}${typeof item === "object" && itemDescription(item) ? `<p>${escapeHtml(itemDescription(item))}</p>` : ""}</li>`).join("")}</ul>`;
}

function tableHtml(data: any) {
  const table = data?.comparison || data;
  const headers = table?.headers || data?.columns;
  const rows = table?.rows || data?.rows;
  if (!Array.isArray(headers) || !Array.isArray(rows)) return "";
  return `<div class="migrated-table"><table><thead><tr>${headers.map((h: any) => `<th>${escapeHtml(stripTags(String(h)))}</th>`).join("")}</tr></thead><tbody>${rows.slice(0, 24).map((row: any) => {
    const cells = Array.isArray(row) ? row : [row.name || row.topic, ...(row.values || [])];
    return `<tr>${cells.map((cell: any) => `<td>${escapeHtml(Array.isArray(cell) ? cell.map(stripTags).join(", ") : stripTags(String(cell || "")))}</td>`).join("")}</tr>`;
  }).join("")}</tbody></table></div>`;
}

function jsonToHtml(data: any) {
  if (Array.isArray(data)) return listHtml(data);
  if (!data || typeof data !== "object") return `<p>${escapeHtml(String(data || ""))}</p>`;
  const title = stripTags(data["main-title"] || data.section_title || data.title || "");
  const subtitle = stripTags(data.section_subtitle || data.subtitle || data.intro || data.description || "");
  const parts = [
    title ? `<h3>${escapeHtml(title)}</h3>` : "",
    subtitle ? `<p>${escapeHtml(subtitle)}</p>` : "",
  ];
  if (Array.isArray(data.features)) parts.push(listHtml(data.features));
  if (Array.isArray(data.bullets)) parts.push(listHtml(data.bullets));
  if (Array.isArray(data.services)) {
    parts.push(`<div class="migrated-grid">${data.services.map((item: any, index: number) => `<article><h3>${escapeHtml(itemTitle(item, `Service ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p>${item?.link ? `<a href="${String(item.link).replace(/^https?:\/\/usmanjatoi\.com/i, "")}">Open service</a>` : ""}</article>`).join("")}</div>`);
  }
  const steps = Array.isArray(data.steps) ? data.steps : Array.isArray(data.items) ? data.items : [];
  if (steps.length) parts.push(`<div class="migrated-steps">${steps.map((item: any, index: number) => `<article><span>${escapeHtml(String(item?.step_number || item?.step || index + 1))}</span><h3>${escapeHtml(itemTitle(item, `Step ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p></article>`).join("")}</div>`);
  if (Array.isArray(data.faqs)) {
    parts.push(`<div class="migrated-faqs">${data.faqs.map((item: any) => `<details open><summary>${escapeHtml(itemTitle(item, "Question"))}</summary><p>${escapeHtml(itemDescription(item))}</p></details>`).join("")}</div>`);
  }
  parts.push(tableHtml(data));
  if (parts.filter(Boolean).length <= 1) {
    parts.push(`<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`);
  }
  return parts.filter(Boolean).join("");
}

const SKIP_BODY_META = new Set([
  "meta_title",
  "meta_description",
  "rank_math_title",
  "rank_math_description",
  "_yoast_wpseo_title",
  "_yoast_wpseo_metadesc",
  "rank_math_seo_score",
  "rank_math_focus_keyword",
  "rank_math_primary_category",
  "rank_math_robots",
  "rank_math_sitemap_include",
  "_wp_page_template",
  "_elementor_template_type",
  "fifu_image_url",
  "fifu_image_alt",
]);

function metaToHtml(meta: LocalPost["meta"]) {
  const entries = Object.entries(meta || {}).filter(([key, value]) => {
    const text = Array.isArray(value) ? value.join("\n") : value;
    return text.trim() && !SKIP_BODY_META.has(key) && !key.startsWith("_elementor_") && !key.toLowerCase().includes("schema");
  });
  if (!entries.length) return "";
  const order = ["intro", "hero_section", "aboutexpertise_section", "our_services", "process", "comparison_tables", "comparison", "faqs", "_cached_industries_block", "_cached_locations_block_v4"];
  entries.sort(([a], [b]) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || labelFromKey(a).localeCompare(labelFromKey(b));
  });
  return entries.map(([key, raw]) => {
    const value = Array.isArray(raw) ? raw.filter(Boolean).join("\n\n") : raw;
    const parsed = parseJson(value);
    const body = parsed ? jsonToHtml(parsed) : /<\/?[a-z][\s\S]*>/i.test(value) ? value.replace(/<script[\s\S]*?<\/script>/gi, "") : `<p>${escapeHtml(value)}</p>`;
    return `<section class="migrated-field" data-field="${escapeHtml(key)}"><h2>${escapeHtml(labelFromKey(key))}</h2>${body}</section>`;
  }).join("");
}

function hydratedPost(post: LocalPost): LocalPost {
  const content = post.content && stripTags(post.content) ? post.content : metaToHtml(post.meta);
  return {
    ...post,
    content,
    excerpt: post.excerpt || metaString(post.meta, "meta_description") || stripTags(content).slice(0, 220),
    seo_title: post.seo_title || metaString(post.meta, "meta_title") || post.title,
    seo_description: post.seo_description || metaString(post.meta, "meta_description") || stripTags(content).slice(0, 158),
  };
}

export const getLocalPostBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const index = await getWpDataIndex();
    const post = await findItemFromRefs(
      (index.slugs[data.slug] || []).filter((ref) => ref.kind === "posts"),
      (item) => item.status === "publish" && item.slug === data.slug,
    );
    if (!post) return null;
    const hydrated = hydratedPost(post);
    return {
      post: hydrated,
      heroUrl: post.fifu_image_url || null,
      categories: (post.terms || []).filter((term) => term.taxonomy === "category").map((term, index) => ({ id: index + 1, name: term.name, slug: term.slug, parent_id: null, taxonomy: term.taxonomy })),
      tags: (post.terms || []).filter((term) => term.taxonomy === "post_tag").map((term, index) => ({ id: index + 1000, name: term.name, slug: term.slug, parent_id: null, taxonomy: term.taxonomy })),
    };
  });

export const getLocalServiceBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const path = `/services/${data.slug}`;
    const index = await getWpDataIndex();
    const serviceLine = index.services.find((service) => service.slug === data.slug);
    const pages = serviceLine ? await readWpShard(serviceLine.file) : [];
    const page = pages.find((item) => item.status === "publish" && normalizePath(item.path) === path);
    if (!page) return null;
    const hydrated = hydratedPost(page);
    const hero = parseJson(metaString(page.meta, "hero_section")) as any;
    const about = parseJson(metaString(page.meta, "aboutexpertise_section")) as any;
    const children = pages
      .filter((item) => item.status === "publish" && normalizePath(item.path).startsWith(`${path}/`))
      .slice(0, 240)
      .map((item) => ({ title: stripTags(item.title) || item.slug, href: normalizePath(item.path), excerpt: stripTags(item.excerpt).slice(0, 130) }));
    return {
      service: {
        ...hydrated,
        h1: stripTags(hero?.title || page.title || data.slug),
        title: stripTags(page.title) || data.slug,
        paragraphs: [
          stripTags(hero?.subtitle || hero?.description || page.excerpt || hydrated.excerpt || ""),
          stripTags(about?.intro || ""),
        ].filter(Boolean),
        bullets: [
          ...(Array.isArray(hero?.features) ? hero.features.map(stripTags) : []),
          ...(Array.isArray(about?.bullets) ? about.bullets.map((item: any) => itemTitle(item, "Benefit")) : []),
        ].filter(Boolean),
      },
      children,
      childCount: pages.filter((item) => item.status === "publish" && normalizePath(item.path).startsWith(`${path}/`)).length,
    };
  });

export const getLocalContentByPath = createServerFn({ method: "GET" })
  .validator((data: { path: string }) => data)
  .handler(async ({ data }) => {
    const wanted = normalizePath(data.path);
    if (!wanted) return null;

    const { item: post, siblings } = await findItemByPath(wanted);
    if (!post) return null;

    const hydrated = hydratedPost(post);
    const media = post.fifu_image_url
      ? {
          storage_url: post.fifu_image_url,
          source_url: post.fifu_image_url,
          alt_text: post.fifu_image_alt || post.title || "",
        }
      : null;

    const categories = (post.terms || [])
      .filter((term) => term.taxonomy === "category")
      .map((term, index) => ({
        id: index + 1,
        name: term.name,
        slug: term.slug,
        parent_id: null,
        taxonomy: term.taxonomy,
      }));
    const tags = (post.terms || [])
      .filter((term) => term.taxonomy === "post_tag")
      .map((term, index) => ({
        id: index + 1000,
        name: term.name,
        slug: term.slug,
        parent_id: null,
        taxonomy: term.taxonomy,
      }));

    const prefix = `${wanted}/`;
    const segCount = wanted.split("/").filter(Boolean).length;
    const children =
      post.post_type === "page"
        ? siblings
            .filter((item) => {
              const childPath = normalizePath(item.path);
              return (
                item.status === "publish" &&
                childPath.startsWith(prefix) &&
                childPath.split("/").filter(Boolean).length === segCount + 1
              );
            })
            .slice(0, 500)
            .map((item) => ({
              id: item.id,
              title: stripTags(item.title) || item.slug,
              path: normalizePath(item.path),
              slug: item.slug,
              excerpt: stripTags(item.excerpt).slice(0, 160),
              featured_media_id: item.featured_media_id || null,
            }))
        : [];

    return {
      post: {
        ...hydrated,
        content: hydrated.content || "",
        excerpt: hydrated.excerpt || "",
        permalink: hydrated.permalink || "",
        path: normalizePath(hydrated.path),
        post_date: hydrated.post_date || null,
        post_modified: hydrated.post_modified || null,
        seo_title: hydrated.seo_title || hydrated.title || "",
        seo_description: hydrated.seo_description || hydrated.excerpt || "",
        featured_media_id: hydrated.featured_media_id || null,
        meta: hydrated.meta || null,
        raw: { terms: post.terms || [] },
      },
      media,
      children,
      childrenMedia: {},
      categories,
      tags,
    };
  });

export const getLocalImportOverview = createServerFn({ method: "GET" }).handler(async () => {
  if (localImportCache) return localImportCache;

  const index = await getWpDataIndex();
  const serviceLines = index.services.map(({ file: _file, ...service }) => ({
    ...service,
    excerpt: decodeHtml(service.excerpt).slice(0, 140),
  }));

  localImportCache = {
    postCount: index.counts.posts,
    pageCount: index.counts.pages,
    servicePageCount: index.counts.servicePages,
    serviceRootCount: index.counts.serviceRoots,
    serviceChildCount: index.counts.serviceChildren,
    serviceLines,
  };

  return localImportCache;
});

export const getLocalCategoryArchiveBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string; page?: number }) => data)
  .handler(async ({ data }) => {
    const index = await getWpDataIndex();
    const category = index.categories[data.slug];
    if (!category) return null;

    const pageSize = 24;
    const total = category.posts.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, data.page || 1), totalPages);
    const refs = category.posts.slice((page - 1) * pageSize, page * pageSize);
    const byFile = new Map<string, Set<number>>();
    refs.forEach((ref) => {
      if (!byFile.has(ref.file)) byFile.set(ref.file, new Set());
      byFile.get(ref.file)!.add(ref.id);
    });
    const order = new Map(refs.map((ref, index) => [ref.id, index]));

    const posts = [];
    for (const [file, ids] of byFile) {
      const shard = await readWpShard(file);
      for (const post of shard) {
        if (!ids.has(post.id) || post.status !== "publish") continue;
        posts.push({
          id: post.id,
          slug: post.slug,
          title: decodeHtml(post.title),
          excerpt: stripTags(post.excerpt || post.content).slice(0, 240),
          permalink: normalizePath(post.path) || post.permalink || `/blog/${post.slug}`,
          path: normalizePath(post.path),
          post_date: post.post_date || null,
          featured_image: post.fifu_image_url || null,
        });
      }
    }
    posts.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    return {
      category: {
        id: Math.abs(data.slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)),
        slug: category.slug,
        name: decodeHtml(category.name),
        description: "",
        parent_id: null,
        count: total,
      },
      ancestors: [],
      children: [],
      posts,
      page,
      pageSize,
      total,
      totalPages,
    };
  });
