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
    scope: "https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters",
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

export async function requestGoogleIndexing(url) {
  const token = await getAccessToken();
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      type: "URL_UPDATED",
    }),
  });

  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function testSingle() {
  const targetUrl = process.argv[2] || "https://usmanjatoi.com/about-me/my-journey/professional-experience/pearl-lemon/";
  console.log(`Pinging Google Indexing API for: ${targetUrl}...`);
  const result = await requestGoogleIndexing(targetUrl);
  console.log("Result:", result);
}

if (process.argv[1].endsWith("gsc-index-request.mjs")) {
  testSingle().catch(console.error);
}
