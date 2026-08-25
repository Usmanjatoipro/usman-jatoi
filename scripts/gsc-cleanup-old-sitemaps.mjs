import fs from "fs";
import crypto from "crypto";

const serviceAccount = JSON.parse(fs.readFileSync("gsc-service-account.json", "utf8"));

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken() {
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

async function main() {
  console.log("=== CLEANING UP OLD / DUPLICATE SITEMAPS IN GSC ===");
  const token = await getAccessToken();
  const siteUrl = "https://usmanjatoi.com/";

  // Fetch current sitemaps
  const sitemapsRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const sitemapsData = await sitemapsRes.json();

  if (!sitemapsData.sitemap) {
    console.log("No sitemaps found.");
    return;
  }

  // We only want to keep the single master sitemap index: https://usmanjatoi.com/sitemap.xml
  // Google will automatically discover and crawl all shards (services-*, pages-*, posts-*, categories-*, static) from the master index without duplicate registration conflicts!
  for (const s of sitemapsData.sitemap) {
    if (s.path !== "https://usmanjatoi.com/sitemap.xml") {
      console.log(`Deleting legacy/sub sitemap from GSC: ${s.path}...`);
      const delRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
          siteUrl
        )}/sitemaps/${encodeURIComponent(s.path)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`- Result status: ${delRes.status} (${delRes.ok ? "DELETED" : "FAILED"})`);
    }
  }

  // Resubmit clean master sitemap
  console.log("\nSubmitting clean master sitemap https://usmanjatoi.com/sitemap.xml...");
  const subRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/sitemaps/${encodeURIComponent("https://usmanjatoi.com/sitemap.xml")}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(`Master sitemap submission status: ${subRes.status}`);

  console.log("\n✓ Clean sitemap architecture established in Google Search Console!");
}

main().catch(console.error);
