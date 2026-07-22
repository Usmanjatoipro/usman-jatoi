import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
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
