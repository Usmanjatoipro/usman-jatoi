import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://usmanjatoi.lovable.app";
const CHUNK = 5000;

const GROUPS: Array<{ key: string; types: string[] }> = [
  { key: "pages", types: ["page"] },
  { key: "posts", types: ["post"] },
  { key: "products", types: ["product"] },
  { key: "courses", types: ["courses"] },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const supa = createClient(url!, key!, { auth: { persistSession: false } });

        const now = new Date().toISOString();
        const children: Array<{ loc: string; lastmod: string }> = [
          { loc: `${SITE}/sitemap-static.xml`, lastmod: now },
        ];

        for (const g of GROUPS) {
          const { count } = await supa
            .from("wp_posts")
            .select("id", { count: "exact", head: true })
            .in("post_type", g.types)
            .eq("status", "publish")
            .not("path", "is", null);
          const total = count ?? 0;
          const pages = Math.max(1, Math.ceil(total / CHUNK));
          if (total === 0) continue;
          for (let i = 1; i <= pages; i++) {
            children.push({ loc: `${SITE}/sitemap-${g.key}-${i}.xml`, lastmod: now });
          }
        }

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          children
            .map(
              (c) =>
                `  <sitemap><loc>${c.loc}</loc><lastmod>${c.lastmod}</lastmod></sitemap>`,
            )
            .join("\n") +
          `\n</sitemapindex>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
