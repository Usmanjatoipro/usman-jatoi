// Shared renderer that turns imported WordPress structured meta fields into HTML.
// Used by the generic page route so migrated sections (FAQ, process, glossary…)
// render even when the post body itself is empty.

type MetaValue = unknown;
export type MetaRecord = Record<string, MetaValue> | null | undefined;

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

function stripTags(value: string | null | undefined) {
  return decodeHtml(value);
}

function escapeHtml(value: string | null | undefined) {
  return decodeHtml(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LABELS: Record<string, string> = {
  aboutexpertise_section: "About & Expertise",
  BestPracticesTips: "Best Practices & Tips",
  CommonMistakesMyths: "Common Mistakes & Myths",
  GlossaryRelatedTerms: "Glossary & Related Terms",
  "ProcessStep-by-Step": "Process Step by Step",
  WhatisX: "What Is It?",
  beginners_tips: "Beginner Tips",
  advanced_tips: "Advanced Tips",
  comparison_tables: "Comparison Tables",
  hero_section: "Overview",
  our_services: "Our Services",
  pros_cons: "Pros & Cons",
  why_important: "Why It Matters",
  process: "Process Step by Step",
  faqs: "Frequently Asked Questions",
  takeaways: "Key Takeaways",
  case_studies: "Case Studies",
  checklist: "Checklist",
  timeline: "Timeline",
  examples: "Examples",
  intro: "Introduction",
};

function labelFromKey(key: string) {
  return (
    LABELS[key] ||
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
  return stripTags(item?.title || item?.heading || item?.name || item?.topic || item?.term || item?.question || fallback);
}

function itemDescription(item: any) {
  return stripTags(item?.description || item?.subtitle || item?.answer || item?.definition || item?.content || item?.text || "");
}

function listHtml(items: any[]) {
  return `<ul>${items
    .map((item) => {
      if (typeof item === "string") return `<li>${escapeHtml(item)}</li>`;
      const desc = itemDescription(item);
      return `<li><strong>${escapeHtml(itemTitle(item, "Item"))}</strong>${desc ? `<p>${escapeHtml(desc)}</p>` : ""}</li>`;
    })
    .join("")}</ul>`;
}

function tableHtml(data: any) {
  const table = data?.comparison || data;
  const headers = table?.headers || data?.columns;
  const rows = table?.rows || data?.rows;
  if (!Array.isArray(headers) || !Array.isArray(rows)) return "";
  return `<div class="migrated-table"><table><thead><tr>${headers
    .map((h: any) => `<th>${escapeHtml(stripTags(String(h)))}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .slice(0, 24)
    .map((row: any) => {
      const cells = Array.isArray(row) ? row : [row.name || row.topic, ...(row.values || [])];
      return `<tr>${cells
        .map(
          (cell: any) =>
            `<td>${escapeHtml(Array.isArray(cell) ? cell.map(stripTags).join(", ") : stripTags(String(cell ?? "")))}</td>`,
        )
        .join("")}</tr>`;
    })
    .join("")}</tbody></table></div>`;
}

function jsonToHtml(data: any): string {
  if (Array.isArray(data)) return listHtml(data);
  if (!data || typeof data !== "object") return `<p>${escapeHtml(String(data ?? ""))}</p>`;

  const title = stripTags(data["main-title"] || data.section_title || data.title || "");
  const subtitle = stripTags(data.section_subtitle || data.subtitle || data.intro || data.description || "");
  const parts: string[] = [
    title ? `<h3>${escapeHtml(title)}</h3>` : "",
    subtitle ? `<p>${escapeHtml(subtitle)}</p>` : "",
  ];

  for (const key of ["features", "bullets", "points", "tips", "mistakes", "myths", "terms", "benefits", "drawbacks", "pros", "cons"]) {
    if (Array.isArray(data[key]) && data[key].length) {
      parts.push(`<h4>${escapeHtml(labelFromKey(key))}</h4>${listHtml(data[key])}`);
    }
  }

  if (Array.isArray(data.services)) {
    parts.push(
      `<div class="migrated-grid">${data.services
        .map(
          (item: any, index: number) =>
            `<article><h3>${escapeHtml(itemTitle(item, `Service ${index + 1}`))}</h3><p>${escapeHtml(itemDescription(item))}</p>${
              item?.link ? `<a href="${String(item.link).replace(/^https?:\/\/usmanjatoi\.com/i, "")}">Open service</a>` : ""
            }</article>`,
        )
        .join("")}</div>`,
    );
  }

  const steps = Array.isArray(data.steps) ? data.steps : Array.isArray(data.items) ? data.items : [];
  if (steps.length) {
    parts.push(
      `<div class="migrated-steps">${steps
        .map(
          (item: any, index: number) =>
            `<article><span>${escapeHtml(String(item?.step_number || item?.step || index + 1))}</span><h3>${escapeHtml(
              itemTitle(item, `Step ${index + 1}`),
            )}</h3><p>${escapeHtml(itemDescription(item))}</p></article>`,
        )
        .join("")}</div>`,
    );
  }

  if (Array.isArray(data.faqs)) {
    parts.push(
      `<div class="migrated-faqs">${data.faqs
        .map(
          (item: any) =>
            `<details open><summary>${escapeHtml(itemTitle(item, "Question"))}</summary><p>${escapeHtml(
              itemDescription(item),
            )}</p></details>`,
        )
        .join("")}</div>`,
    );
  }

  parts.push(tableHtml(data));
  return parts.filter(Boolean).join("");
}

const SKIP_KEYS = new Set([
  "meta_title",
  "meta_description",
  "canonical_url",
  "robots",
  "og_title",
  "og_description",
  "og_image",
  "og_type",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
  "rank_math_title",
  "rank_math_description",
  "rank_math_seo_score",
  "rank_math_focus_keyword",
  "rank_math_primary_category",
  "rank_math_robots",
  "rank_math_sitemap_include",
  "_yoast_wpseo_title",
  "_yoast_wpseo_metadesc",
  "_wp_page_template",
  "_elementor_template_type",
  "fifu_image_url",
  "fifu_image_alt",
  "category_path",
  "ocg_status_log",
  "ocg_last_generated",
  "pcg_last_generated",
  "ekit_post_views_count",
  "promo_video",
]);

const ORDER = [
  "intro",
  "hero_section",
  "takeaways",
  "WhatisX",
  "why_important",
  "aboutexpertise_section",
  "our_services",
  "examples",
  "process",
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
  "GlossaryRelatedTerms",
  "BenefitsAdvantages",
  "DrawbacksLimitations",
  "StrategiesFrameworks",
  "ActionPlanHowtoImplement",
  "FuturePredictions",
  "faqs",
];

function toText(value: MetaValue): string {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v).join("\n\n");
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

/** Render structured meta fields to HTML sections, ordered like the original site. */
export function metaSectionsToHtml(meta: MetaRecord): string {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return "";
  const entries = Object.entries(meta).filter(([key, value]) => {
    if (SKIP_KEYS.has(key) || key.startsWith("_")) return false;
    return toText(value).trim().length > 0;
  });
  if (!entries.length) return "";

  entries.sort(([a], [b]) => {
    const ai = ORDER.indexOf(a);
    const bi = ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return entries
    .map(([key, raw]) => {
      const value = toText(raw);
      const parsed = parseJson(value);
      const body = parsed
        ? jsonToHtml(parsed)
        : /<\/?[a-z][\s\S]*>/i.test(value)
          ? value.replace(/<script[\s\S]*?<\/script>/gi, "")
          : `<p>${escapeHtml(value)}</p>`;
      if (!body.trim()) return "";
      return `<section class="migrated-field" data-field="${escapeHtml(key)}"><h2>${escapeHtml(
        labelFromKey(key),
      )}</h2>${body}</section>`;
    })
    .filter(Boolean)
    .join("");
}

/** Combine an imported body with its structured meta sections. */
export function hydrateContentHtml(content: string | null | undefined, meta: MetaRecord): string {
  const body = content && stripTags(content) ? content : "";
  const sections = metaSectionsToHtml(meta);
  if (!sections) return body;
  const isPlaceholder = /this is a comprehensive (post|page) about/i.test(stripTags(body));
  return `${isPlaceholder ? "" : body}${sections}`;
}
