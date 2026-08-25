import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env
const envContent = fs.readFileSync(".env", "utf8");
envContent.split(/\r?\n/).forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    process.env[k] = v;
  }
});

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function main() {
  console.log("=== INSPECTING SERVICE PAGES IN SUPABASE ===");

  const clusters = [
    { name: "Website & Vibe Coding", filter: ["%website%", "%web-design%", "%web-dev%", "%vibe-coding%", "%wordpress%"] },
    { name: "SEO, Marketing & Geo", filter: ["%seo%", "%marketing%", "%geo%", "%local%", "%branding%"] },
    { name: "Technical & Automation", filter: ["%technical%", "%automation%", "%software%", "%development%", "%api%"] },
    { name: "AI Services", filter: ["%ai%", "%artificial-intelligence%", "%machine-learning%"] },
    { name: "Bulk Publishing", filter: ["%bulk-publishing%", "%publishing%", "%content-generation%"] },
  ];

  const { data: allServices, count } = await sb
    .from("wp_posts")
    .select("id, title, slug, path, post_type, post_modified", { count: "exact" })
    .eq("post_type", "page")
    .ilike("path", "/services/%")
    .limit(100);

  console.log(`Found total service pages in /services/: ${count}`);
  console.log("Sample top service pages:");
  allServices?.slice(0, 15).forEach((p) => {
    console.log(`- ${p.title} -> ${p.path}`);
  });
}

main().catch(console.error);
