import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Sweep a batch of published posts/pages and:
 *  - download any inline /wp-content/uploads/... image the wp-media bucket
 *    doesn't have yet
 *  - rewrite all usmanjatoi.com + /wp-content/uploads/... URLs in content HTML
 *    to the Lovable Cloud storage public URL
 *  - persist the cleaned HTML
 * Returns per-batch progress so the admin UI can loop.
 */
export const rewriteInlineMediaBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(50).default(20) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find candidates
    const { data: rows, count } = await supabaseAdmin
      .from("wp_posts")
      .select("id, content", { count: "exact" })
      .eq("status", "publish")
      .or("content.ilike.%usmanjatoi.com%,content.ilike.%wp-content/uploads%")
      .order("id", { ascending: true })
      .range(data.offset, data.offset + data.limit - 1);

    const total = count ?? 0;
    if (!rows || rows.length === 0) {
      return { processed: 0, updated: 0, uploaded: 0, total, done: true };
    }

    // Preload media map by source_url filename → storage_url
    const { data: mediaRows } = await supabaseAdmin
      .from("wp_media")
      .select("source_url, storage_url");
    const bySource = new Map<string, string>();
    const byFilename = new Map<string, string>();
    (mediaRows || []).forEach((m: any) => {
      if (m.storage_url) {
        bySource.set(m.source_url, m.storage_url);
        const fn = m.source_url.split("/").pop();
        if (fn) byFilename.set(fn, m.storage_url);
      }
    });

    const BUCKET = "wp-media";
    const publicUrl = (path: string) => {
      const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    };

    let updated = 0;
    let uploaded = 0;

    for (const row of rows as { id: number; content: string | null }[]) {
      if (!row.content) continue;
      let html = row.content;

      // Collect unique image URLs pointing at wp-content/uploads
      const urlRe = /(https?:\/\/(?:www\.)?usmanjatoi\.com)?\/wp-content\/uploads\/([^\s"'<>()]+)/gi;
      const found = new Set<string>();
      let m: RegExpExecArray | null;
      while ((m = urlRe.exec(html)) !== null) {
        found.add(m[0]);
      }

      for (const orig of found) {
        // Normalize to absolute
        const absolute = orig.startsWith("http")
          ? orig
          : `https://usmanjatoi.com${orig.startsWith("/") ? "" : "/"}${orig}`;
        const filename = absolute.split("/").pop() || "";
        let target = bySource.get(absolute) || byFilename.get(filename);

        if (!target) {
          // Download and upload to bucket under 'inline/<filename>'
          try {
            const resp = await fetch(absolute);
            if (resp.ok) {
              const buf = new Uint8Array(await resp.arrayBuffer());
              const key = `inline/${filename}`;
              await supabaseAdmin.storage.from(BUCKET).upload(key, buf, {
                contentType: resp.headers.get("content-type") || "image/jpeg",
                upsert: true,
              });
              target = publicUrl(key);
              byFilename.set(filename, target);
              bySource.set(absolute, target);
              uploaded++;
            }
          } catch {
            // Skip on failure; leave URL as-is
          }
        }

        if (target) {
          html = html.split(orig).join(target);
        }
      }

      // Strip absolute usmanjatoi.com prefix from anchor hrefs
      html = html.replace(/https?:\/\/(?:www\.)?usmanjatoi\.com(?=\/|"|')/gi, "");

      if (html !== row.content) {
        await supabaseAdmin.from("wp_posts").update({ content: html }).eq("id", row.id);
        updated++;
      }
    }

    const nextOffset = data.offset + rows.length;
    return {
      processed: rows.length,
      updated,
      uploaded,
      total,
      done: nextOffset >= total,
      nextOffset,
    };
  });

/**
 * For published posts missing featured_media_id, extract the first <img> in
 * content, match it to wp_media (by source_url or filename) and set the id.
 */
export const backfillFeaturedImagesBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(100).default(50) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, count } = await supabaseAdmin
      .from("wp_posts")
      .select("id, content", { count: "exact" })
      .eq("status", "publish")
      .eq("post_type", "post")
      .is("featured_media_id", null)
      .order("id", { ascending: true })
      .range(data.offset, data.offset + data.limit - 1);

    const total = count ?? 0;
    if (!rows || rows.length === 0) return { processed: 0, updated: 0, total, done: true };

    const { data: mediaRows } = await supabaseAdmin.from("wp_media").select("id, source_url");
    const byFilename = new Map<string, number>();
    const bySource = new Map<string, number>();
    (mediaRows || []).forEach((m: any) => {
      bySource.set(m.source_url, m.id);
      const fn = m.source_url.split("/").pop();
      if (fn) byFilename.set(fn, m.id);
    });

    let updated = 0;
    for (const row of rows as { id: number; content: string | null }[]) {
      if (!row.content) continue;
      const match = row.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (!match) continue;
      const src = match[1];
      const filename = src.split("/").pop() || "";
      const mid = bySource.get(src) || byFilename.get(filename);
      if (mid) {
        await supabaseAdmin.from("wp_posts").update({ featured_media_id: mid }).eq("id", row.id);
        updated++;
      }
    }

    const nextOffset = data.offset + rows.length;
    return { processed: rows.length, updated, total, done: nextOffset >= total, nextOffset };
  });

