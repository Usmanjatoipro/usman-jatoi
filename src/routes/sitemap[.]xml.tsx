import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://usmanjatoi.com";
const CHUNK = 2000;

const GROUPS: Array<{
  key: string;
  types: string[];
  isServices?: boolean;
  isOtherPages?: boolean;
}> = [
  { key: "services", types: ["page"], isServices: true },
  { key: "pages", types: ["page"], isOtherPages: true },
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

        const children: string[] = [`${SITE}/sitemap/static.xml`];

        for (const g of GROUPS) {
          let total = 0;
          if (g.isServices) {
            const { count } = await supa
              .from("wp_posts")
              .select("id", { count: "exact", head: true })
              .in("post_type", g.types)
              .eq("status", "publish")
              .not("path", "is", null)
              .ilike("path", "/services/%");
            total = count ?? 0;
          } else if (g.isOtherPages) {
            const { count } = await supa
              .from("wp_posts")
              .select("id", { count: "exact", head: true })
              .in("post_type", g.types)
              .eq("status", "publish")
              .not("path", "is", null)
              .not("path", "ilike", "/services/%");
            total = count ?? 0;
          } else {
            const { count } = await supa
              .from("wp_posts")
              .select("id", { count: "exact", head: true })
              .in("post_type", g.types)
              .eq("status", "publish")
              .not("path", "is", null);
            total = count ?? 0;
          }

          if (total === 0) continue;
          const pages = Math.max(1, Math.ceil(total / CHUNK));
          for (let i = 1; i <= pages; i++) {
            children.push(`${SITE}/sitemap/${g.key}-${i}.xml`);
          }
        }

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          children.map((loc) => `  <sitemap><loc>${loc}</loc></sitemap>`).join("\n") +
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
