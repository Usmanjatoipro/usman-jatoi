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
  const { count: posts, error: e1 } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "post");
  const { count: pages, error: e2 } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "page");
  const { count: media, error: e3 } = await sb.from("wp_media").select("id", { count: "exact", head: true });
  const { count: terms, error: e4 } = await sb.from("wp_terms").select("id", { count: "exact", head: true });

  if (e1 || e2 || e3 || e4) {
    console.error("Errors:", { e1, e2, e3, e4 });
  }

  console.log("=== LIVE SUPABASE STATUS ===");
  console.log({ posts, pages, media, terms });
}

main().catch(console.error);
