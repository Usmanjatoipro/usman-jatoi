import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ComparisonRow = {
  id: number;
  slug: string;
  path: string | null;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  content_html: string | null;
  post_date: string | null;
  post_modified: string | null;
  seo_title: string | null;
  seo_description: string | null;
  meta: Record<string, string> | null;
};

export type ComparisonCard = {
  id: number;
  slug: string;
  title: string;
  rival: string;
  summary: string;
  image: string | null;
  post_date: string | null;
};

export function publicClient() {
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

const strip = (html: string | null | undefined) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

export function rivalName(title: string): string {
  const m = title.split(/\s+vs\.?\s+/i);
  if (m.length < 2) return "";
  return m
    .slice(1)
    .join(" vs ")
    .replace(/—.*$/, "")
    .replace(/\bHome$/, "")
    .trim();
}

export async function readComparisonList(search = ""): Promise<ComparisonCard[]> {
  const client = publicClient();
  let query = client
    .from("wp_posts")
    .select("id,slug,title,excerpt,post_date,image:meta->>fifu_image_url,og:meta->>og_image")
    .ilike("path", "/comparisons/%")
    .eq("status", "publish")
    .order("post_date", { ascending: false })
    .limit(300);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query.returns<
    {
      id: number;
      slug: string;
      title: string | null;
      excerpt: string | null;
      post_date: string | null;
      image: string | null;
      og: string | null;
    }[]
  >();
  if (error) throw new Error(error.message);

  const seen = new Set<string>();
  const cards: ComparisonCard[] = [];
  for (const row of data ?? []) {
    const title = strip(row.title) || row.slug;
    if (seen.has(title.toLowerCase())) continue;
    seen.add(title.toLowerCase());
    cards.push({
      id: row.id,
      slug: row.slug,
      title,
      rival: rivalName(title),
      summary: strip(row.excerpt).slice(0, 180),
      image: row.image || row.og || null,
      post_date: row.post_date,
    });
  }
  return cards;
}

export async function readComparison(slug: string) {
  const client = publicClient();
  const { data, error } = await client
    .from("wp_posts")
    .select(
      "id,slug,path,title,excerpt,content,content_html,post_date,post_modified,seo_title,seo_description,meta",
    )
    .eq("slug", slug)
    .ilike("path", "/comparisons/%")
    .limit(1)
    .returns<ComparisonRow[]>();
  if (error) throw new Error(error.message);
  const post = (data ?? [])[0];
  if (!post) return null;

  const meta = (post.meta || {}) as Record<string, string>;
  const heroUrl = meta.fifu_image_url || meta.og_image || null;
  const title = strip(post.title) || post.slug;

  const list = await readComparisonList();
  const index = list.findIndex((c) => c.slug === post.slug);
  const related = list
    .filter((c) => c.slug !== post.slug)
    .slice(index >= 0 ? Math.max(0, index - 3) : 0, index >= 0 ? Math.max(6, index + 3) : 6)
    .slice(0, 6);

  return {
    post: { ...post, content: post.content_html || post.content },
    title,
    rival: rivalName(title),
    heroUrl,
    related,
  };
}
