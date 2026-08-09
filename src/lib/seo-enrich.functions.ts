import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/**
 * Research engine backed by the user's own you.com API keys.
 * It never touches Lovable AI credits — every call goes straight to you.com
 * from the server runtime using the keys stored in project secrets.
 */

const KEY_ENV = [
  "you_info_usmanjatoi",
  "you_me_usmanjatoi",
  "you_job_usmanjatoi",
  "you_social_usmanjatoi",
  "you_contact_usmanjatoi",
  "you_info_wpbulkpublishing",
] as const;

type ResearchHit = { title: string; url: string; snippet: string };
export type ResearchResult = {
  ok: boolean;
  provider: string;
  answer: string;
  hits: ResearchHit[];
  error?: string;
};

function keys() {
  return KEY_ENV.map((name) => ({ name, value: process.env[name] })).filter(
    (k): k is { name: string; value: string } => Boolean(k.value),
  );
}

async function callYouCom(query: string): Promise<ResearchResult> {
  const available = keys();
  if (!available.length) {
    return { ok: false, provider: "you.com", answer: "", hits: [], error: "No you.com API key configured." };
  }
  let lastError = "";
  for (const key of available) {
    // Smart API (answer + citations)
    try {
      const res = await fetch("https://chat-api.you.com/smart", {
        method: "POST",
        headers: { "X-API-Key": key.value, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const text = await res.text();
      if (res.ok) {
        const json = JSON.parse(text) as {
          answer?: string;
          search_results?: Array<{ name?: string; url?: string; snippet?: string }>;
        };
        return {
          ok: true,
          provider: `you.com/smart (${key.name})`,
          answer: json.answer ?? "",
          hits: (json.search_results ?? []).slice(0, 8).map((h) => ({
            title: h.name ?? "",
            url: h.url ?? "",
            snippet: h.snippet ?? "",
          })),
        };
      }
      lastError = `smart ${res.status}: ${text.slice(0, 160)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }

    // Search API fallback
    try {
      const res = await fetch(
        `https://api.ydc-index.io/search?query=${encodeURIComponent(query)}`,
        { headers: { "X-API-Key": key.value } },
      );
      const text = await res.text();
      if (res.ok) {
        const json = JSON.parse(text) as {
          hits?: Array<{ title?: string; url?: string; description?: string; snippets?: string[] }>;
        };
        const hits = (json.hits ?? []).slice(0, 8).map((h) => ({
          title: h.title ?? "",
          url: h.url ?? "",
          snippet: h.description ?? (h.snippets ?? []).join(" ").slice(0, 400),
        }));
        return {
          ok: true,
          provider: `you.com/search (${key.name})`,
          answer: hits.map((h) => h.snippet).join(" ").slice(0, 1200),
          hits,
        };
      }
      lastError = `search ${res.status}: ${text.slice(0, 160)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  return { ok: false, provider: "you.com", answer: "", hits: [], error: lastError };
}

export const researchTopic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ query: z.string().min(3).max(400) }).parse(input))
  .handler(async ({ data }) => callYouCom(data.query));

function sentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
}

function clamp(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function keywordsFrom(text: string, title: string) {
  const stop = new Set(
    "the a an and or for with your you this that from into what how why are is be to of in on it as at by we our us can will more best top guide 2024 2025 2026".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  for (const word of `${title} ${text}`.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []) {
    if (stop.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);
}

export type EnrichmentPreview = {
  path: string;
  title: string;
  current: { seo_title: string | null; seo_description: string | null };
  suggested: { seo_title: string; seo_description: string; keywords: string[] };
  faqs: Array<{ question: string; answer: string }>;
  citations: Array<{ title: string; url: string }>;
  research: ResearchResult;
};

export const previewEnrichment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ path: z.string().min(1).max(400) }).parse(input))
  .handler(async ({ data, context }): Promise<EnrichmentPreview> => {
    const { data: post, error } = await context.supabase
      .from("wp_posts")
      .select("id, path, title, seo_title, seo_description, post_type")
      .eq("path", data.path)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error(`No published page at ${data.path}`);

    const isService = String(post.post_type) === "page" && data.path.includes("/services/");
    const topic = String(post.title ?? data.path);
    const query = isService
      ? `${topic} services — buyer questions, pricing signals, deliverables, and what clients search for in 2026`
      : `${topic} — latest facts, statistics, expert guidance and common questions in 2026`;

    const research = await callYouCom(query);
    const body = research.answer || research.hits.map((h) => h.snippet).join(" ");
    const lines = sentences(body);

    const suggestedTitle = clamp(
      isService ? `${topic} Services | Usman Jatoi` : `${topic} — Expert Guide by Usman Jatoi`,
      60,
    );
    const suggestedDesc = clamp(
      lines[0] ?? `${topic}: practical, experience-backed guidance from Usman Jatoi.`,
      155,
    );

    const faqs = research.hits.slice(0, 5).map((hit, i) => ({
      question: hit.title || `${topic} — question ${i + 1}`,
      answer: clamp(hit.snippet || lines[i + 1] || "", 320),
    }));

    return {
      path: data.path,
      title: topic,
      current: { seo_title: post.seo_title, seo_description: post.seo_description },
      suggested: {
        seo_title: suggestedTitle,
        seo_description: suggestedDesc,
        keywords: keywordsFrom(body, topic),
      },
      faqs: faqs.filter((f) => f.answer.length > 30),
      citations: research.hits.slice(0, 6).map((h) => ({ title: h.title, url: h.url })),
      research,
    };
  });

export const applyEnrichment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        path: z.string().min(1).max(400),
        seo_title: z.string().min(5).max(120),
        seo_description: z.string().min(20).max(320),
        keywords: z.array(z.string().max(60)).max(20).default([]),
        faqs: z
          .array(z.object({ question: z.string().max(300), answer: z.string().max(1200) }))
          .max(10)
          .default([]),
        citations: z
          .array(z.object({ title: z.string().max(300), url: z.string().max(500) }))
          .max(10)
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: post, error } = await context.supabase
      .from("wp_posts")
      .select("id, meta")
      .eq("path", data.path)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error(`No page at ${data.path}`);

    const meta = { ...(((post.meta ?? {}) as Record<string, unknown>) || {}) };
    meta["enrichment"] = {
      keywords: data.keywords,
      faqs: data.faqs,
      citations: data.citations,
      updated_at: new Date().toISOString(),
      source: "you.com",
    };

    const { error: upErr } = await context.supabase
      .from("wp_posts")
      .update({
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        meta,
        enriched_at: new Date().toISOString(),
        enrich_source: "you.com",
      })
      .eq("id", post.id);
    if (upErr) throw new Error(upErr.message);
    return { ok: true };
  });

/** Highest-value targets first: service pages, then thin/meta-less posts. */
export const listEnrichmentQueue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ scope: z.enum(["services", "posts"]).default("services") }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("wp_posts")
      .select("path, title, seo_title, seo_description, enriched_at")
      .eq("status", "publish")
      .is("enriched_at", null)
      .limit(60);
    q =
      data.scope === "services"
        ? q.like("path", "%/services/%")
        : q.eq("post_type", "post").or("seo_description.is.null,seo_description.eq.");
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as Array<{
      path: string;
      title: string | null;
      seo_title: string | null;
      seo_description: string | null;
      enriched_at: string | null;
    }>;
  });
