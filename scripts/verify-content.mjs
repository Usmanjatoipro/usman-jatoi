import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env", "utf8");
envContent.split(/\r?\n/).forEach(line => {
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

async function main() {
  console.log("=== CHECKING SAMPLE POSTS ===");
  const { data: posts } = await sb
    .from("wp_posts")
    .select("id, slug, title, excerpt, seo_title, seo_description, featured_media_id, content")
    .eq("post_type", "post")
    .eq("status", "publish")
    .limit(5);
  
  for (const p of posts || []) {
    let imgUrl = null;
    if (p.featured_media_id) {
      const { data: m } = await sb.from("wp_media").select("storage_url, source_url").eq("id", p.featured_media_id).maybeSingle();
      imgUrl = m?.storage_url || m?.source_url || "MEDIA_NOT_FOUND";
    }
    console.log(`[Post #${p.id}] Slug: ${p.slug}`);
    console.log(`  Title: ${p.title?.slice(0, 50)}`);
    console.log(`  SEO Title: ${p.seo_title}`);
    console.log(`  Featured Image: ${imgUrl}`);
    console.log(`  Content Length: ${p.content?.length || 0} chars | Excerpt Length: ${p.excerpt?.length || 0} chars`);
    console.log("-----------------------------------------");
  }

  console.log("\n=== CHECKING SERVICE & MAIN PAGES ===");
  const { data: pages } = await sb
    .from("wp_posts")
    .select("id, slug, title, path, content, seo_title, seo_description")
    .eq("post_type", "page")
    .eq("status", "publish")
    .ilike("slug", "%service%")
    .limit(5);

  for (const pg of pages || []) {
    console.log(`[Page #${pg.id}] Path: ${pg.path} (Slug: ${pg.slug})`);
    console.log(`  Title: ${pg.title?.slice(0, 50)}`);
    console.log(`  SEO Title: ${pg.seo_title}`);
    console.log(`  Content Length: ${pg.content?.length || 0} chars`);
    console.log("-----------------------------------------");
  }

  console.log("\n=== CHECKING OVERALL FIELD COMPLETENESS ===");
  const { count: totalPosts } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "post").eq("status", "publish");
  const { count: postsWithContent } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "post").eq("status", "publish").not("content", "is", null).neq("content", "");
  const { count: postsWithSeo } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "post").eq("status", "publish").not("seo_title", "is", null).neq("seo_title", "");
  const { count: postsWithMedia } = await sb.from("wp_posts").select("id", { count: "exact", head: true }).eq("post_type", "post").eq("status", "publish").not("featured_media_id", "is", null);

  console.log(`Total Published Posts: ${totalPosts}`);
  console.log(`  With Content: ${postsWithContent} (${Math.round((postsWithContent/totalPosts)*100)}%)`);
  console.log(`  With SEO Title: ${postsWithSeo} (${Math.round((postsWithSeo/totalPosts)*100)}%)`);
  console.log(`  With Featured Media ID: ${postsWithMedia} (${Math.round((postsWithMedia/totalPosts)*100)}%)`);
}

main().catch(console.error);
