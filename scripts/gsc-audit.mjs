import fs from "fs";
import crypto from "crypto";

// Load service account
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
    scope:
      "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/indexing",
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
  if (!res.ok) {
    throw new Error(`Failed to obtain Google OAuth access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function runGscAudit() {
  console.log("=================================================================");
  console.log("           GOOGLE SEARCH CONSOLE (GSC) LIVE AUDIT                ");
  console.log("=================================================================\n");
  console.log(`Authenticated as Service Account: ${serviceAccount.client_email}\n`);

  const token = await getAccessToken();
  console.log("✓ Successfully obtained Google OAuth Access Token.\n");

  // 1. List Sites
  console.log("--- 1. ACCESSIBLE PROPERTIES / SITES IN GSC ---");
  const sitesRes = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const sitesData = await sitesRes.json();

  if (!sitesData.siteEntry || sitesData.siteEntry.length === 0) {
    console.log("⚠️ No site entries found yet in this GSC account.");
    console.log("Please ensure you have added this email to GSC Settings > Users and permissions:\n");
    console.log(`👉 ${serviceAccount.client_email}\n`);
    return;
  }

  console.log("Found Properties in GSC:");
  sitesData.siteEntry.forEach((s) => {
    console.log(`- ${s.siteUrl} (Permission: ${s.permissionLevel})`);
  });

  // Pick target site
  const site =
    sitesData.siteEntry.find((s) => s.siteUrl.includes("usmanjatoi.com")) ||
    sitesData.siteEntry[0];
  const siteUrl = site.siteUrl;
  const encodedSiteUrl = encodeURIComponent(siteUrl);

  console.log(`\n🎯 Auditing Active Property: ${siteUrl}\n`);

  // 2. Check Sitemaps
  console.log("--- 2. SITEMAPS STATUS ---");
  const sitemapsRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const sitemapsData = await sitemapsRes.json();
  console.log("Submitted Sitemaps:", sitemapsData.sitemap || "None submitted yet.");

  // 3. Search Performance Analytics (Last 30 Days)
  console.log("\n--- 3. SEARCH PERFORMANCE (LAST 30 DAYS) ---");
  const endDate = new Date().toISOString().split("T")[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 30);
  const startDate = startDateObj.toISOString().split("T")[0];

  const queryPayload = {
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 15,
  };

  const perfRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryPayload),
    }
  );
  const perfData = await perfRes.json();

  if (perfData.rows && perfData.rows.length > 0) {
    console.log("Top Search Queries:");
    perfData.rows.forEach((r) => {
      console.log(
        `• "${r.keys[0]}" | Clicks: ${r.clicks} | Impressions: ${r.impressions} | CTR: ${(
          r.ctr * 100
        ).toFixed(1)}% | Avg Pos: ${r.position.toFixed(1)}`
      );
    });
  } else {
    console.log("Search analytics data:", perfData);
  }

  // 4. Top Pages Performance
  console.log("\n--- 4. TOP RANKING PAGES ---");
  const pagesPayload = {
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 10,
  };

  const pagesRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pagesPayload),
    }
  );
  const pagesData = await pagesRes.json();
  if (pagesData.rows && pagesData.rows.length > 0) {
    pagesData.rows.forEach((r) => {
      console.log(
        `• ${r.keys[0]} | Clicks: ${r.clicks} | Impressions: ${r.impressions} | Avg Pos: ${r.position.toFixed(
          1
        )}`
      );
    });
  } else {
    console.log("Top pages data:", pagesData);
  }

  // 5. URL Inspection Test
  console.log("\n--- 5. LIVE URL INDEXING INSPECTION ---");
  const testUrls = [
    "https://usmanjatoi.com/",
    "https://usmanjatoi.com/about-me/",
    "https://usmanjatoi.com/services/creative/branding/",
  ];

  for (const url of testUrls) {
    try {
      const inspectRes = await fetch(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inspectionUrl: url,
            siteUrl: siteUrl,
          }),
        }
      );
      const inspectData = await inspectRes.json();
      console.log(`\nURL: ${url}`);
      if (inspectData.inspectionResult) {
        const res = inspectData.inspectionResult.indexStatusResult;
        console.log(`- Verdict:        ${res?.verdict || "UNKNOWN"}`);
        console.log(`- Coverage State: ${res?.coverageState || "N/A"}`);
        console.log(`- Robots Txt:     ${res?.robotsTxtState || "N/A"}`);
        console.log(`- Indexing State: ${res?.indexingState || "N/A"}`);
        console.log(`- Last Crawl:     ${res?.lastCrawlTime || "Never"}`);
      } else {
        console.log("Inspection response:", inspectData);
      }
    } catch (err) {
      console.log(`Error inspecting ${url}:`, err.message);
    }
  }

  console.log("\n=================================================================");
  console.log("                     AUDIT COMPLETE                              ");
  console.log("=================================================================");
}

runGscAudit().catch(console.error);
