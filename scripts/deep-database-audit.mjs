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

async function runDeepAudit() {
  console.log("=================================================================");
  console.log("               SUPABASE DATABASE DEEP AUDIT                      ");
  console.log("=================================================================\n");

  // 1. Post Type & Status Breakdown
  console.log("--- 1. POST TYPES & COUNTS ---");
  const postTypes = ["page", "post", "product", "courses", "revision", "attachment"];
  for (const pt of postTypes) {
    const { count: total } = await sb
      .from("wp_posts")
      .select("id", { count: "exact", head: true })
      .eq("post_type", pt);

    const { count: published } = await sb
      .from("wp_posts")
      .select("id", { count: "exact", head: true })
      .eq("post_type", pt)
      .eq("status", "publish");

    const { count: withPath } = await sb
      .from("wp_posts")
      .select("id", { count: "exact", head: true })
      .eq("post_type", pt)
      .not("path", "is", null);

    console.log(
      `Type: ${pt.padEnd(12)} | Total in DB: ${String(total ?? 0).padStart(7)} | Published: ${String(
        published ?? 0
      ).padStart(7)} | With Valid Path: ${String(withPath ?? 0).padStart(7)}`
    );
  }

  // Total in wp_posts
  const { count: totalPostsTable } = await sb
    .from("wp_posts")
    .select("id", { count: "exact", head: true });
  console.log(`\n>>> TOTAL ALL ROWS IN wp_posts TABLE: ${totalPostsTable}\n`);

  // 2. Taxonomy Breakdown
  console.log("--- 2. TAXONOMIES & TERMS ---");
  const { count: catCount } = await sb
    .from("wp_terms")
    .select("id", { count: "exact", head: true })
    .eq("taxonomy", "category");

  const { count: tagCount } = await sb
    .from("wp_terms")
    .select("id", { count: "exact", head: true })
    .eq("taxonomy", "post_tag");

  const { count: totalTerms } = await sb
    .from("wp_terms")
    .select("id", { count: "exact", head: true });

  console.log(`Categories: ${catCount}`);
  console.log(`Tags:       ${tagCount}`);
  console.log(`Total Terms:${totalTerms}\n`);

  // 3. Post Content & Meta Inspection
  console.log("--- 3. POST CONTENT & CUSTOM FIELDS / META ANALYSIS ---");

  // Sample 200 random pages to inspect meta fields
  const { data: pageSamples } = await sb
    .from("wp_posts")
    .select("id, title, slug, path, content, meta")
    .eq("post_type", "page")
    .limit(200);

  const pageMetaKeys = new Set();
  let pagesWithMeta = 0;
  let pagesWithContent = 0;
  let pagesContentLengths = [];

  (pageSamples || []).forEach((p) => {
    if (p.meta && typeof p.meta === "object" && Object.keys(p.meta).length > 0) {
      pagesWithMeta++;
      Object.keys(p.meta).forEach((k) => pageMetaKeys.add(k));
    }
    if (p.content && p.content.trim().length > 0) {
      pagesWithContent++;
      pagesContentLengths.push(p.content.length);
    }
  });

  console.log(`[Sample of 200 Pages]`);
  console.log(`Pages with non-empty content: ${pagesWithContent}/200`);
  console.log(`Pages with structured meta JSON: ${pagesWithMeta}/200`);
  console.log(`Custom Meta Keys found across pages:`, Array.from(pageMetaKeys));

  // Sample 200 random blog posts to inspect meta fields
  const { data: blogSamples } = await sb
    .from("wp_posts")
    .select("id, title, slug, path, content, meta")
    .eq("post_type", "post")
    .limit(200);

  const postMetaKeys = new Set();
  let postsWithMeta = 0;
  let postsWithContent = 0;
  let postsContentLengths = [];

  (blogSamples || []).forEach((p) => {
    if (p.meta && typeof p.meta === "object" && Object.keys(p.meta).length > 0) {
      postsWithMeta++;
      Object.keys(p.meta).forEach((k) => postMetaKeys.add(k));
    }
    if (p.content && p.content.trim().length > 0) {
      postsWithContent++;
      postsContentLengths.push(p.content.length);
    }
  });

  console.log(`\n[Sample of 200 Blog Posts]`);
  console.log(`Posts with non-empty content: ${postsWithContent}/200`);
  console.log(`Posts with structured meta JSON: ${postsWithMeta}/200`);
  console.log(`Custom Meta Keys found across posts:`, Array.from(postMetaKeys));

  // 4. Sample Inspection of Live Structured Data
  console.log("\n--- 4. DETAILED SAMPLE OF A SERVICE PAGE & A BLOG POST ---");
  if (pageSamples && pageSamples.length > 0) {
    const p = pageSamples.find((x) => x.meta && Object.keys(x.meta).length > 0) || pageSamples[0];
    console.log(`Sample Page [ID: ${p.id}]`);
    console.log(`Title: ${p.title}`);
    console.log(`Path:  ${p.path}`);
    console.log(`Content length: ${(p.content || "").length} chars`);
    console.log(`Meta keys: ${p.meta ? Object.keys(p.meta).join(", ") : "none"}`);
  }

  if (blogSamples && blogSamples.length > 0) {
    const b = blogSamples.find((x) => x.meta && Object.keys(x.meta).length > 0) || blogSamples[0];
    console.log(`\nSample Blog Post [ID: ${b.id}]`);
    console.log(`Title: ${b.title}`);
    console.log(`Path:  ${b.path}`);
    console.log(`Content length: ${(b.content || "").length} chars`);
    console.log(`Meta keys: ${b.meta ? Object.keys(b.meta).join(", ") : "none"}`);
  }

  console.log("\n=================================================================");
  console.log("                  AUDIT COMPLETE                                 ");
  console.log("=================================================================");
}

runDeepAudit().catch(console.error);
