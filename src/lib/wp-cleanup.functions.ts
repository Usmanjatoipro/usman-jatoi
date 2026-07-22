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
