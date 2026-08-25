import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_content",
  title: "Search content",
  description:
    "Search published posts, pages, services and comparisons on usmanjatoi.com by title. Returns slugs, paths and excerpts.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Words to match against the title."),
    post_type: z
      .string()
      .optional()
      .describe("Optional content type filter, e.g. 'post', 'page', 'service'."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, post_type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("wp_posts")
      .select("id, title, slug, path, post_type, post_date, excerpt, seo_description")
      .eq("status", "publish")
      .ilike("title", `%${query}%`)
      .order("post_date", { ascending: false })
      .limit(limit ?? 10);
    if (post_type) q = q.eq("post_type", post_type);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? []).map((r) => ({
      ...r,
      excerpt: typeof r.excerpt === "string" ? r.excerpt.slice(0, 300) : r.excerpt,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { results: rows, count: rows.length },
    };
  },
});
