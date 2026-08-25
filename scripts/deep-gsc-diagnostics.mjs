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
    scope: "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly",
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

async function inspectUrl(token, siteUrl, inspectionUrl) {
  try {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl, siteUrl }),
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  console.log("=================================================================");
  console.log("      DEEP GOOGLE SEARCH CONSOLE CRAWL & SITEMAP DIAGNOSTICS     ");
  console.log("=================================================================\n");

  const token = await getAccessToken();
  const siteUrl = "https://usmanjatoi.com/";

  // 1. Check live response from live https://usmanjatoi.com/sitemap.xml
  console.log("--- 1. TESTING LIVE HTTP RESPONSES FROM USMANJATOI.COM ---");
  const testEndpoints = [
    "https://usmanjatoi.com/",
    "https://usmanjatoi.com/robots.txt",
    "https://usmanjatoi.com/sitemap.xml",
    "https://usmanjatoi.com/sitemap_index.xml",
    "https://usmanjatoi.com/page-sitemap1.xml",
    "https://usmanjatoi.com/sitemap/static.xml",
    "https://usmanjatoi.com/sitemap/services-1.xml",
  ];

  for (const ep of testEndpoints) {
    try {
      const res = await fetch(ep, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
        redirect: "manual",
      });
      const text = await res.text();
      console.log(`HTTP ${res.status} | ${ep} (Content-Type: ${res.headers.get("content-type")}, Length: ${text.length})`);
      if (res.status >= 300 && res.status < 400) {
        console.log(`  ↳ Redirects to: ${res.headers.get("location")}`);
      }
      if (res.status >= 400 || res.status === 500) {
        console.log(`  ↳ Body snippet: ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.log(`FAILED ${ep}: ${e.message}`);
    }
  }

  // 2. Fetch all Sitemaps registered in GSC with details
  console.log("\n--- 2. ALL REGISTERED SITEMAPS IN GSC (WITH CRAWL ERRORS) ---");
  const sitemapsRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const sitemapsData = await sitemapsRes.json();
  if (sitemapsData.sitemap) {
    sitemapsData.sitemap.forEach((s) => {
      console.log(`\nSitemap: ${s.path}`);
      console.log(`  - Last Submitted:  ${s.lastSubmitted || "N/A"}`);
      console.log(`  - Last Downloaded:  ${s.lastDownloaded || "Never"}`);
      console.log(`  - Warnings:         ${s.warnings || "0"}`);
      console.log(`  - Errors:           ${s.errors || "0"}`);
      console.log(`  - Is Pending:       ${s.isPending}`);
      if (s.contents) {
        console.log(`  - Contents:`, s.contents);
      }
    });
  }

  // 3. Detailed URL Inspection with Rich Results / Breadcrumbs / Mobile
  console.log("\n--- 3. DETAILED URL INSPECTION (INDEXING, CANONICALS, BREADCRUMBS) ---");
  const inspectList = [
    "https://usmanjatoi.com/",
    "https://usmanjatoi.com/about-me/",
    "https://usmanjatoi.com/about-me/my-journey/professional-experience/pearl-lemon/",
    "https://usmanjatoi.com/services/creative/branding/",
    "https://usmanjatoi.com/services/web/cms/wordpress/",
    "https://usmanjatoi.com/category/marketing/",
  ];

  for (const url of inspectList) {
    const res = await inspectUrl(token, siteUrl, url);
    console.log(`\nURL: ${url}`);
    if (res.inspectionResult) {
      const idx = res.inspectionResult.indexStatusResult;
      console.log(`  - Verdict:         ${idx?.verdict}`);
      console.log(`  - Coverage:        ${idx?.coverageState}`);
      console.log(`  - User Canonical:  ${idx?.userCanonical || "None"}`);
      console.log(`  - Google Canonical:${idx?.googleCanonical || "None"}`);
      console.log(`  - Crawled as:      ${idx?.crawledAs || "N/A"}`);
      console.log(`  - Last Crawl:      ${idx?.lastCrawlTime || "Never"}`);

      // Rich results & mobile
      const mobile = res.inspectionResult.mobileUsabilityResult;
      if (mobile) {
        console.log(`  - Mobile Verdict:  ${mobile.verdict} (${mobile.issues?.length || 0} issues)`);
      }
      const rich = res.inspectionResult.richResultsResult;
      if (rich) {
        console.log(`  - Rich Results:    ${rich.verdict}`);
        rich.detectedItems?.forEach((item) => {
          console.log(`    ↳ Item: ${item.name} (Issues: ${item.items?.flatMap((i) => i.issues || []).length || 0})`);
        });
      }
    } else {
      console.log("  - Response:", res);
    }
  }

  console.log("\n=================================================================");
  console.log("                      DIAGNOSTICS COMPLETE                       ");
  console.log("=================================================================");
}

main().catch(console.error);
