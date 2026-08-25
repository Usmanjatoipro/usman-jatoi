import fs from "fs";
import crypto from "crypto";
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

const serviceAccount = JSON.parse(fs.readFileSync("gsc-service-account.json", "utf8"));
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

const SITE = "https://usmanjatoi.com";
const HOST = "usmanjatoi.com";
const KEY = "a9485bf730c24e93bb39e235e1be8891";

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getGscToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  const signature = signer
    .sign(serviceAccount.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function submitToGsc(token, sitemapUrl) {
  const siteUrl = "https://usmanjatoi.com/";
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.ok || res.status === 204;
}

async function submitIndexNowBatch(urlList) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log("=================================================================");
  console.log("      SUBMITTING & PRIORITIZING ALL CORE SERVICE PAGES           ");
  console.log("=================================================================\n");

  console.log("1. Authenticating with Google Search Console API...");
  const token = await getGscToken();
  console.log("✓ Authenticated as Google Service Account.\n");

  console.log("2. Submitting Master Sitemap with Services Shards to GSC...");
  const masterSitemap = `${SITE}/sitemap.xml`;
  const okMaster = await submitToGsc(token, masterSitemap);
  console.log(`- ${masterSitemap} -> ${okMaster ? "✓ SUBMITTED" : "FAILED"}`);

  // Submit all 11 services shards directly
  for (let i = 1; i <= 11; i++) {
    const shard = `${SITE}/sitemap/services-${i}.xml`;
    const okShard = await submitToGsc(token, shard);
    console.log(`- ${shard} -> ${okShard ? "✓ SUBMITTED" : "FAILED"}`);
  }

  console.log("\n3. Fetching Core Service URLs from Supabase for Immediate IndexNow Push...");
  const { data: serviceRows, count } = await sb
    .from("wp_posts")
    .select("path", { count: "exact" })
    .eq("post_type", "page")
    .ilike("path", "/services/%")
    .order("id", { ascending: true })
    .limit(10000);

  const fullUrls = (serviceRows || [])
    .map((r) => `${SITE}${r.path.replace(/\/+$/, "")}`)
    .filter(Boolean);

  console.log(`✓ Retrieved ${fullUrls.length} Priority Service URLs (Total in DB: ${count})`);

  // Batch submit in chunks of 500
  console.log("\n4. Pushing Batches to IndexNow (Bing, Yandex, Naver, Seznam)...");
  const BATCH_SIZE = 500;
  let submittedCount = 0;

  for (let i = 0; i < fullUrls.length; i += BATCH_SIZE) {
    const chunk = fullUrls.slice(i, i + BATCH_SIZE);
    const res = await submitIndexNowBatch(chunk);
    submittedCount += chunk.length;
    console.log(`✓ Submitted Batch ${i / BATCH_SIZE + 1} (${chunk.length} URLs, Total: ${submittedCount}) -> Status: ${res.status}`);
  }

  console.log("\n=================================================================");
  console.log(`🎉 SUCCESS: ${submittedCount} Service Pages Submitted & Prioritized!`);
  console.log("=================================================================");
}

main().catch(console.error);
