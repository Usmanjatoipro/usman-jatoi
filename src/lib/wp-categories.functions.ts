import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
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

export interface WpCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent_id: number | null;
  count: number;
}

export interface WpCategoryNode extends WpCategory {
  children: WpCategoryNode[];
}

export interface WpPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  permalink: string | null;
  post_date: string | null;
  featured_image: string | null;
}

function decodeEntities(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export const listCategoriesTree = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
  async (): Promise<{ tree: WpCategoryNode[]; flat: WpCategory[] }> => {
    const sb = serverClient();
    const { data, error } = await sb
      .from("wp_terms")
      .select("id, slug, name, description, parent_id, count")
      .eq("taxonomy", "category")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    const flat: WpCategory[] = (data ?? []).map((c: any) => ({
      id: Number(c.id),
      slug: c.slug,
      name: decodeEntities(c.name),
      description: decodeEntities(c.description),
      parent_id: c.parent_id ? Number(c.parent_id) : null,
      count: c.count ?? 0,
    }));
    const map = new Map<number, WpCategoryNode>();
    flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
    const tree: WpCategoryNode[] = [];
    map.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node);
      } else {
        tree.push(node);
      }
    });
    const sortRec = (nodes: WpCategoryNode[]) => {
      nodes.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      nodes.forEach((n) => sortRec(n.children));
    };
    sortRec(tree);
    return { tree, flat };
  },
);

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; page?: number }) =>
    z.object({ slug: z.string().min(1), page: z.number().int().min(1).max(50).optional() }).parse(data),
  )
  .handler(async ({ data }) => {
    const sb = serverClient();
    const pageSize = 24;
    const page = data.page ?? 1;

    const { data: cat, error: catErr } = await sb
      .from("wp_terms")
      .select("id, slug, name, description, parent_id, count")
      .eq("taxonomy", "category")
      .eq("slug", data.slug)
      .maybeSingle();
    if (catErr) throw new Error(catErr.message);
    if (!cat) return null;

    const category: WpCategory = {
      id: Number(cat.id),
      slug: cat.slug,
      name: decodeEntities(cat.name),
      description: decodeEntities(cat.description),
      parent_id: cat.parent_id ? Number(cat.parent_id) : null,
      count: cat.count ?? 0,
    };

    // Breadcrumb ancestors
    const ancestors: WpCategory[] = [];
    let pid = category.parent_id;
    while (pid) {
      const { data: p } = await sb
        .from("wp_terms")
        .select("id, slug, name, description, parent_id, count")
        .eq("id", pid)
        .maybeSingle();
      if (!p) break;
      ancestors.unshift({
        id: Number(p.id),
        slug: p.slug,
        name: decodeEntities(p.name),
        description: decodeEntities(p.description),
        parent_id: p.parent_id ? Number(p.parent_id) : null,
        count: p.count ?? 0,
      });
      pid = p.parent_id ? Number(p.parent_id) : null;
    }

    // Children
    const { data: childrenRaw } = await sb
      .from("wp_terms")
      .select("id, slug, name, description, parent_id, count")
      .eq("taxonomy", "category")
      .eq("parent_id", category.id)
      .order("count", { ascending: false });
    const children: WpCategory[] = (childrenRaw ?? []).map((c: any) => ({
      id: Number(c.id),
      slug: c.slug,
      name: decodeEntities(c.name),
      description: decodeEntities(c.description),
      parent_id: c.parent_id ? Number(c.parent_id) : null,
      count: c.count ?? 0,
    }));

    // Posts in category via join table
    const { data: linkRows } = await sb
      .from("wp_post_terms")
      .select("post_id")
      .eq("taxonomy", "category")
      .eq("term_id", category.id);
    const postIds = (linkRows ?? []).map((r: any) => Number(r.post_id));
    const total = postIds.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const paged = postIds.slice((page - 1) * pageSize, page * pageSize);

    let posts: WpPostSummary[] = [];
    if (paged.length) {
      const { data: postRows } = await sb
        .from("wp_posts")
        .select("id, slug, title, excerpt, permalink, post_date, raw")
        .in("id", paged)
        .eq("status", "publish")
        .order("post_date", { ascending: false });
      posts = (postRows ?? []).map((p: any) => {
        const raw = p.raw ?? {};
        const media = raw?._embedded?.["wp:featuredmedia"]?.[0];
        const featured =
          media?.source_url ||
          raw?.yoast_head_json?.og_image?.[0]?.url ||
          raw?.jetpack_featured_media_url ||
          null;
        return {
          id: Number(p.id),
          slug: p.slug,
          title: decodeEntities(p.title),
          excerpt: decodeEntities((p.excerpt ?? "").replace(/<[^>]+>/g, "")).slice(0, 240),
          permalink: p.permalink ?? null,
          post_date: p.post_date,
          featured_image: featured,
        };
      });
    }

    return { category, ancestors, children, posts, page, pageSize, total, totalPages };
  });
