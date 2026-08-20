import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env", "utf8");
envContent.split(/\r?\n/).forEach(line => {
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
  console.log("=== 1. CHECKING wp_post_terms VS raw.categories ===");
  const { data: postTerms, count: ptCount } = await sb.from("wp_post_terms").select("*", { count: "exact" }).limit(5);
  console.log(`wp_post_terms count: ${ptCount}`, postTerms);

  const { data: rawSample } = await sb.from("wp_posts").select("id, raw").limit(5);
  console.log("wp_posts raw sample:", rawSample);

  console.log("\n=== 2. CHECKING POST CONTENT ARTIFACTS ===");
  const { data: contentSample } = await sb
    .from("wp_posts")
    .select("id, slug, content")
    .eq("post_type", "post")
    .not("content", "is", null)
    .limit(10);
  
  let hasGutenbergComments = 0;
  let hasElementorStyles = 0;
  let hasShortcodes = 0;
  let hasBrokenWpImgUrls = 0;

  for (const p of contentSample || []) {
    if (/<!--\s*\/?wp:/i.test(p.content)) hasGutenbergComments++;
    if (/elementor/i.test(p.content)) hasElementorStyles++;
    if (/\[[a-zA-Z0-9_-]+(\s+[^\]]+)?\]/i.test(p.content)) hasShortcodes++;
    if (/http:\/\/|https:\/\/(www\.)?usmanjatoi\.com\/wp-content/i.test(p.content)) hasBrokenWpImgUrls++;
  }
  console.log({
    sampleSize: contentSample?.length,
    hasGutenbergComments,
    hasElementorStyles,
    hasShortcodes,
    hasBrokenWpImgUrls,
  });

  console.log("\n=== 3. CHECKING SERVICES AND NESTED SERVICES IN DB ===");
  const { data: servicePages, count: spCount } = await sb
    .from("wp_posts")
    .select("id, slug, title, path, content, meta", { count: "exact" })
    .ilike("path", "/services/%")
    .limit(5);
  console.log(`Total services by path /services/%: ${spCount}`);
  for (const s of servicePages || []) {
    console.log(`- Path: ${s.path} | Title: ${s.title} | Content length: ${s.content?.length || 0}`);
    console.log(`  Meta keys: ${Object.keys(s.meta || {}).slice(0, 8).join(", ")}`);
  }
}

main().catch(console.error);
