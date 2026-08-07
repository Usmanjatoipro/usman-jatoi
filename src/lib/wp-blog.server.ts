import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

export type BlogIndexPost = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  post_date: string | null;
  featured_media_id: number | null;
  meta: Json;
};

export type BlogIndexMedia = {
  id: number;
  storage_url: string | null;
  source_url: string | null;
  alt_text: string | null;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Content service is unavailable");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
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

export async function readBlogIndexPage(offset: number, limit: number, search: string) {
  const client = publicClient();
  let query = client
    .from("wp_posts")
    .select("id,slug,title,excerpt,content,post_date,featured_media_id,meta", { count: "exact" })
    .eq("post_type", "post")
    .eq("status", "publish")
    .order("post_date", { ascending: false })
    .range(offset, offset + limit - 1);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  const posts = (data ?? []) as BlogIndexPost[];
  const mediaIds = posts
    .map((post) => post.featured_media_id)
    .filter((id): id is number => typeof id === "number" && id > 0);
  const media: Record<number, BlogIndexMedia> = {};
  if (mediaIds.length) {
    const { data: rows } = await client
      .from("wp_media")
      .select("id,storage_url,source_url,alt_text")
      .in("id", mediaIds);
    for (const row of (rows ?? []) as BlogIndexMedia[]) media[row.id] = row;
  }
  return { posts, media, total: count ?? 0 };
}