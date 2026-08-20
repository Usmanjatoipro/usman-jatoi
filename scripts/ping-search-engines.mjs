import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env
const envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
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

const sb = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const HOST = "usmanjatoi.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "usmanjatoi-indexnow-key-2026";

async function pingIndexNow(urls) {
  console.log(`\n=== PINGING INDEXNOW FOR ${urls.length} URLS ===`);
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow accepted batch of ${urls.length} URLs (Status: ${res.status})`);
    } else {
      console.warn(`⚠️ IndexNow response status: ${res.status}`);
    }
  } catch (e) {
    console.error("IndexNow ping error:", e.message);
  }
}

async function main() {
  const { data: recentPages } = await sb
    .from("wp_posts")
    .select("path")
    .eq("post_type", "page")
    .eq("status", "publish")
    .not("content", "is", null)
    .neq("content", "")
    .order("post_modified", { ascending: false })
    .limit(100);

  const urls = (recentPages || [])
    .map((p) => `https://${HOST}${p.path.startsWith("/") ? p.path : "/" + p.path}`)
    .filter(Boolean);

  if (urls.length > 0) {
    await pingIndexNow(urls);
  } else {
    console.log("No enriched pages found to ping.");
  }
}

main().catch(console.error);
