import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type PostOutline = {
  slug: string;
  title: string | null;
  stats: string[];
  quotes: string[];
  insights: string[];
  examples: string[];
  risks: string[];
  tools: string[];
  citations: string[];
  takeaways: string[];
  best_practices: string[];
  ai_notes: string[];
};

const OUTLINE_COLUMNS =
  "slug, title, stats, quotes, insights, examples, risks, tools, citations, takeaways, best_practices, ai_notes";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 1);
}

function normalize(row: Record<string, unknown>): PostOutline {
  return {
    slug: String(row["slug"] ?? ""),
    title: (row["title"] as string) ?? null,
    stats: toList(row["stats"]),
    quotes: toList(row["quotes"]),
    insights: toList(row["insights"]),
    examples: toList(row["examples"]),
    risks: toList(row["risks"]),
    tools: toList(row["tools"]),
    citations: toList(row["citations"]),
    takeaways: toList(row["takeaways"]),
    best_practices: toList(row["best_practices"]),
    ai_notes: toList(row["ai_notes"]),
  };
}

export async function readOutline(slug: string): Promise<PostOutline | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("wp_post_outlines")
    .select(OUTLINE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return normalize(data as Record<string, unknown>);
}

export const getPostOutline = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(300) }).parse(input))
  .handler(async ({ data }) => readOutline(data.slug));
