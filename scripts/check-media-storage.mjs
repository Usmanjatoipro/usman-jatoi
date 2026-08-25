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

async function checkMedia() {
  console.log("=== CHECKING MEDIA STORAGE IN SUPABASE ===");

  const { count: totalMedia } = await sb
    .from("wp_media")
    .select("id", { count: "exact", head: true });

  const { data: samples } = await sb
    .from("wp_media")
    .select("id, source_url, storage_url, file_name, mime_type")
    .limit(20);

  const { count: withStorageUrl } = await sb
    .from("wp_media")
    .select("id", { count: "exact", head: true })
    .not("storage_url", "is", null);

  console.log(`Total rows in wp_media: ${totalMedia}`);
  console.log(`Rows with storage_url (Supabase Storage): ${withStorageUrl}`);
  console.log(`Rows with only source_url: ${(totalMedia || 0) - (withStorageUrl || 0)}`);

  console.log("\nSample media rows:");
  console.log(samples?.slice(0, 5));
}

checkMedia().catch(console.error);
