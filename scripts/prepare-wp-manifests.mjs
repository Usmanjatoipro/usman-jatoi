import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const base = resolve(root, "public", "wp-data");
const required = [
  "wp-data-index.json.gz",
  "terms/all.json.gz",
];

async function assertFile(relativePath) {
  const file = resolve(base, relativePath);
  const info = await stat(file);
  if (!info.isFile() || info.size === 0) {
    throw new Error(`WP manifest shard is empty: ${relativePath}`);
  }
}

async function assertDirectory(relativePath) {
  const dir = resolve(base, relativePath);
  const files = await readdir(dir);
  const shards = files.filter((file) => file.endsWith(".json.gz"));
  if (!shards.length) {
    throw new Error(`WP manifest shard directory is empty: ${relativePath}`);
  }
  return shards.length;
}

try {
  for (const file of required) await assertFile(file);
  const postCount = await assertDirectory("posts");
  const pageCount = await assertDirectory("pages");
  const serviceCount = await assertDirectory("services");
  console.log(`wp split manifests ready: ${postCount} post shards, ${pageCount} page shards, ${serviceCount} service shards`);
} catch (error) {
  console.error((error instanceof Error ? error.message : String(error)));
  console.error("Run: node scripts/split-wp-manifests.mjs");
  process.exit(1);
}
