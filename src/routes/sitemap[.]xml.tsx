import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://usmanjatoi.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const supa = createClient(url!, key!, { auth: { persistSession: false } });

        const urls: Array<{ loc: string; lastmod?: string; priority?: string }> = [
          { loc: `${SITE}/`, priority: "1.0" },
          { loc: `${SITE}/services`, priority: "0.9" },
          { loc: `${SITE}/blog`, priority: "0.9" },
          { loc: `${SITE}/about-me`, priority: "0.8" },
          { loc: `${SITE}/contact-me`, priority: "0.8" },
        ];

        // Paginate wp_posts so we don't hit row limits.
        const pageSize = 1000;
        for (let from = 0; from < 60000; from += pageSize) {
          const { data, error } = await supa
            .from("wp_posts")
            .select("path, post_modified, post_type")
            .in("post_type", ["page", "post", "product", "courses"])
            .eq("status", "publish")
            .not("path", "is", null)
            .range(from, from + pageSize - 1);
          if (error || !data || data.length === 0) break;
          for (const row of data as Array<{ path: string; post_modified: string | null; post_type: string }>) {
            if (!row.path) continue;
            const clean = row.path.replace(/\/+$/, "");
            urls.push({
              loc: `${SITE}${clean}`,
              lastmod: row.post_modified ? new Date(row.post_modified).toISOString() : undefined,
              priority: row.post_type === "page" ? "0.7" : "0.6",
            });
          }
          if (data.length < pageSize) break;
        }

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map(
              (u) =>
                `  <url><loc>${u.loc}</loc>` +
                (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
                (u.priority ? `<priority>${u.priority}</priority>` : "") +
                `</url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;

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
