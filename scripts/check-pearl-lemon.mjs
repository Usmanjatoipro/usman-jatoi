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
  console.log("=== CHECKING PEARL LEMON PAGE IN SUPABASE ===");

  const { data: rows, error } = await sb
    .from("wp_posts")
    .select("*")
    .or("slug.ilike.%pearl-lemon%,path.ilike.%pearl-lemon%,title.ilike.%pearl lemon%")
    .limit(10);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Found ${rows.length} rows:`);
  for (const r of rows) {
    console.log({
      id: r.id,
      slug: r.slug,
      path: r.path,
      title: r.title,
      post_type: r.post_type,
      status: r.status,
      content_length: (r.content || "").length,
      meta_keys: r.meta ? Object.keys(r.meta) : null,
      raw_keys: r.raw ? Object.keys(r.raw) : null,
    });
    console.log("Content snippet (first 1000 chars):");
    console.log((r.content || "").slice(0, 1000));
    console.log("\nMeta snippet:", JSON.stringify(r.meta, null, 2).slice(0, 1000));
  }
}

main().catch(console.error);
