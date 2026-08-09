import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ClusterStat = {
  slug: string;
  name: string | null;
  parent_id: number | null;
  posts: number;
  avg_len: number;
  with_outline: number;
  thin: number;
};

export type SectionStat = { section: string; items: number };

export type ContentStats = {
  generated_at: string | null;
  totals: Record<string, number>;
  total_published: number;
  media: number;
  categories: number;
  outlines: number;
  uncategorised_posts: number;
  quality: {
    missing_seo_title: number;
    missing_seo_description: number;
    thin_content: number;
    no_featured_media: number;
    avg_content_len: number;
  };
  clusters: ClusterStat[];
  sections: SectionStat[];
};

const EMPTY: ContentStats = {
  generated_at: null,
  totals: {},
  total_published: 0,
  media: 0,
  categories: 0,
  outlines: 0,
  uncategorised_posts: 0,
  quality: {
    missing_seo_title: 0,
    missing_seo_description: 0,
    thin_content: 0,
    no_featured_media: 0,
    avg_content_len: 0,
  },
  clusters: [],
  sections: [],
};

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

function shape(payload: Record<string, unknown>, generatedAt: string | null): ContentStats {
  return {
    ...EMPTY,
    ...(payload as Partial<ContentStats>),
    quality: { ...EMPTY.quality, ...((payload["quality"] as object) ?? {}) },
    clusters: (payload["clusters"] as ClusterStat[]) ?? [],
    sections: (payload["sections"] as SectionStat[]) ?? [],
    generated_at: generatedAt,
  };
}

export const getContentStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  if (!supabase) return EMPTY;
  const { data, error } = await supabase
    .from("content_stats_snapshot")
    .select("payload, generated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return EMPTY;
  return shape((data.payload ?? {}) as Record<string, unknown>, data.generated_at as string);
});

export const refreshContentStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("refresh_content_stats");
    if (error) throw new Error(error.message);
    return shape((data ?? {}) as Record<string, unknown>, new Date().toISOString());
  });
