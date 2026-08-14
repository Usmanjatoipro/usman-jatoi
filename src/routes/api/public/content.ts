import { createFileRoute } from "@tanstack/react-router";
import { publicClient } from "@/lib/comparisons.server";

/**
 * Public, read-only content API over the site's imported WordPress content.
 *
 *   GET /api/public/content?path=/comparisons/usman-jatoi-vs-marie-haynes/
 *   GET /api/public/content?slug=usman-jatoi-vs-marie-haynes
 *   GET /api/public/content?type=post&limit=50&offset=0
 *   GET /api/public/content?type=page&path_prefix=/comparisons/&fields=full
 *   GET /api/public/content?search=marie&limit=20
 *   GET /api/public/content?stats=1
 *
 * Only published content is exposed and only content columns are selected —
 * no user data, no credentials.
 */

const LIGHT = "id,slug,path,title,excerpt,post_type,post_date,post_modified,seo_title,seo_description";
const FULL = `${LIGHT},content,content_html,meta`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300, s-maxage=600",
    },
  });
}

export const Route = createFileRoute("/api/public/content")({
  server: {
    handlers: {
      OPTIONS: () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET,OPTIONS",
            "access-control-allow-headers": "content-type",
          },
        }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams;
        const client = publicClient();

        try {
          if (q.get("stats")) {
            const counts: Record<string, number> = {};
            for (const type of ["post", "page"]) {
              const { count } = await client
                .from("wp_posts")
                .select("id", { count: "planned", head: true })
                .eq("post_type", type)
                .eq("status", "publish");
              counts[type] = count ?? 0;
            }
            return json({
              ok: true,
              counts,
              endpoints: [
                "?path=/comparisons/usman-jatoi-vs-marie-haynes/",
                "?slug=<slug>",
                "?type=post&limit=50&offset=0",
                "?path_prefix=/comparisons/&fields=full",
                "?search=<text>",
              ],
            });
          }

          const path = q.get("path");
          const slug = q.get("slug");
          const fields = q.get("fields") === "light" ? LIGHT : FULL;

          if (path || slug) {
            let single = client.from("wp_posts").select(FULL).eq("status", "publish").limit(1);
            single = path ? single.eq("path", path) : single.eq("slug", slug!);
            const { data, error } = await single;
            if (error) throw error;
            const row = (data ?? [])[0] as Record<string, unknown> | undefined;
            if (!row) return json({ ok: false, error: "Not found" }, 404);
            return json({ ok: true, item: row });
          }

          const limit = Math.min(Number(q.get("limit") ?? 50) || 50, 200);
          const offset = Math.max(Number(q.get("offset") ?? 0) || 0, 0);
          let query = client
            .from("wp_posts")
            .select(q.get("fields") === "full" ? FULL : LIGHT, { count: "planned" })
            .eq("status", "publish")
            .order("post_date", { ascending: false })
            .range(offset, offset + limit - 1);

          const type = q.get("type");
          if (type) query = query.eq("post_type", type);
          const prefix = q.get("path_prefix");
          if (prefix) query = query.ilike("path", `${prefix}%`);
          const search = q.get("search");
          if (search) query = query.ilike("title", `%${search}%`);

          const { data, count, error } = await query;
          if (error) throw error;
          return json({
            ok: true,
            total: count ?? null,
            limit,
            offset,
            items: data ?? [],
            next:
              (data ?? []).length === limit
                ? `${url.pathname}?${new URLSearchParams({ ...Object.fromEntries(q), offset: String(offset + limit) })}`
                : null,
          });
        } catch (err) {
          return json({ ok: false, error: (err as Error).message }, 500);
        }
      },
    },
  },
});
