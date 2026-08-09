import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const HTML_SITEMAP_PAGE_SIZE = 1500;

export type SitemapLink = { path: string; title: string };

function publicClient() {
  const url = process.env["SUPABASE_URL"] ?? import.meta.env.VITE_SUPABASE_URL;
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export const getHtmlSitemapPage = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        kind: z.enum(["post", "page", "category"]),
        page: z.number().int().min(1).max(50),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supa = publicClient();
    if (!supa) return { links: [] as SitemapLink[], total: 0 };

    const from = (data.page - 1) * HTML_SITEMAP_PAGE_SIZE;
    const to = from + HTML_SITEMAP_PAGE_SIZE - 1;

    if (data.kind === "category") {
      const { data: rows, count } = await supa
        .from("wp_terms")
        .select("slug, name", { count: "exact" })
        .eq("taxonomy", "category")
        .order("name", { ascending: true })
        .range(from, to);
      return {
        total: count ?? 0,
        links: ((rows ?? []) as Array<{ slug: string; name: string | null }>).map((r) => ({
          path: `/category/${r.slug}`,
          title: r.name || r.slug,
        })),
      };
    }

    const { data: rows, count } = await supa
      .from("wp_posts")
      .select("path, slug, title", { count: "exact" })
      .eq("post_type", data.kind)
      .eq("status", "publish")
      .not("path", "is", null)
      .order("id", { ascending: true })
      .range(from, to);

    return {
      total: count ?? 0,
      links: ((rows ?? []) as Array<{ path: string | null; slug: string; title: string | null }>)
        .filter((r) => r.path)
        .map((r) => ({
          path: (r.path as string).replace(/\/+$/, "") || "/",
          title: (r.title || r.slug).replace(/<[^>]*>/g, "").trim(),
        })),
    };
  });
