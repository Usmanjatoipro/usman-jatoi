/**
 * wp-data.server.ts
 * SERVER-ONLY data helpers. These functions use dynamic imports of the large
 * JSON manifests for SSR fallback when Supabase tables are not yet populated.
 * NEVER import this file from client-side code.
 */
import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE_DEFAULT = 24;

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type PostSummary = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  path: string | null;
  post_type: string;
  status: string;
  post_date: string | null;
  featured_media_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type PostFull = PostSummary & {
  content: string | null;
  permalink: string | null;
  post_modified: string | null;
  terms?: { taxonomy: string; slug: string; name: string }[];
};

export type MediaItem = {
  id: number;
  slug?: string;
  title?: string;
  alt_text?: string | null;
  source_url: string;
  storage_url?: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function loadPostsSummary(): Promise<PostSummary[]> {
  const { default: data } = await import("@/data/wp-posts-summary.json");
  return data as PostSummary[];
}

async function loadPagesSummary(): Promise<PostSummary[]> {
  const { default: data } = await import("@/data/wp-pages-summary.json");
  return data as PostSummary[];
}

async function loadPostsFull(): Promise<PostFull[]> {
  const { default: data } = await import("@/data/wp-posts-manifest.json");
  return data as PostFull[];
}

async function loadPagesFull(): Promise<PostFull[]> {
  const { default: data } = await import("@/data/wp-pages-manifest.json");
  return data as PostFull[];
}

async function loadMedia(): Promise<MediaItem[]> {
  const { default: data } = await import("@/data/wp-media-manifest.json");
  return data as MediaItem[];
}

async function loadTerms() {
  const { default: data } = await import("@/data/wp-terms-manifest.json");
  return data as { taxonomy: string; slug: string; name: string }[];
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetch a single blog post by slug — Supabase first, then local JSON fallback */
export async function serverGetPostBySlug(slug: string): Promise<{ post: PostFull; media: MediaItem | null } | null> {
  const sb = serverClient();
  try {
    const { data } = await sb
      .from("wp_posts")
      .select("id,post_type,status,slug,title,excerpt,content,permalink,path,post_date,post_modified,seo_title,seo_description,featured_media_id")
      .eq("post_type", "post")
      .eq("status", "publish")
      .eq("slug", slug)
      .maybeSingle();
    if (data) {
      const media = await serverGetMedia((data as any).featured_media_id);
      return { post: data as unknown as PostFull, media };
    }
  } catch (_) {}

  // Local JSON fallback
  const posts = await loadPostsFull();
  const post = posts.find((p) => p.slug === slug && p.status === "publish");
  if (!post) return null;
  const media = await serverGetMedia(post.featured_media_id);
  return { post, media };
}

/** Fetch a page or post by URL path — Supabase first, then local JSON fallback */
export async function serverGetPageByPath(rawPath: string): Promise<{ post: PostFull; media: MediaItem | null } | null> {
  const clean = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  const withSlash = clean.endsWith("/") ? clean : clean + "/";
  const noSlash = clean.replace(/\/+$/, "");
  const slug = clean.replace(/^\//, "");

  const sb = serverClient();
  try {
    const { data } = await sb
      .from("wp_posts")
      .select("id,post_type,status,slug,title,excerpt,content,permalink,path,post_date,post_modified,seo_title,seo_description,featured_media_id")
      .in("post_type", ["page", "post", "product", "courses"])
      .in("path", [withSlash, noSlash])
      .eq("status", "publish")
      .limit(1);
    if (data && data.length > 0) {
      const media = await serverGetMedia((data[0] as any).featured_media_id);
      return { post: data[0] as unknown as PostFull, media };
    }
  } catch (_) {}

  // Local JSON fallback: check pages then posts
  const [pages, posts] = await Promise.all([loadPagesFull(), loadPostsFull()]);
  const match =
    [...pages, ...posts].find(
      (p) =>
        p.status === "publish" &&
        (p.path === withSlash || p.path === noSlash || p.slug === slug)
    );
  if (!match) return null;
  const media = await serverGetMedia(match.featured_media_id);
  return { post: match, media };
}

/** Fetch media item by ID — Supabase first, then local JSON fallback */
export async function serverGetMedia(id: number | null | undefined): Promise<MediaItem | null> {
  if (!id) return null;
  const sb = serverClient();
  try {
    const { data } = await sb.from("wp_media").select("id,slug,title,alt_text,source_url,storage_url").eq("id", id).maybeSingle();
    if (data) return data as unknown as MediaItem;
  } catch (_) {}

  const mediaList = await loadMedia();
  return mediaList.find((m) => m.id === id) ?? null;
}

/** Fetch paginated blog post listing — Supabase first, then local JSON fallback */
export async function serverGetPostsList(
  page = 0,
  pageSize = PAGE_SIZE_DEFAULT,
  search = ""
): Promise<{ posts: PostSummary[]; total: number; mediaMap: Record<number, MediaItem> }> {
  const sb = serverClient();
  try {
    let q = sb
      .from("wp_posts")
      .select("id,slug,title,excerpt,post_date,featured_media_id", { count: "exact" })
      .eq("post_type", "post")
      .eq("status", "publish")
      .order("post_date", { ascending: false });
    if (search) q = (q as any).ilike("title", `%${search}%`);
    const { data, count, error } = await (q as any).range(page * pageSize, (page + 1) * pageSize - 1);
    if (!error && data && data.length > 0) {
      const posts = data as PostSummary[];
      const mediaMap = await serverGetMediaMap(posts.map((p) => p.featured_media_id).filter((x): x is number => !!x));
      return { posts, total: count ?? data.length, mediaMap };
    }
  } catch (_) {}

  // Local JSON fallback
  let list = await loadPostsSummary();
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((p) => (p.title || "").toLowerCase().includes(s));
  }
  const total = list.length;
  list = [...list].sort((a, b) => (b.post_date || "").localeCompare(a.post_date || ""));
  const sliced = list.slice(page * pageSize, (page + 1) * pageSize);
  const mediaMap = await serverGetMediaMap(sliced.map((p) => p.featured_media_id).filter((x): x is number => !!x));
  return { posts: sliced, total, mediaMap };
}

/** Fetch a batch of media items by their IDs */
export async function serverGetMediaMap(ids: number[]): Promise<Record<number, MediaItem>> {
  if (!ids.length) return {};
  const sb = serverClient();
  try {
    const { data } = await sb.from("wp_media").select("id,slug,title,alt_text,source_url,storage_url").in("id", ids);
    if (data && data.length > 0) {
      const map: Record<number, MediaItem> = {};
      for (const m of data as MediaItem[]) map[m.id] = m;
      return map;
    }
  } catch (_) {}
  const mediaList = await loadMedia();
  const map: Record<number, MediaItem> = {};
  for (const id of ids) {
    const found = mediaList.find((m) => m.id === id);
    if (found) map[id] = found;
  }
  return map;
}

/** Fetch category with its posts — Supabase first, then terms+posts JSON fallback */
export async function serverGetCategoryBySlug(
  slug: string,
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT
): Promise<{
  category: { id: number; name: string; slug: string; description: string; parent_id: number | null; count: number };
  ancestors: any[];
  children: any[];
  posts: PostSummary[];
  page: number;
  totalPages: number;
  total: number;
  mediaMap: Record<number, MediaItem>;
} | null> {
  const sb = serverClient();
  try {
    // Try Supabase
    const { data: catData } = await sb
      .from("wp_terms")
      .select("id,slug,name,description,parent_id,count")
      .eq("taxonomy", "category")
      .eq("slug", slug)
      .maybeSingle();
    if (catData) {
      const cat = catData as any;
      // Get posts for this category
      const { data: ptData } = await sb
        .from("wp_post_terms")
        .select("post_id")
        .eq("term_id", cat.id)
        .eq("taxonomy", "category");
      const postIds = (ptData || []).map((r: any) => r.post_id);
      let posts: PostSummary[] = [];
      let total = 0;
      if (postIds.length) {
        const { data: postsData, count } = await sb
          .from("wp_posts")
          .select("id,slug,title,excerpt,post_date,featured_media_id", { count: "exact" })
          .in("id", postIds)
          .eq("status", "publish")
          .order("post_date", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
        posts = (postsData || []) as PostSummary[];
        total = count ?? 0;
      }
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const mediaMap = await serverGetMediaMap(posts.map((p) => p.featured_media_id).filter((x): x is number => !!x));
      return {
        category: { id: Number(cat.id), name: cat.name, slug: cat.slug, description: cat.description || "", parent_id: cat.parent_id ? Number(cat.parent_id) : null, count: cat.count || 0 },
        ancestors: [],
        children: [],
        posts,
        page,
        totalPages,
        total,
        mediaMap,
      };
    }
  } catch (_) {}

  // Local JSON fallback
  const terms = await loadTerms();
  const catTerm = terms.find((t) => t.taxonomy === "category" && t.slug === slug);
  if (!catTerm) return null;

  const postsList = await loadPostsSummary();
  const matching = postsList.filter((p) => p.status === "publish" && p.terms?.some((t: any) => t.slug === slug));
  const total = matching.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const sliced = matching.slice((page - 1) * pageSize, page * pageSize);
  const mediaMap = await serverGetMediaMap(sliced.map((p) => p.featured_media_id).filter((x): x is number => !!x));

  return {
    category: { id: 0, name: catTerm.name, slug: catTerm.slug, description: "", parent_id: null, count: total },
    ancestors: [],
    children: terms.filter((t) => t.taxonomy === "category").map((t) => ({ id: 0, slug: t.slug, name: t.name, description: "", parent_id: null, count: 0, children: [] })),
    posts: sliced,
    page,
    totalPages,
    total,
    mediaMap,
  };
}
