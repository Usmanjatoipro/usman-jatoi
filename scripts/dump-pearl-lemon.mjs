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
  const { data: post } = await sb
    .from("wp_posts")
    .select("*")
    .eq("id", 1700)
    .single();

  console.log("=== FULL CONTENT OF PEARL LEMON (ID 1700) ===");
  fs.writeFileSync("scripts/pearl-lemon-content.txt", post.content || "");
  console.log("Saved content to scripts/pearl-lemon-content.txt, length:", (post.content || "").length);
  console.log("=== META OF PEARL LEMON ===");
  console.log(JSON.stringify(post.meta, null, 2));
}

main().catch(console.error);
