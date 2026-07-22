import mediaData from "@/data/wp-media-manifest.json";
import postsData from "@/data/wp-posts-manifest.json";
import pagesData from "@/data/wp-pages-manifest.json";
import termsData from "@/data/wp-terms-manifest.json";
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
  slug: string;
  title: string;
  alt_text: string;
  source_url: string;
  storage_url: string;
  pub_date: string;
};

// 1. Fetch media by ID
export async function getWpMedia(id: number | null): Promise<WpMediaItem | null> {
  if (!id) return null;
  
  // Try Supabase first
  try {
    const { data } = await supabase
      .from("wp_media")
      .select("id, slug, title, alt_text, source_url, storage_url")
      .eq("id", id)
      .maybeSingle();
    if (data) return data as unknown as WpMediaItem;
  } catch (e) {
    // Fallback to local manifest
  }

  const found = (mediaData as unknown as WpMediaItem[]).find((m) => m.id === id);
  return found || null;
}

// 2. Fetch page/post by path or slug
export async function getWpPageOrPostByPath(rawPath: string): Promise<{ post: WpPostItem; media: WpMediaItem | null } | null> {
  let cleanPath = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  const withSlash = cleanPath.endsWith("/") ? cleanPath : cleanPath + "/";
  const noSlash = cleanPath.replace(/\/+$/, "");

  // Try Supabase first
  try {
    const { data } = await supabase
      .from("wp_posts")
      .select("id, post_type, status, slug, title, excerpt, content, permalink, path, post_date, post_modified, seo_title, seo_description, featured_media_id")
      .in("path", [withSlash, noSlash])
      .eq("status", "publish")
      .limit(1);

    if (data && data.length > 0) {
      const post = data[0] as unknown as WpPostItem;
      const media = await getWpMedia(post.featured_media_id);
      return { post, media };
    }
  } catch (e) {
    // Fallback
  }

  // Local fallback search across pages then posts
  const slug = cleanPath.replace(/^\//, "");
  const pageMatch = (pagesData as WpPostItem[]).find(
    (p) => p.path === withSlash || p.path === noSlash || p.slug === slug
  );

  if (pageMatch) {
    const media = (mediaData as unknown as WpMediaItem[]).find((m) => m.id === pageMatch.featured_media_id) || null;
    return { post: pageMatch, media };
  }

  const postMatch = (postsData as WpPostItem[]).find(
    (p) => p.path === withSlash || p.path === noSlash || p.slug === slug
  );

  if (postMatch) {
    const media = (mediaData as unknown as WpMediaItem[]).find((m) => m.id === postMatch.featured_media_id) || null;
    return { post: postMatch, media };
  }

  return null;
}

// 3. Fetch blog post by slug
export async function getWpPostBySlug(slug: string): Promise<{ post: WpPostItem; media: WpMediaItem | null } | null> {
  try {
    const { data } = await supabase
      .from("wp_posts")
      .select("id, post_type, status, slug, title, excerpt, content, permalink, path, post_date, post_modified, seo_title, seo_description, featured_media_id")
      .eq("post_type", "post")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      const post = data as unknown as WpPostItem;
      const media = await getWpMedia(post.featured_media_id);
      return { post, media };
    }
  } catch (e) {
    // Fallback
  }

  const match = (postsData as WpPostItem[]).find((p) => p.slug === slug);
  if (match) {
    const media = (mediaData as unknown as WpMediaItem[]).find((m) => m.id === match.featured_media_id) || null;
    return { post: match, media };
  }

  return null;
}

// 4. Fetch list of blog posts with pagination
export async function getWpPostsList(page: number = 0, pageSize: number = 24, search: string = "") {
  try {
    let query = supabase
      .from("wp_posts")
      .select("id, slug, title, excerpt, post_date, featured_media_id", { count: "exact" })
      .eq("post_type", "post")
      .eq("status", "publish")
      .order("post_date", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, count, error } = await query.range(page * pageSize, (page + 1) * pageSize - 1);
    if (!error && data && data.length > 0) {
      return { posts: data as unknown as WpPostItem[], total: count || data.length };
    }
  } catch (e) {
    // Fallback
  }

  // Local manifest fallback
  let list = (postsData as WpPostItem[]).filter((p) => p.status === "publish");
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((p) => (p.title || "").toLowerCase().includes(s));
  }
  const total = list.length;
  const start = page * pageSize;
  const posts = list.slice(start, start + pageSize);

  return { posts, total };
}
