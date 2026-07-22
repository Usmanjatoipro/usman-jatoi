/**
 * wp-data.ts — client-safe WordPress data helpers.
 * Only uses Supabase (no large JSON imports). The server-side versions
 * with local JSON fallback live in wp-data.server.ts.
 */
import { supabase } from "@/integrations/supabase/client";

export type WpPostItem = {
  id: number;
  post_type: string;
  status: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  permalink: string | null;
  path: string | null;
  post_date: string | null;
  post_modified?: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured_media_id: number | null;
  terms?: { taxonomy: string; slug: string; name: string }[];
};

export type WpMediaItem = {
  id: number;
  slug?: string;
  title?: string;
  alt_text?: string | null;
  source_url: string;
  storage_url?: string | null;
};

// Fetch media by ID
export async function getWpMedia(id: number | null): Promise<WpMediaItem | null> {
  if (!id) return null;
  try {
    const { data } = await supabase
      .from("wp_media")
      .select("id, slug, title, alt_text, source_url, storage_url")
      .eq("id", id)
      .maybeSingle();
    if (data) return data as unknown as WpMediaItem;
  } catch (_) {}
  return null;
}

// Fetch multiple media items
export async function getWpMediaMap(ids: number[]): Promise<Record<number, WpMediaItem>> {
  if (!ids.length) return {};
  try {
    const { data } = await supabase
      .from("wp_media")
      .select("id, slug, title, alt_text, source_url, storage_url")
      .in("id", ids);
    const map: Record<number, WpMediaItem> = {};
    for (const m of (data || []) as WpMediaItem[]) map[m.id] = m;
    return map;
  } catch (_) {}
  return {};
}

// Fetch post by slug (client-side Supabase only)
export async function getWpPostBySlug(slug: string): Promise<{ post: WpPostItem; media: WpMediaItem | null } | null> {
  try {
    const { data } = await supabase
      .from("wp_posts")
      .select("id,post_type,status,slug,title,excerpt,content,permalink,path,post_date,post_modified,seo_title,seo_description,featured_media_id")
      .eq("post_type", "post")
      .eq("status", "publish")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return null;
    const media = await getWpMedia((data as any).featured_media_id);
    return { post: data as unknown as WpPostItem, media };
  } catch (_) {}
  return null;
}

// Fetch page/post by URL path (client-side Supabase only)
export async function getWpPageOrPostByPath(rawPath: string): Promise<{ post: WpPostItem; media: WpMediaItem | null } | null> {
  const clean = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  const withSlash = clean.endsWith("/") ? clean : clean + "/";
  const noSlash = clean.replace(/\/+$/, "");
  try {
    const { data } = await supabase
      .from("wp_posts")
      .select("id,post_type,status,slug,title,excerpt,content,permalink,path,post_date,post_modified,seo_title,seo_description,featured_media_id")
      .in("post_type", ["page", "post", "product", "courses"])
      .in("path", [withSlash, noSlash])
      .eq("status", "publish")
      .limit(1);
    if (data && data.length > 0) {
      const media = await getWpMedia((data[0] as any).featured_media_id);
      return { post: data[0] as unknown as WpPostItem, media };
    }
  } catch (_) {}
  return null;
}

// Fetch paginated posts list (client-side Supabase only)
export async function getWpPostsList(
  page = 0,
  pageSize = 24,
  search = ""
): Promise<{ posts: WpPostItem[]; total: number }> {
  try {
    let q = supabase
      .from("wp_posts")
      .select("id,slug,title,excerpt,post_date,featured_media_id", { count: "exact" })
      .eq("post_type", "post")
      .eq("status", "publish")
      .order("post_date", { ascending: false });
    if (search) q = (q as any).ilike("title", `%${search}%`);
    const { data, count } = await (q as any).range(page * pageSize, (page + 1) * pageSize - 1);
    return { posts: (data || []) as WpPostItem[], total: count ?? 0 };
  } catch (_) {}
  return { posts: [], total: 0 };
}
