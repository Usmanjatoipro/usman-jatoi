import { gunzip } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const rawDir = resolve(root, "src", "data");
const splitDir = resolve(root, "public", "wp-data");

function gunzipAsync(input) {
  return new Promise((resolvePromise, reject) => {
    gunzip(input, (error, output) => {
      if (error) reject(error);
      else resolvePromise(output);
    });
  });
}

async function readRaw(name) {
  return JSON.parse(await readFile(resolve(rawDir, name), "utf8"));
}

async function readSplit(relativePath) {
  return JSON.parse((await gunzipAsync(await readFile(resolve(splitDir, relativePath)))).toString("utf8"));
}

async function countShardDirectory(name) {
  const files = (await readdir(resolve(splitDir, name))).filter((file) => file.endsWith(".json.gz"));
  let total = 0;
  for (const file of files) {
    total += (await readSplit(`${name}/${file}`)).length;
  }
  return { files: files.length, total };
}

const [rawPosts, rawPages, rawTerms, index] = await Promise.all([
  readRaw("wp-posts-manifest.json"),
  readRaw("wp-pages-manifest.json"),
  readRaw("wp-terms-manifest.json"),
  readSplit("wp-data-index.json.gz"),
]);

const [postShards, pageShards, serviceShards] = await Promise.all([
  countShardDirectory("posts"),
  countShardDirectory("pages"),
  countShardDirectory("services"),
]);
const termShard = await readSplit("terms/all.json.gz");

const rawServicePages = rawPages.filter((page) => String(page.path || "").replace(/\/+$/, "").startsWith("/services/")).length;
const checks = [
  ["raw posts", rawPosts.length, index.counts.posts],
  ["raw pages", rawPages.length, index.counts.pages],
  ["raw terms", rawTerms.length, index.counts.terms],
  ["post shards", rawPosts.length, postShards.total],
  ["page/service shards", rawPages.length, pageShards.total + serviceShards.total],
  ["service pages", rawServicePages, serviceShards.total],
  ["term shard", rawTerms.length, termShard.length],
];

for (const [label, expected, actual] of checks) {
  if (expected !== actual) {
    throw new Error(`${label} mismatch: expected ${expected}, got ${actual}`);
  }
  console.log(`${label}: ${actual.toLocaleString()} OK`);
}

for (const requiredPath of [
  "/services/ai",
  "/marketing/geo/whats-trending/evolution-seo-geo-how-ai-search-engines-changed-optimization-forever",
]) {
  if (!index.paths[requiredPath]) {
    throw new Error(`Missing split path index entry: ${requiredPath}`);
  }
  console.log(`path indexed: ${requiredPath}`);
}

for (const requiredCategory of ["wealth-structures", "marketing", "ai"]) {
  if (!index.categories[requiredCategory]) {
    throw new Error(`Missing split category index entry: ${requiredCategory}`);
  }
  console.log(`category indexed: ${requiredCategory} (${index.categories[requiredCategory].count.toLocaleString()} posts)`);
}

const outputInfo = await stat(resolve(splitDir, "wp-data-index.json.gz"));
console.log(`split index size: ${outputInfo.size.toLocaleString()} bytes`);
