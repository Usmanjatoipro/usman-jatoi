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
  console.log("=== SEARCHING FOR SPECIFIC POSTS IN SUPABASE ===");

  const { data: posts1 } = await sb
    .from("wp_posts")
    .select("id, title, slug, path, content, post_type, post_date")
    .ilike("title", "%Building Something Interesting in Public%")
    .limit(5);

  const { data: posts2 } = await sb
    .from("wp_posts")
    .select("id, title, slug, path, content, post_type, post_date")
    .ilike("title", "%Hailuo AI%")
    .limit(5);

  console.log("Posts matching 'Building Something Interesting in Public':", posts1);
  console.log("Posts matching 'Hailuo AI':", posts2);
}

main().catch(console.error);
