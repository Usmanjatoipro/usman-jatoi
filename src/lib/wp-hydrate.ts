// Shared renderer that turns imported WordPress structured meta fields into HTML.
// Each section keeps the heading that lives inside its own content — we never
// prepend a generic field label ("Intro", "What Is It?") on top of it.

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
  comparison_tables: "Comparison",
  comparison: "Comparison",
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
  intro: "",
};

function labelFromKey(key: string) {
  if (key in LABELS) return LABELS[key];
  return key
    .replace(/^_+/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseJson(value: string): any {
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
    item?.title || item?.heading || item?.name || item?.topic || item?.term || item?.question || fallback,
  );
}

function itemDescription(item: any) {
  return stripTags(
    item?.description || item?.subtitle || item?.answer || item?.definition || item?.content || item?.text || "",
  );
}

function cellHtml(value: any): string {
  if (Array.isArray(value))
    return `<ul class="cell-list">${value.map((v) => `<li>${escapeHtml(stripTags(String(v)))}</li>`).join("")}</ul>`;
  return escapeHtml(stripTags(String(value ?? "")));
}

function keyCandidates(column: string) {
  const base = stripTags(column).toLowerCase().trim();
  return [
    base,
    base.replace(/\s+/g, "-"),
    base.replace(/\s+/g, "_"),
    base.replace(/\s+/g, ""),
    base.replace(/\s+/g, "-").replace(/s$/, ""),
  ];
}

/** Rich comparison table: resolves each column against the row object keys. */
function comparisonHtml(data: any): string {
  const columns: string[] = data.columns || data.headers || [];
  const rows: any[] = data.rows || [];
  if (!columns.length || !rows.length) return "";
  const body = rows
    .map((row) => {
      const cells = Array.isArray(row)
        ? row.map((c) => cellHtml(c))
        : columns.map((col) => {
            const cands = keyCandidates(col);
            const found = Object.keys(row).find((k) => cands.includes(k.toLowerCase().replace(/\s+/g, "-")) || cands.includes(k.toLowerCase()));
            return cellHtml(found ? row[found] : "—");
          });
      return `<tr>${cells.map((c, i) => `<td data-label="${escapeHtml(columns[i] || "")}">${c || "—"}</td>`).join("")}</tr>`;
    })
    .join("");
  return `<div class="uj-table"><table><thead><tr>${columns
    .map((c) => `<th>${escapeHtml(stripTags(c))}</th>`)
    .join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function prosConsHtml(data: any): string {
  const pros: any[] = data.pros || data.benefits || data.advantages || [];
  const cons: any[] = data.cons || data.drawbacks || data.limitations || [];
  if (!pros.length && !cons.length) return "";
  const col = (items: any[], kind: "pro" | "con", label: string) =>
    `<div class="uj-pc-col uj-pc-${kind}"><div class="uj-pc-head">${label}</div><ul>${items
      .map((it) => {
        if (typeof it === "string") return `<li><strong>${escapeHtml(it)}</strong></li>`;
        const d = itemDescription(it);
        return `<li><strong>${escapeHtml(itemTitle(it, label))}</strong>${d ? `<p>${escapeHtml(d)}</p>` : ""}</li>`;
      })
      .join("")}</ul></div>`;
  return `<div class="uj-proscons">${pros.length ? col(pros, "pro", "Pros") : ""}${
    cons.length ? col(cons, "con", "Cons") : ""
  }</div>`;
}

function checklistHtml(data: any): string {
  const items: any[] = data.items || data.checklist || data.steps || [];
  if (!items.length) return "";
  return `<ul class="uj-checklist">${items
    .map((it, i) => {
      const t = typeof it === "string" ? it : itemTitle(it, `Item ${i + 1}`);
      const d = typeof it === "string" ? "" : itemDescription(it);
      return `<li><label><input type="checkbox" /><span class="uj-box"></span><span class="uj-ck-body"><strong>${escapeHtml(
        t,
      )}</strong>${d ? `<em>${escapeHtml(d)}</em>` : ""}</span></label></li>`;
    })
    .join("")}</ul>`;
}

function timelineHtml(data: any): string {
  const items: any[] = data.items || data.timeline || data.events || [];
  if (!items.length) return "";
  return `<ol class="uj-timeline">${items
    .map((it, i) => {
      const t = itemTitle(it, `Phase ${i + 1}`);
      const d = itemDescription(it);
      const when = stripTags(it?.year || it?.date || it?.period || "");
      return `<li><span class="uj-dot">${i + 1}</span><div class="uj-tl-card">${
        when ? `<span class="uj-when">${escapeHtml(when)}</span>` : ""
      }<h3>${escapeHtml(t)}</h3>${d ? `<p>${escapeHtml(d)}</p>` : ""}</div></li>`;
    })
    .join("")}</ol>`;
}

function stepsHtml(data: any): string {
  const steps: any[] = data.steps || data.items || [];
  if (!steps.length) return "";
  return `<div class="uj-steps">${steps
    .map((it, i) => {
      const tips: any[] = Array.isArray(it?.tips) ? it.tips : [];
      return `<article><span class="uj-step-n">${escapeHtml(
        String(it?.step_number || it?.step || i + 1),
      )}</span><h3>${escapeHtml(itemTitle(it, `Step ${i + 1}`))}</h3><p>${escapeHtml(
        itemDescription(it),
      )}</p>${
        tips.length
          ? `<ul class="uj-tips">${tips.map((t) => `<li>${escapeHtml(stripTags(String(t)))}</li>`).join("")}</ul>`
          : ""
      }</article>`;
    })
    .join("")}</div>`;
}

function faqHtml(data: any): string {
  const items: any[] = Array.isArray(data) ? data : data.faqs || data.items || data.questions || [];
  if (!items.length) return "";
  return `<div class="uj-faqs">${items
    .map(
      (it) =>
        `<details><summary><span>${escapeHtml(itemTitle(it, "Question"))}</span></summary><div class="uj-faq-a"><p>${escapeHtml(
          itemDescription(it),
        )}</p></div></details>`,
    )
    .join("")}</div>`;
}

function glossaryHtml(data: any): string {
  const items: any[] = data.terms || data.items || data.glossary || [];
  if (!items.length) return "";
  return `<dl class="uj-glossary">${items
    .map(
      (it) =>
        `<div><dt>${escapeHtml(itemTitle(it, "Term"))}</dt><dd>${escapeHtml(itemDescription(it))}</dd></div>`,
    )
    .join("")}</dl>`;
}

function bulletsHtml(data: any): string {
  const out: string[] = [];
  for (const key of ["features", "bullets", "points", "tips", "mistakes", "myths", "takeaways", "benefits", "drawbacks"]) {
    const arr = data[key];
    if (Array.isArray(arr) && arr.length) {
      out.push(
        `<ul class="uj-bullets">${arr
          .map((it: any) => {
            if (typeof it === "string") return `<li>${escapeHtml(it)}</li>`;
            const d = itemDescription(it);
            return `<li><strong>${escapeHtml(itemTitle(it, "Item"))}</strong>${d ? `<p>${escapeHtml(d)}</p>` : ""}</li>`;
          })
          .join("")}</ul>`,
      );
    }
  }
  return out.join("");
}

function cardsHtml(items: any[], fallbackLabel: string): string {
  return `<div class="uj-cards">${items
    .map(
      (it, i) =>
        `<article><h3>${escapeHtml(itemTitle(it, `${fallbackLabel} ${i + 1}`))}</h3><p>${escapeHtml(
          itemDescription(it),
        )}</p></article>`,
    )
    .join("")}</div>`;
}

/** Render one structured (JSON) field into its designed markup. */
function renderJsonSection(key: string, data: any): { heading: string; body: string } {
  const heading =
    (data && !Array.isArray(data) && stripTags(data["main-title"] || data.section_title || data.title || "")) ||
    labelFromKey(key) ||
    "";
  const intro =
    data && !Array.isArray(data)
      ? stripTags(data.section_subtitle || data.subtitle || data.intro || data.description || "")
      : "";
  const lead = intro ? `<p>${escapeHtml(intro)}</p>` : "";

  const k = key.toLowerCase();
  let body = "";

  if (Array.isArray(data)) {
    body = cardsHtml(data, "Item");
  } else if (k.includes("faq")) {
    body = faqHtml(data);
  } else if (k.includes("pros") || k.includes("cons")) {
    body = prosConsHtml(data);
  } else if (k.includes("comparison")) {
    body = comparisonHtml(data);
  } else if (k.includes("checklist")) {
    body = checklistHtml(data);
  } else if (k.includes("timeline")) {
    body = timelineHtml(data);
  } else if (k.includes("process") || k.includes("step") || k.includes("action")) {
    body = stepsHtml(data);
  } else if (k.includes("glossary")) {
    body = glossaryHtml(data);
  }

  if (!body) {
    body =
      prosConsHtml(data) ||
      comparisonHtml(data) ||
      stepsHtml(data) ||
      timelineHtml(data) ||
      faqHtml(data) ||
      glossaryHtml(data) ||
      bulletsHtml(data) ||
      (Array.isArray(data?.services) ? cardsHtml(data.services, "Service") : "") ||
      (Array.isArray(data?.items) ? cardsHtml(data.items, "Item") : "");
  }

  return { heading, body: `${lead}${body}` };
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
  "schema",
  "faq_schema",
  "json_ld",
  "jsonld",
  "structured_data",
]);

const ORDER = [
  "intro",
  "hero_section",
  "takeaways",
  "WhatisX",
  "GlossaryRelatedTerms",
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

function hasOwnHeading(html: string) {
  return /<h[1-3][\s>]/i.test(html);
}

/** Render structured meta fields to HTML sections, ordered like the original site. */
export function metaSectionsToHtml(meta: MetaRecord): string {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return "";
  const entries = Object.entries(meta).filter(([key, value]) => {
    if (SKIP_KEYS.has(key) || key.startsWith("_")) return false;
    if (/schema|json_?ld/i.test(key)) return false;
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
      const parsed = typeof raw === "object" && raw !== null ? raw : parseJson(value);

      // Structured data → designed component markup with its own title.
      if (parsed) {
        const { heading, body } = renderJsonSection(key, parsed);
        if (!body.trim()) return "";
        return `<section class="migrated-field" data-field="${escapeHtml(key)}">${
          heading ? `<h2>${escapeHtml(heading)}</h2>` : ""
        }${body}</section>`;
      }

      // HTML content → keep exactly as authored; it already carries its heading.
      const isHtml = /<\/?[a-z][\s\S]*>/i.test(value);
      const html = isHtml ? value.replace(/<script[\s\S]*?<\/script>/gi, "") : `<p>${escapeHtml(value)}</p>`;
      if (!html.trim()) return "";
      const label = labelFromKey(key);
      const needsHeading = !hasOwnHeading(html) && !!label;
      return `<section class="migrated-field" data-field="${escapeHtml(key)}">${
        needsHeading ? `<h2>${escapeHtml(label)}</h2>` : ""
      }${html}</section>`;
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
