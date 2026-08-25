import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "content_stats",
  title: "Content stats",
  description: "Count published items on the site, optionally filtered by content type.",
  inputSchema: {
    post_type: z.string().trim().optional().describe("Optional content type, e.g. 'post' or 'page'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ post_type }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("wp_posts")
      .select("id", { count: "estimated", head: true })
      .eq("status", "publish");
    if (post_type) q = q.eq("post_type", post_type);
    const { count, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const summary = { post_type: post_type ?? "all", published_estimate: count ?? 0 };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
