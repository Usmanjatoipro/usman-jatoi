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
  console.log("=== INSPECTING SAMPLE SERVICE PAGES IN SUPABASE ===");
  const { data: pages, error } = await sb
    .from("wp_posts")
    .select("id, path, slug, title, content, meta, raw")
    .eq("post_type", "page")
    .ilike("path", "/services/%")
    .limit(10);

  if (error) {
    console.error("Supabase query error:", error);
    return;
  }

  for (const p of pages || []) {
    const metaKeys = p.meta ? Object.keys(p.meta) : [];
    console.log(`\n-----------------------------------------`);
    console.log(`[Page #${p.id}] Path: ${p.path}`);
    console.log(`  Title: ${p.title}`);
    console.log(`  post_content Length: ${p.content ? p.content.length : 0} chars`);
    console.log(`  meta JSON Keys (${metaKeys.length}):`, metaKeys.slice(0, 10).join(", "));
    if (p.meta) {
      for (const k of ["hero_section", "aboutexpertise_section", "our_services", "process", "faqs", "_cached_industries_block", "_cached_locations_block_v4", "_elementor_data"]) {
        if (p.meta[k]) {
          const valStr = typeof p.meta[k] === "string" ? p.meta[k] : JSON.stringify(p.meta[k]);
          console.log(`    -> meta['${k}']: ${valStr.slice(0, 120)}... (${valStr.length} chars)`);
        }
      }
    }
  }
}

main().catch(console.error);
