import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_content",
  title: "Get content item",
  description:
    "Fetch one published item by slug or path, including its body text, SEO title and description.",
  inputSchema: {
    slug: z.string().trim().optional().describe("Slug of the item, e.g. 'ai'."),
    path: z.string().trim().optional().describe("Full site path, e.g. '/services/ai/'."),
    include_html: z.boolean().optional().describe("Return rendered HTML instead of plain content."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, path, include_html }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    if (!slug && !path)
      return { content: [{ type: "text", text: "Provide either slug or path." }], isError: true };
    const supabase = supabaseForUser(ctx);
    const columns = `id, title, slug, path, permalink, post_type, post_date, post_modified, excerpt, seo_title, seo_description, ${
      include_html ? "content_html" : "content"
    }`;
    let q = supabase.from("wp_posts").select(columns).eq("status", "publish").limit(1);
    q = path ? q.eq("path", path) : q.eq("slug", slug!);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const row = data?.[0];
    if (!row) return { content: [{ type: "text", text: "No published item found." }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      structuredContent: { item: row },
    };
  },
});
