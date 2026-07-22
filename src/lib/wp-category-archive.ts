import { supabase } from "@/integrations/supabase/client";

export type CatTerm = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  parent_id: number | null;
  count: number;
};

export type CatPost = {
  id: number;
  title: string | null;
  slug: string;
  excerpt: string | null;
  path: string | null;
  permalink: string | null;
  post_date: string | null;
  featured_media_id: number | null;
  featured_image: string | null;
};

export type CategoryArchive = {
  category: CatTerm;
  ancestors: CatTerm[];
  children: CatTerm[];
  posts: CatPost[];
  total: number;
  page: number;
  totalPages: number;
};

const PAGE_SIZE = 24;

function decodeEntities(s: string | null | undefined) {
  if (!s) return s ?? "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeTerm(t: any): CatTerm {
  return {
    id: t.id,
    slug: t.slug,
    name: decodeEntities(t.name),
    description: decodeEntities(t.description),
    parent_id: t.parent_id,
    count: t.count ?? 0,
  };
}

/**
 * Given a URL path like /websites/ or /websites/web-innovations/, try to resolve
 * it to a category archive by matching the final segment against wp_terms and
 * walking up the parent chain to verify the ancestor slugs match.
 */
export async function loadCategoryArchiveByPath(
  rawPath: string,
  page = 1,
): Promise<CategoryArchive | null> {
  const segs = rawPath.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segs.length === 0) return null;
  const lastSlug = decodeURIComponent(segs[segs.length - 1]);

  const { data: candidates } = await supabase
    .from("wp_terms")
    .select("id,slug,name,description,parent_id,count,taxonomy")
    .eq("taxonomy", "category")
    .eq("slug", lastSlug)
    .limit(5);

  if (!candidates || candidates.length === 0) return null;

  // Walk ancestors for each candidate; keep the one whose chain matches the path segments.
  let matched: any = null;
  let matchedAncestors: CatTerm[] = [];
  for (const c of candidates) {
    const chain: CatTerm[] = [];
    let current: any = c;
    let ok = true;
    // Walk upward; must match segs from the end backwards.
    for (let i = segs.length - 2; i >= 0; i--) {
      if (!current.parent_id) {
        ok = false;
        break;
      }
      const { data: parent } = await supabase
        .from("wp_terms")
        .select("id,slug,name,description,parent_id,count,taxonomy")
        .eq("id", current.parent_id)
        .maybeSingle();
      if (!parent || parent.slug !== decodeURIComponent(segs[i])) {
        ok = false;
        break;
      }
      chain.unshift(normalizeTerm(parent));
      current = parent;
    }
    // top of the chain must be a root (no parent) once we've consumed all segs
    if (ok && current.parent_id === null) {
      matched = c;
      matchedAncestors = chain;
      break;
    }
    if (ok && segs.length === 1 && !c.parent_id) {
      matched = c;
      matchedAncestors = [];
      break;
    }
  }

  if (!matched) return null;
  const category = normalizeTerm(matched);

  // Child categories (direct)
  const { data: childData } = await supabase
    .from("wp_terms")
    .select("id,slug,name,description,parent_id,count")
    .eq("taxonomy", "category")
    .eq("parent_id", category.id)
    .order("name");
  const children = (childData ?? []).map(normalizeTerm);

  // Posts in this category
  const { data: linkRows, count } = await supabase
    .from("wp_post_terms")
    .select("post_id", { count: "exact" })
    .eq("term_id", category.id)
    .eq("taxonomy", "category");

  const postIds = (linkRows ?? []).map((r: any) => r.post_id);
  const total = count ?? postIds.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const from = (currentPage - 1) * PAGE_SIZE;
  const pageIds = postIds.slice(from, from + PAGE_SIZE);

  let posts: CatPost[] = [];
  if (pageIds.length > 0) {
    const { data: postRows } = await supabase
      .from("wp_posts")
      .select("id,title,slug,excerpt,path,permalink,post_date,featured_media_id")
      .in("id", pageIds)
      .eq("status", "publish")
      .order("post_date", { ascending: false });

    const mediaIds = (postRows ?? [])
      .map((p: any) => p.featured_media_id)
      .filter(Boolean);
    const mediaMap = new Map<number, string>();
    if (mediaIds.length) {
      const { data: mediaRows } = await supabase
        .from("wp_media")
        .select("id,storage_url,source_url")
        .in("id", mediaIds);
      (mediaRows ?? []).forEach((m: any) => {
        mediaMap.set(m.id, m.storage_url || m.source_url || "");
      });
    }
    posts = (postRows ?? []).map((p: any) => ({
      id: p.id,
      title: decodeEntities(p.title),
      slug: p.slug,
      excerpt: decodeEntities(p.excerpt),
      path: p.path,
      permalink: p.permalink,
      post_date: p.post_date,
      featured_media_id: p.featured_media_id,
      featured_image: p.featured_media_id ? mediaMap.get(p.featured_media_id) ?? null : null,
    }));
  }

  return {
    category,
    ancestors: matchedAncestors,
    children,
    posts,
    total,
    page: currentPage,
    totalPages,
  };
}
