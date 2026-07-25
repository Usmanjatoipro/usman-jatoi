import { createGzip } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pipeline } from "node:stream/promises";

const root = process.cwd();
const files = [
  "wp-posts-manifest.json",
  "wp-pages-manifest.json",
  "wp-terms-manifest.json",
];

for (const file of files) {
  const source = resolve(root, "src", "data", file);
  const target = resolve(root, "public", "wp-data", `${file}.gz`);
  await mkdir(dirname(target), { recursive: true });

  let shouldWrite = true;
  try {
    const [sourceStat, targetStat] = await Promise.all([stat(source), stat(target)]);
    shouldWrite = sourceStat.mtimeMs > targetStat.mtimeMs || targetStat.size === 0;
  } catch {
    shouldWrite = true;
  }

  if (!shouldWrite) {
    console.log(`wp manifest ready: ${file}.gz`);
    continue;
  }

  await pipeline(
    createReadStream(source),
    createGzip({ level: 9 }),
    createWriteStream(target),
  );
  console.log(`compressed wp manifest: ${file}.gz`);
}
