import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchContentTool from "./tools/search-content";
import getContentTool from "./tools/get-content";
import contentStatsTool from "./tools/content-stats";
import listLeadsTool from "./tools/list-leads";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "usman-jatoi",
  title: "Usman Jatoi",
  version: "0.1.0",
  instructions:
    "Tools for the Usman Jatoi site. Use `search_content` to find posts, pages, services and comparisons, `get_content` to read one item in full, `content_stats` for published counts, and `list_leads` for recent contact submissions (administrators only).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchContentTool, getContentTool, contentStatsTool, listLeadsTool],
});