/** Summary counts for the admin dashboard. */
export const getCleanupStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [dirty, orphans, media, posts, pages] = await Promise.all([
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "publish")
        .or("content.ilike.%usmanjatoi.com%,content.ilike.%wp-content/uploads%"),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "publish")
        .eq("post_type", "post")
        .is("featured_media_id", null),
      supabaseAdmin.from("wp_media").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "publish")
        .eq("post_type", "post"),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "publish")
        .eq("post_type", "page"),
    ]);

    return {
      dirtyContent: dirty.count ?? 0,
      orphanFeatured: orphans.count ?? 0,
      mediaTotal: media.count ?? 0,
      posts: posts.count ?? 0,
      pages: pages.count ?? 0,
    };
  });

/* ================================================================
 * Backfill thin posts: for posts where we imported only a stub
 * (empty/short content, no SEO fields), re-fetch the full record
 * from the connected WordPress site and refill:
 *   content, excerpt, seo_title, seo_description, featured_media_id
 * Loops in batches from the admin UI.
 * ================================================================ */

const WP_GATEWAY = "https://connector-gateway.lovable.dev/wordpress";

function stripHtmlSimple(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function wpGetPost(id: number) {
  const key = process.env.LOVABLE_API_KEY;
  const conn = process.env.WORDPRESS_API_KEY;
  if (!key || !conn) throw new Error("WordPress gateway credentials missing");
  const url = new URL(`${WP_GATEWAY}/posts/${id}`);
  url.searchParams.set(
    "_fields",
    "id,slug,title,excerpt,content,link,date,modified,featured_media,categories,tags,yoast_head_json",
  );
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${key}`,
      "X-Connection-Api-Key": conn,
    },
  });
  return res;
}

export const getBackfillStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [noSeo, noExcerpt, noHero, total] = await Promise.all([
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("post_type", "post")
        .eq("status", "publish")
        .is("seo_title", null),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("post_type", "post")
        .eq("status", "publish")
        .is("excerpt", null),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("post_type", "post")
        .eq("status", "publish")
        .is("featured_media_id", null),
      supabaseAdmin
        .from("wp_posts")
        .select("id", { count: "exact", head: true })
        .eq("post_type", "post")
        .eq("status", "publish"),
    ]);

    // Fallback: count thin content directly (no RPC).
    let thinCount = 0;
    const { data: thinRows } = await supabaseAdmin
      .from("wp_posts")
      .select("id, content")
      .eq("post_type", "post")
      .eq("status", "publish")
      .limit(15000);
    if (thinRows) {
      thinCount = thinRows.filter((r: any) => !r.content || r.content.length < 100).length;
    }

    return {
      thinContent: thinCount,
      noSeo: noSeo.count ?? 0,
      noExcerpt: noExcerpt.count ?? 0,
      noHero: noHero.count ?? 0,
      totalPosts: total.count ?? 0,
    };
  });

export const backfillThinPostsBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        limit: z.number().int().min(1).max(25).default(10),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find candidates: published posts with thin/missing content OR missing SEO fields.
    // We scan by id ascending. Since we mutate as we go, natural cursoring works.
    const { data: rows } = await supabaseAdmin
      .from("wp_posts")
      .select("id, content, seo_title, seo_description, excerpt, featured_media_id")
      .eq("post_type", "post")
      .eq("status", "publish")
      .or(
        "content.is.null,seo_title.is.null,seo_description.is.null,excerpt.is.null,featured_media_id.is.null",
      )
      .order("id", { ascending: true })
      .limit(data.limit * 3); // over-fetch a bit — many rows may already be fine

    if (!rows || rows.length === 0) {
      return { processed: 0, updated: 0, failed: 0, done: true };
    }

    // Filter to real candidates
    const candidates = rows
      .filter(
        (r: any) =>
          !r.content ||
          r.content.length < 100 ||
          !r.seo_title ||
          !r.seo_description ||
          !r.excerpt ||
          !r.featured_media_id,
      )
      .slice(0, data.limit);

    let updated = 0;
    let failed = 0;

    for (const row of candidates) {
      try {
        const res = await wpGetPost(row.id);
        if (!res.ok) {
          failed++;
          continue;
        }
        const p: any = await res.json();
        const yoast = p.yoast_head_json ?? {};
        const patch: Record<string, any> = {
          content: p.content?.rendered ?? row.content,
          excerpt: stripHtmlSimple(p.excerpt?.rendered) || row.excerpt,
          seo_title: yoast.title ?? row.seo_title ?? p.title?.rendered ?? null,
          seo_description:
            yoast.description ?? yoast.og_description ?? row.seo_description ?? null,
          featured_media_id: p.featured_media || row.featured_media_id || null,
          post_modified: p.modified ?? undefined,
          raw: p,
        };
        const { error } = await supabaseAdmin
          .from("wp_posts")
          .update(patch)
          .eq("id", row.id);
        if (error) {
          failed++;
        } else {
          updated++;
        }
      } catch {
        failed++;
      }
    }

    return {
      processed: candidates.length,
      updated,
      failed,
      done: candidates.length === 0,
    };
  });
