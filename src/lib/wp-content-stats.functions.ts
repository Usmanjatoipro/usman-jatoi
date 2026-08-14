import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

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
  meta?: Json;
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

let localImportCache: {
  postCount: number;
  pageCount: number;
  servicePageCount: number;
  serviceRootCount: number;
  serviceChildCount: number;
  serviceLines: LocalServiceLine[];
} | null = null;
const localManifestCache = new Map<string, LocalPost[]>();
let wpDataIndexCache: WpDataIndex | null = null;
const wpShardCache = new Map<string, LocalPost[]>();
const wpJsonCache = new Map<string, unknown>();
async function readFileBuf(path: string): Promise<Buffer> {
  const { readFile: rf } = await import("node:fs/promises");
  return (await rf(path)) as unknown as Buffer;
}

async function readFileText(path: string): Promise<string> {
  const { readFile: rf } = await import("node:fs/promises");
  return rf(path, "utf8");
}

function resolve(...parts: string[]) {
  return parts
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/\/[^/]+\/\.\./g, "");
}

async function gunzipAsync(input: Buffer) {
  const { gunzip } = await import("node:zlib");
  return new Promise<Buffer>((res, reject) => {
    gunzip(input, (error, output) => {
      if (error) reject(error);
      else res(output);
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
        const inflated = await gunzipAsync(await readFileBuf(candidate.path));
        raw = inflated.toString("utf8");
      } else {
        raw = await readFileText(candidate.path);
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

async function fetchWpDataOverHttp<T>(relativePath: string): Promise<T | null> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    if (!req?.url) return null;
    const base = new URL(req.url).origin;
    const res = await fetch(`${base}/wp-data/${relativePath}`);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const text =
      buf[0] === 0x1f && buf[1] === 0x8b
        ? (await gunzipAsync(buf)).toString("utf8")
        : buf.toString("utf8");
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

const EMPTY_WP_INDEX: WpDataIndex = {
  counts: { posts: 0, pages: 0, terms: 0, servicePages: 0, serviceRoots: 0, serviceChildren: 0 },
  files: { posts: {}, pages: {}, services: {}, terms: "" },
  slugs: {},
  paths: {},
  services: [],
  categories: {},
};

/**
 * Reads a split WP data shard. Returns null instead of throwing when the file
 * is unavailable or is still a Git LFS pointer (not fetched in this
 * environment) — callers degrade to the database instead of a 500 page.
 */
async function readWpDataJson<T>(relativePath: string): Promise<T | null> {
  if (wpJsonCache.has(relativePath)) return wpJsonCache.get(relativePath) as T;
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, "public", "wp-data", relativePath),
    resolve(cwd, ".output", "public", "wp-data", relativePath),
    resolve(cwd, "..", "public", "wp-data", relativePath),
  ];
  for (const filePath of candidates) {
    try {
      const inflated = await gunzipAsync(await readFileBuf(filePath));
      const data = JSON.parse(inflated.toString("utf8")) as T;
      wpJsonCache.set(relativePath, data);
      return data;
    } catch {
      /* try next candidate */
    }
  }
  const viaHttp = await fetchWpDataOverHttp<T>(relativePath);
  if (viaHttp) {
    wpJsonCache.set(relativePath, viaHttp);
    return viaHttp;
  }
  console.warn(`[wp-data] shard unavailable: ${relativePath} — falling back to database`);
  return null;
}

async function getWpDataIndex(): Promise<WpDataIndex> {
  if (wpDataIndexCache) return wpDataIndexCache;
  wpDataIndexCache = (await readWpDataJson<WpDataIndex>("wp-data-index.json.gz")) ?? EMPTY_WP_INDEX;
  return wpDataIndexCache;
}

async function readWpShard(file: string): Promise<LocalPost[]> {
  if (wpShardCache.has(file)) return wpShardCache.get(file)!;
  const data = (await readWpDataJson<LocalPost[]>(file)) ?? [];
  wpShardCache.set(file, data);
  return data;
}

async function findItemFromRefs(
  refs: WpDataRef[] | undefined,
  predicate: (item: LocalPost) => boolean,
) {
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
  if (!ref)
    return {
      item: null as LocalPost | null,
      ref: null as WpDataRef | null,
      siblings: [] as LocalPost[],
    };
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
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string | null | undefined) {
  return decodeHtml(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metaString(meta: LocalPost["meta"], key: string) {
  if (!meta || Array.isArray(meta) || typeof meta !== "object") return "";
  const value = meta[key];
  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === "string" && entry.trim());
    return typeof first === "string" ? first : "";
  }
  return typeof value === "string" ? value : "";
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
  return (
    labels[key] ||
    key
      .replace(/^_+/, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
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
  return stripTags(
    item?.title || item?.heading || item?.name || item?.topic || item?.question || fallback,
  );
}

function itemDescription(item: any) {
  return stripTags(
    item?.description || item?.subtitle || item?.answer || item?.content || item?.text || "",
  );
}

function listHtml(items: any[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : itemTitle(item, "Item"))}${typeof item === "object" && itemDescription(item) ? `<p>${escapeHtml(itemDescription(item))}</p>` : ""}</li>`).join("")}</ul>`;
}

function cellText(value: any) {
  if (Array.isArray(value))
    return value
      .map((entry) => stripTags(String(entry ?? "")))
      .filter(Boolean)
      .join(", ");
  if (value && typeof value === "object")
    return stripTags(itemDescription(value) || itemTitle(value, ""));
  return stripTags(String(value ?? ""));
}

function tableHtml(data: any) {
  const table = data?.comparison || data;
  const headers = table?.headers || data?.columns;
  const rows = table?.rows || data?.rows;
  if (!Array.isArray(headers) || !Array.isArray(rows)) return "";
  return `<div class="migrated-table"><table><thead><tr>${headers.map((h: any) => `<th>${escapeHtml(stripTags(String(h)))}</th>`).join("")}</tr></thead><tbody>${rows
    .slice(0, 24)
    .map((row: any) => {
      const cells = Array.isArray(row)
        ? headers.map((_header: any, index: number) => row[index])
        : headers.map((header: any, index: number) => {
            const raw = String(header);
            const slug = raw
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_|_$/g, "");
            const compact = slug.replace(/_/g, "");
            const key = Object.keys(row || {}).find((candidate) => {
              const normalized = candidate
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_|_$/g, "");
              return normalized === slug || normalized.replace(/_/g, "") === compact;
            });
            if (key) return row[key];
            if (index === 0) return row.topic ?? row.name ?? row.title;
            return Array.isArray(row.values) ? row.values[index - 1] : "";
          });
      return `<tr>${cells.map((cell: any) => `<td>${escapeHtml(cellText(cell))}</td>`).join("")}</tr>`;
    })
    .join("")}</tbody></table></div>`;
}

function processHtml(data: any) {
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  if (!steps.length) return "";
  return `<div class="uj-steps">${steps.map((item: any, index: number) => `<article><span class="uj-step-n">${escapeHtml(String(item?.step_number || item?.step || index + 1))}</span><h3>${escapeHtml(itemTitle(item, `Step ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p>${Array.isArray(item?.tips) ? `<ul class="uj-tips">${item.tips.map((tip: any) => `<li>${escapeHtml(cellText(tip))}</li>`).join("")}</ul>` : ""}</article>`).join("")}</div>`;
}

function prosConsHtml(data: any) {
  const render = (items: any[], kind: "pro" | "con", label: string) =>
    `<div class="uj-pc-col uj-pc-${kind}"><div class="uj-pc-head">${label}</div><ul>${items.map((item: any) => `<li><strong>${escapeHtml(itemTitle(item, label))}</strong>${itemDescription(item) ? `<p>${escapeHtml(itemDescription(item))}</p>` : ""}</li>`).join("")}</ul></div>`;
  const pros = Array.isArray(data?.pros) ? data.pros : [];
  const cons = Array.isArray(data?.cons) ? data.cons : [];
  if (!pros.length && !cons.length) return "";
  return `<div class="uj-proscons">${render(pros, "pro", "Pros")}${render(cons, "con", "Cons")}</div>`;
}

function checklistHtml(data: any) {
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  if (!items.length) return "";
  return `<ul class="uj-checklist">${items.map((item: any, index: number) => `<li><label><input type="checkbox" aria-label="Complete ${escapeHtml(itemTitle(item, `Checklist item ${index + 1}`))}"><span class="uj-box" aria-hidden="true"></span><span class="uj-ck-body"><strong>${escapeHtml(itemTitle(item, `Checklist item ${index + 1}`))}</strong>${itemDescription(item) ? `<em>${escapeHtml(itemDescription(item))}</em>` : ""}</span></label></li>`).join("")}</ul>`;
}

function timelineHtml(data: any) {
  const items = Array.isArray(data?.items) ? data.items : [];
  if (!items.length) return "";
  const cards = (hidden = false) =>
    items
      .map(
        (item: any, index: number) =>
          `<article${hidden ? ' aria-hidden="true"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(itemTitle(item, `Milestone ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p></article>`,
      )
      .join("");
  return `<div class="uj-timeline-loop"><div class="uj-timeline-track">${cards()}${cards(true)}</div></div>`;
}

function glossaryHtml(value: string) {
  const withoutHeading = value.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "");
  const terms = [...withoutHeading.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  if (!terms.length) return withoutHeading;
  return `<details class="uj-glossary-accordion"><summary>Glossary of Related Terms</summary><dl class="uj-glossary">${terms
    .map((line) => {
      const [term, ...definition] = line.split(/\s+[—-]\s+/);
      return `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition.join(" — ") || line)}</dd></div>`;
    })
    .join("")}</dl></details>`;
}

function faqHtml(data: any) {
  const faqs = Array.isArray(data?.faqs) ? data.faqs : [];
  if (!faqs.length) return "";
  return `<div class="migrated-faqs">${faqs.map((item: any) => `<details><summary>${escapeHtml(itemTitle(item, "Question"))}</summary><p>${escapeHtml(itemDescription(item))}</p></details>`).join("")}</div>`;
}

function jsonToHtml(data: any, key = "") {
  if (Array.isArray(data)) return listHtml(data);
  if (!data || typeof data !== "object") return `<p>${escapeHtml(String(data || ""))}</p>`;
  if (key === "ProcessStep-by-Step" || key === "process") return processHtml(data);
  if (key === "pros_cons") return prosConsHtml(data);
  if (key === "checklist") return checklistHtml(data);
  if (key === "timeline") return timelineHtml(data);
  if (key === "faqs") return faqHtml(data);
  if (key === "comparison" || key === "comparison_tables") return tableHtml(data);
  const title = stripTags(data["main-title"] || data.section_title || data.title || "");
  const subtitle = stripTags(
    data.section_subtitle || data.subtitle || data.intro || data.description || "",
  );
  const parts = [
    title ? `<h3>${escapeHtml(title)}</h3>` : "",
    subtitle ? `<p>${escapeHtml(subtitle)}</p>` : "",
  ];
  if (Array.isArray(data.features)) parts.push(listHtml(data.features));
  if (Array.isArray(data.bullets)) parts.push(listHtml(data.bullets));
  if (Array.isArray(data.services)) {
    parts.push(
      `<div class="migrated-grid">${data.services.map((item: any, index: number) => `<article><h3>${escapeHtml(itemTitle(item, `Service ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p>${item?.link ? `<a href="${String(item.link).replace(/^https?:\/\/usmanjatoi\.com/i, "")}">Open service</a>` : ""}</article>`).join("")}</div>`,
    );
  }
  const steps = Array.isArray(data.steps)
    ? data.steps
    : Array.isArray(data.items)
      ? data.items
      : [];
  if (steps.length)
    parts.push(
      `<div class="migrated-steps">${steps.map((item: any, index: number) => `<article><span>${escapeHtml(String(item?.step_number || item?.step || index + 1))}</span><h3>${escapeHtml(itemTitle(item, `Step ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p></article>`).join("")}</div>`,
    );
  if (Array.isArray(data.faqs)) {
    parts.push(faqHtml(data));
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

const RICH_BODY_META = [
  "GlossaryRelatedTerms",
  "intro",
  "takeaways",
  "WhatisX",
  "why_important",
  "examples",
  "ProcessStep-by-Step",
  "checklist",
  "BestPracticesTips",
  "beginners_tips",
  "advanced_tips",
  "CommonMistakesMyths",
  "pros_cons",
  "comparison",
  "comparison_tables",
  "case_studies",
  "timeline",
  "BenefitsAdvantages",
  "DrawbacksLimitations",
  "StrategiesFrameworks",
  "ActionPlanHowtoImplement",
  "FuturePredictions",
  "faqs",
] as const;

function metaToHtml(meta: LocalPost["meta"]) {
  const record = meta && !Array.isArray(meta) && typeof meta === "object" ? meta : {};
  const entries = Object.entries(record).filter(([key, value]) => {
    const text = Array.isArray(value)
      ? value.filter((entry): entry is string => typeof entry === "string").join("\n")
      : typeof value === "string"
        ? value
        : value && typeof value === "object"
          ? JSON.stringify(value)
          : "";
    return (
      text.trim() &&
      RICH_BODY_META.includes(key as (typeof RICH_BODY_META)[number]) &&
      !SKIP_BODY_META.has(key)
    );
  });
  if (!entries.length) return "";
  entries.sort(([a], [b]) => {
    const ai = RICH_BODY_META.indexOf(a as (typeof RICH_BODY_META)[number]);
    const bi = RICH_BODY_META.indexOf(b as (typeof RICH_BODY_META)[number]);
    return ai - bi;
  });
  return entries
    .map(([key, raw]) => {
      const value = Array.isArray(raw)
        ? raw
            .filter((entry): entry is string => typeof entry === "string" && Boolean(entry))
            .join("\n\n")
        : typeof raw === "string"
          ? raw
          : JSON.stringify(raw);
      const parsed = parseJson(value);
      const body =
        key === "GlossaryRelatedTerms"
          ? glossaryHtml(value)
          : parsed
            ? jsonToHtml(parsed, key)
            : /<\/?[a-z][\s\S]*>/i.test(value)
              ? value.replace(/<script[\s\S]*?<\/script>/gi, "")
              : `<p>${escapeHtml(value)}</p>`;
      return `<section class="migrated-field" data-field="${escapeHtml(key)}">${body}</section>`;
    })
    .join("");
}

const SERVICE_BODY_META = [
  "our_services",
  "aboutexpertise_section",
  "process",
  "overall_process",
  "benefits",
  "what_you_will_get",
  "industry_specific_solution",
  "_cached_industries_block",
  "location_specific_solution",
  "_cached_locations_block_v4",
  "use_cases",
  "case_study_example",
  "testimonials",
  "pricing",
  "faqs",
] as const;

function cleanImportedHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\sstyle=("[^"]*"|'[^']*')/gi, "")
    .replace(/\son\w+=("[^"]*"|'[^']*')/gi, "");
}

function serviceMetaSections(meta: LocalPost["meta"]) {
  const record = meta && !Array.isArray(meta) && typeof meta === "object" ? meta : {};
  const sections: Record<string, string> = {};
  for (const key of SERVICE_BODY_META) {
    const raw = record[key];
    const value = Array.isArray(raw)
      ? raw.find((entry) => typeof entry === "string" && entry.trim())
      : raw;
    if (typeof value !== "string" || !value.trim()) continue;
    const parsed = parseJson(value);
    const body = parsed ? jsonToHtml(parsed, key) : cleanImportedHtml(value);
    if (stripTags(body)) sections[key] = body;
  }
  const video = metaString(record, "promovideo");
  const youtubeId = video.match(/(?:youtu\.be\/|[?&]v=)([a-zA-Z0-9_-]{6,})/)?.[1];
  if (youtubeId) {
    sections.promovideo = `<div class="service-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${escapeHtml(youtubeId)}" title="Service video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  }
  return sections;
}

function serviceMetaToHtml(meta: LocalPost["meta"]) {
  const sections = serviceMetaSections(meta);
  const orderedKeys = [
    "our_services",
    "aboutexpertise_section",
    "promovideo",
    ...SERVICE_BODY_META,
  ];
  const seen = new Set<string>();
  return orderedKeys
    .filter((key) => sections[key] && !seen.has(key) && seen.add(key))
    .map(
      (key) =>
        `<section class="migrated-field service-field service-field-${escapeHtml(key.replace(/^_+/, ""))}" data-field="${escapeHtml(key)}">${sections[key]}</section>`,
    )
    .join("");
}

function importedTagTexts(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function structuredServiceMeta(meta: LocalPost["meta"], key: string) {
  const raw = metaString(meta, key);
  const json = parseJson(raw);
  if (json) return json;
  if (!raw.trim().startsWith("<")) return null;

  if (key === "hero_section") {
    const paragraphs = importedTagTexts(raw, "p");
    return {
      title: importedTagTexts(raw, "h1")[0] || importedTagTexts(raw, "h2")[0],
      subtitle: paragraphs[0],
      description: paragraphs.at(-1),
      features: importedTagTexts(raw, "li"),
    };
  }
  if (key === "aboutexpertise_section") {
    const paragraphs = importedTagTexts(raw, "p");
    const list = importedTagTexts(raw, "li");
    const midpoint = Math.max(1, Math.ceil(list.length / 2));
    return {
      title: importedTagTexts(raw, "h2")[0] || importedTagTexts(raw, "h3")[0],
      intro: paragraphs[0],
      paragraphs: paragraphs.slice(1),
      bullets: list.length
        ? [
            { heading: "My expertise", list: list.slice(0, midpoint) },
            { heading: "How I help", list: list.slice(midpoint) },
          ].filter((group) => group.list.length)
        : [],
    };
  }
  if (key === "our_services") {
    const services = [
      ...raw.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    ]
      .map((match) => ({
        title: stripTags(match[1]),
        description: stripTags(match[2]),
        tags: [] as string[],
      }))
      .filter((item) => item.title && item.description);
    return {
      section_title: importedTagTexts(raw, "h2")[0],
      section_subtitle: importedTagTexts(raw, "p")[0],
      services,
    };
  }
  if (key === "process") {
    return {
      steps: [
        ...raw.matchAll(
          /class=["'][^"']*process-title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>[\s\S]*?class=["'][^"']*process-description[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi,
        ),
      ].map((match, index) => ({
        step_number: index + 1,
        title: stripTags(match[1]),
        description: stripTags(match[2]),
      })),
    };
  }
  if (key === "faqs") {
    return {
      faqs: [
        ...raw.matchAll(
          /class=["'][^"']*faq-question[^"']*["'][^>]*>([\s\S]*?)<\/button>[\s\S]*?class=["'][^"']*faq-answer[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        ),
      ].map((match) => ({ question: stripTags(match[1]), answer: stripTags(match[2]) })),
    };
  }
  return null;
}

function hydratedPost(post: LocalPost): LocalPost {
  const originalContent = post.content && stripTags(post.content) ? post.content : "";
  const isService = post.post_type === "page" && normalizePath(post.path).startsWith("/services/");
  const structuredContent = isService ? serviceMetaToHtml(post.meta) : metaToHtml(post.meta);
  const isPlaceholder = /this is a comprehensive post about/i.test(stripTags(originalContent));
  const content = structuredContent
    ? `${isPlaceholder ? "" : originalContent}${structuredContent}`
    : originalContent;
  return {
    ...post,
    content,
    excerpt:
      post.excerpt || metaString(post.meta, "meta_description") || stripTags(content).slice(0, 220),
    seo_title: post.seo_title || metaString(post.meta, "meta_title") || post.title,
    seo_description:
      post.seo_description ||
      metaString(post.meta, "meta_description") ||
      stripTags(content).slice(0, 158),
  };
}

function metaImageUrl(meta: unknown): string | null {
  if (!meta || typeof meta !== "object") return null;
  const record = meta as Record<string, unknown>;
  for (const key of ["fifu_image_url", "_thumbnail_url", "rank_math_facebook_image", "og_image"]) {
    const raw = record[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) return value.trim();
  }
  return null;
}

function firstHtmlImage(html: string | null | undefined): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

async function postFromDatabase(slug: string) {
  const sb = serverClient();
  const { data: row } = await sb
    .from("wp_posts")
    .select(
      "id, post_type, status, slug, title, excerpt, content, permalink, path, post_date, post_modified, seo_title, seo_description, featured_media_id, meta",
    )
    .eq("post_type", "post")
    .eq("slug", slug)
    .eq("status", "publish")
    .limit(1)
    .maybeSingle();
  if (!row) return null;

  let heroUrl: string | null = null;
  if (row.featured_media_id && row.featured_media_id > 0) {
    const { data: media } = await sb
      .from("wp_media")
      .select("storage_url, source_url")
      .eq("id", row.featured_media_id)
      .maybeSingle();
    heroUrl = media?.source_url || media?.storage_url || null;
  }
  heroUrl = heroUrl || metaImageUrl(row.meta) || firstHtmlImage(row.content);

  const { data: links } = await sb
    .from("wp_post_terms")
    .select("term_id, taxonomy")
    .eq("post_id", row.id);
  const termIds = (links || []).map((l) => l.term_id);
  const { data: terms } = termIds.length
    ? await sb.from("wp_terms").select("id, name, slug, taxonomy, parent_id").in("id", termIds)
    : {
        data: [] as {
          id: number;
          name: string | null;
          slug: string;
          taxonomy: string;
          parent_id: number | null;
        }[],
      };

  const mapped = (terms || []).map((t) => ({
    id: t.id,
    name: t.name || t.slug,
    slug: t.slug,
    parent_id: t.parent_id,
    taxonomy: t.taxonomy,
  }));

  return {
    post: hydratedPost(row as unknown as LocalPost),
    heroUrl,
    categories: mapped.filter((t) => t.taxonomy === "category"),
    tags: mapped.filter((t) => t.taxonomy === "post_tag"),
  };
}

export const getLocalPostBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    let post: LocalPost | null = null;
    try {
      const index = await getWpDataIndex();
      post = await findItemFromRefs(
        (index.slugs[data.slug] || []).filter((ref) => ref.kind === "posts"),
        (item) => item.status === "publish" && item.slug === data.slug,
      );
    } catch {
      post = null;
    }
    if (!post) return await postFromDatabase(data.slug);
    const hydrated = hydratedPost(post);
    const heroUrl =
      post.fifu_image_url || metaImageUrl(post.meta) || firstHtmlImage(hydrated.content) || null;
    const fallbackHero = heroUrl ? null : await postFromDatabase(data.slug);
    return {
      post: hydrated,
      heroUrl: heroUrl || fallbackHero?.heroUrl || null,
      categories: (post.terms || [])
        .filter((term) => term.taxonomy === "category")
        .map((term, index) => ({
          id: index + 1,
          name: term.name,
          slug: term.slug,
          parent_id: null,
          taxonomy: term.taxonomy,
        })),
      tags: (post.terms || [])
        .filter((term) => term.taxonomy === "post_tag")
        .map((term, index) => ({
          id: index + 1000,
          name: term.name,
          slug: term.slug,
          parent_id: null,
          taxonomy: term.taxonomy,
        })),
    };
  });

type ServiceLink = { title: string; href: string; excerpt?: string | null };

function toLink(row: {
  title: string | null;
  path: string | null;
  excerpt?: string | null;
}): ServiceLink {
  return {
    title:
      stripTags(row.title) || normalizePath(row.path).split("/").filter(Boolean).pop() || "Service",
    href: normalizePath(row.path),
    excerpt: stripTags(row.excerpt || "").slice(0, 130),
  };
}

async function serviceTreeFromDb(slug: string) {
  const base = `/services/${slug}`;
  const sb = serverClient();
  const { data: rows } = await sb
    .from("wp_posts")
    .select(
      "id, post_type, status, slug, title, excerpt, content, path, post_date, seo_title, seo_description, fifu_image_url, meta",
    )
    .or(`path.eq.${base},path.eq.${base}/`)
    .eq("status", "publish")
    .limit(1);
  const page = (rows || [])[0] as unknown as LocalPost | undefined;
  if (!page) return null;

  const grab = async (pattern: string, limit: number) => {
    const { data } = await sb
      .from("wp_posts")
      .select("title, path, excerpt")
      .eq("status", "publish")
      .like("path", pattern)
      .order("title", { ascending: true })
      .limit(limit);
    return (data || []).filter((row) => normalizePath(row.path) !== base).map(toLink);
  };

  const [all, industries, locations] = await Promise.all([
    grab(`${base}/%`, 400),
    grab(`${base}/industries/%`, 120),
    grab(`${base}/location/%`, 120),
  ]);
  const { count } = await sb
    .from("wp_posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "publish")
    .like("path", `${base}/%`);

  return { page, children: all, industries, locations, childCount: count || all.length };
}

export const getLocalServiceBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const path = `/services/${data.slug}`;
    let page: LocalPost | undefined;
    let children: ServiceLink[] = [];
    let industries: ServiceLink[] = [];
    let locations: ServiceLink[] = [];
    let childCount = 0;

    try {
      const index = await getWpDataIndex();
      const serviceLine = index.services.find((service) => service.slug === data.slug);
      const pages = serviceLine ? await readWpShard(serviceLine.file) : [];
      const found = pages.find(
        (item) => item.status === "publish" && normalizePath(item.path) === path,
      );
      if (found) {
        page = found;
        const kids = pages.filter(
          (item) => item.status === "publish" && normalizePath(item.path).startsWith(`${path}/`),
        );
        childCount = kids.length;
        children = kids.map((item) => toLink(item));
        industries = kids
          .filter((item) => normalizePath(item.path).startsWith(`${path}/industries/`))
          .slice(0, 120)
          .map((item) => toLink(item));
        locations = kids
          .filter((item) => normalizePath(item.path).startsWith(`${path}/location/`))
          .slice(0, 120)
          .map((item) => toLink(item));
      }
    } catch {
      page = undefined;
    }

    if (!page) {
      const tree = await serviceTreeFromDb(data.slug).catch(() => null);
      if (!tree) return null;
      page = tree.page;
      children = tree.children;
      industries = tree.industries;
      locations = tree.locations;
      childCount = tree.childCount;
    }

    const hydrated = hydratedPost(page);
    const hero = structuredServiceMeta(page.meta, "hero_section") as any;
    const about = structuredServiceMeta(page.meta, "aboutexpertise_section") as any;
    const services = structuredServiceMeta(page.meta, "our_services") as any;
    const process = structuredServiceMeta(page.meta, "process") as any;
    const faqs = structuredServiceMeta(page.meta, "faqs") as any;
    const related = await relatedPostsForService(data.slug);
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
          ...(Array.isArray(about?.bullets)
            ? about.bullets.map((item: any) => itemTitle(item, "Benefit"))
            : []),
        ].filter(Boolean),
        structured: {
          hero,
          about,
          services,
          process,
          faqs,
          promoVideo:
            metaString(page.meta, "promovideo") || metaString(page.meta, "promo_video") || null,
        },
        sections: serviceMetaSections(page.meta),
      },
      children,
      industries,
      locations,
      related,
      childCount,
    };
  });

const RELATED_SEGMENT_ALIASES: Record<string, string> = {
  web: "websites",
  "web-design": "websites",
  digital: "digital",
  "social-media": "social-media",
  "lead-generaton": "lead-generation",
  "technical-skills": "technical",
  supports: "support",
  "bulk-publishing": "content",
  dubbing: "creative",
  game: "game",
};

async function relatedPostsForService(slug: string) {
  const segment = RELATED_SEGMENT_ALIASES[slug] || slug;
  try {
    const sb = serverClient();
    const { data } = await sb
      .from("wp_posts")
      .select("id, title, excerpt, path, post_date, seo_description")
      .eq("post_type", "post")
      .eq("status", "publish")
      .like("path", `/${segment}/%`)
      .order("post_date", { ascending: false })
      .limit(7);
    return (data || []).map((row) => ({
      title: stripTags(row.title) || "Article",
      href: normalizePath(row.path),
      excerpt: stripTags(row.excerpt || row.seo_description || "").slice(0, 180),
      date: row.post_date,
      slug: normalizePath(row.path).split("/").filter(Boolean).pop() || `post-${row.id}`,
    }));
  } catch {
    return [] as {
      title: string;
      href: string;
      excerpt: string;
      date: string | null;
      slug: string;
    }[];
  }
}

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
