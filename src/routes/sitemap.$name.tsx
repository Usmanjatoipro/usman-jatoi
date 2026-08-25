import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://usmanjatoi.com";
const CHUNK = 2000;

const TYPE_MAP: Record<string, string[]> = {
  services: ["page"],
  pages: ["page"],
  posts: ["post"],
  products: ["product"],
  courses: ["courses"],
};

const STATIC_URLS = [
  { path: "/", priority: "1.0" },
  { path: "/services", priority: "0.9" },
  { path: "/blog", priority: "0.9" },
  { path: "/about-me", priority: "0.8" },
  { path: "/contact-me", priority: "0.8" },
  { path: "/media-kit", priority: "0.6" },
  { path: "/careers", priority: "0.6" },
  { path: "/businesses", priority: "0.6" },
  { path: "/press-release", priority: "0.6" },
  { path: "/testimonials", priority: "0.6" },
  { path: "/awards", priority: "0.6" },
  { path: "/certifications", priority: "0.6" },
  { path: "/white-label-partnership", priority: "0.6" },
];

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function respond(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function wrap(urls: Array<{ loc: string; lastmod?: string; priority?: string }>) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${xmlEscape(u.loc)}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
          (u.priority ? `<priority>${u.priority}</priority>` : "") +
          `</url>`,
      )
      .join("\n") +
    `\n</urlset>\n`
  );
}

export const Route = createFileRoute("/sitemap/$name")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = Object.values((params ?? {}) as Record<string, string>).find(Boolean) ?? "";
        const name = String(raw).replace(/\.xml$/i, "");

        if (name === "static") {
          return respond(
            wrap(
              STATIC_URLS.map((u) => ({
                loc: `${SITE}${u.path}`,
                priority: u.priority,
              })),
            ),
          );
        }

        const m = name.match(/^([a-z]+)-(\d+)$/);
        if (!m) return respond(wrap([]), 404);
        const group = m[1];
        const page = parseInt(m[2], 10);
        if (page < 1) return respond(wrap([]), 404);

        const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const supa = createClient(url!, key!, { auth: { persistSession: false } });

        const from = (page - 1) * CHUNK;
        const to = from + CHUNK - 1;

        if (group === "categories") {
          const { data, error } = await supa
            .from("wp_terms")
            .select("slug")
            .eq("taxonomy", "category")
            .order("id", { ascending: true })
            .range(from, to);
          if (error || !data) return respond(wrap([]));
          return respond(
            wrap(
              (data as Array<{ slug: string }>)
                .filter((r) => r.slug)
                .map((r) => ({ loc: `${SITE}/category/${r.slug}`, priority: "0.5" })),
            ),
          );
        }

        const types = TYPE_MAP[group];
        if (!types) return respond(wrap([]), 404);

        type Row = { path: string; post_modified: string | null; post_type: string };
        const rows: Row[] = [];
        // Supabase caps a single response at 1000 rows, so fetch the chunk in slices.
        for (let offset = from; offset <= to; offset += 1000) {
          const sliceTo = Math.min(offset + 999, to);
          let data: Row[] | null = null;
          let error: any = null;

          if (group === "services") {
            const res = await supa
              .from("wp_posts")
              .select("path, post_modified, post_type")
              .in("post_type", types)
              .eq("status", "publish")
              .not("path", "is", null)
              .ilike("path", "/services/%")
              .order("id", { ascending: true })
              .range(offset, sliceTo);
            data = res.data as Row[] | null;
            error = res.error;
          } else if (group === "pages") {
            const res = await supa
              .from("wp_posts")
              .select("path, post_modified, post_type")
              .in("post_type", types)
              .eq("status", "publish")
              .not("path", "is", null)
              .not("path", "ilike", "/services/%")
              .order("id", { ascending: true })
              .range(offset, sliceTo);
            data = res.data as Row[] | null;
            error = res.error;
          } else {
            const res = await supa
              .from("wp_posts")
              .select("path, post_modified, post_type")
              .in("post_type", types)
              .eq("status", "publish")
              .not("path", "is", null)
              .order("id", { ascending: true })
              .range(offset, sliceTo);
            data = res.data as Row[] | null;
            error = res.error;
          }

          if (error || !data) break;
          rows.push(...data);
          if (data.length < sliceTo - offset + 1) break;
        }

        const urls = rows
          .filter((r) => r.path)
          .map((r) => ({
            loc: `${SITE}${r.path.replace(/\/+$/, "")}`,
            lastmod: r.post_modified ? new Date(r.post_modified).toISOString() : undefined,
            priority:
              group === "services"
                ? "1.0"
                : r.post_type === "page"
                  ? "0.8"
                  : "0.7",
          }));

        return respond(wrap(urls));
      },
    },
  },
});
