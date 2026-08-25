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

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function testSitemap() {
  console.log("=== TESTING SITEMAP GENERATION ===");

  // 1. Test index counts
  const GROUPS = [
    { key: "pages", types: ["page"] },
    { key: "posts", types: ["post"] },
  ];

  const CHUNK = 2000;
  const children = [`https://usmanjatoi.com/sitemap/static.xml`];

  for (const g of GROUPS) {
    const { count } = await supa
      .from("wp_posts")
      .select("id", { count: "exact", head: true })
      .in("post_type", g.types)
      .eq("status", "publish")
      .not("path", "is", null);

    const pages = Math.max(1, Math.ceil((count ?? 0) / CHUNK));
    for (let i = 1; i <= pages; i++) {
      children.push(`https://usmanjatoi.com/sitemap/${g.key}-${i}.xml`);
    }
  }

  console.log(`Generated ${children.length} sitemap files in index:`);
  console.log(children.slice(0, 10), "...and more");

  // 2. Test fetching shard 1 of pages
  const { data: pageRows } = await supa
    .from("wp_posts")
    .select("path, post_modified, post_type")
    .in("post_type", ["page"])
    .eq("status", "publish")
    .not("path", "is", null)
    .order("id", { ascending: true })
    .range(0, 5);

  console.log("\nSample page sitemap entries:");
  console.log(pageRows);
}

testSitemap().catch(console.error);
