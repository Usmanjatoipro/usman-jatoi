import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import manifest from "@/data/wp-media-manifest.json";

const BATCH_SIZE = 8;
const KIND = "media";

type ManifestItem = {
  id: number;
  source_url: string;
  title: string | null;
  slug: string | null;
  alt_text: string | null;
  caption: string | null;
  description: string | null;
  media_date: string | null;
  mime_type: string;
};

const ITEMS = manifest as unknown as ManifestItem[];

async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

function extFromUrl(url: string): string {
  const p = url.split("?")[0];
  const dot = p.lastIndexOf(".");
  if (dot < 0) return "";
  return p.slice(dot + 1).toLowerCase();
}

function safeName(url: string, id: number): string {
  try {
    const u = new URL(url);
    const base = u.pathname.split("/").pop() || `${id}`;
    return base.replace(/[^a-zA-Z0-9._-]/g, "_");
  } catch {
    return `${id}.${extFromUrl(url) || "bin"}`;
  }
}

export const getMediaSyncStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count: imported } = await supabaseAdmin
      .from("wp_media")
      .select("*", { count: "exact", head: true })
      .not("storage_path", "is", null);
    const { data: state } = await supabaseAdmin
      .from("wp_import_state")
      .select("*")
      .eq("content_kind", KIND)
      .maybeSingle();
    return {
      total: ITEMS.length,
      imported: imported ?? 0,
      cursor: state?.last_page ?? 0,
      status: state?.status ?? "idle",
      last_error: state?.last_error ?? null,
    };
  });

export const syncMediaChunk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { batchSize?: number }) =>
    z.object({ batchSize: z.number().int().min(1).max(25).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const size = data.batchSize ?? BATCH_SIZE;

    // Upsert import_state row
    await supabaseAdmin.from("wp_import_state").upsert(
      { content_kind: KIND, total_items: ITEMS.length, status: "running", last_error: null },
      { onConflict: "content_kind" },
    );

    const { data: state } = await supabaseAdmin
      .from("wp_import_state")
      .select("last_page")
      .eq("content_kind", KIND)
      .maybeSingle();

    const cursor = state?.last_page ?? 0;
    const slice = ITEMS.slice(cursor, cursor + size);

    if (slice.length === 0) {
      await supabaseAdmin
        .from("wp_import_state")
        .update({ status: "done" })
        .eq("content_kind", KIND);
      return { done: true, cursor, processed: 0, total: ITEMS.length };
    }

    const results: { id: number; ok: boolean; error?: string; skipped?: boolean }[] = [];

    for (const m of slice) {
      try {
        // Skip if already re-hosted
        const { data: existing } = await supabaseAdmin
          .from("wp_media")
          .select("id, storage_path")
          .eq("id", m.id)
          .maybeSingle();

        if (existing?.storage_path) {
          results.push({ id: m.id, ok: true, skipped: true });
          continue;
        }

        // Metadata row (upsert)
        const metaRow = {
          id: m.id,
          slug: m.slug,
          title: m.title,
          alt_text: m.alt_text,
          caption: m.caption,
          description: m.description,
          mime_type: m.mime_type,
          source_url: m.source_url,
          media_date: m.media_date,
        };
        await supabaseAdmin.from("wp_media").upsert(metaRow, { onConflict: "id" });

        // Download
        const dl = await fetch(m.source_url, {
          redirect: "follow",
          headers: { "User-Agent": "usmanjatoi-mirror/1.0" },
        });
        if (!dl.ok) throw new Error(`download ${dl.status}`);
        const buf = new Uint8Array(await dl.arrayBuffer());
        const filesize = buf.byteLength;

        const name = safeName(m.source_url, m.id);
        const storagePath = `wp/${m.id}/${name}`;

        const { error: upErr } = await supabaseAdmin.storage
          .from("wp-media")
          .upload(storagePath, buf, {
            contentType: m.mime_type,
            upsert: true,
          });
        if (upErr) throw new Error(`upload: ${upErr.message}`);

        const { data: pub } = supabaseAdmin.storage
          .from("wp-media")
          .getPublicUrl(storagePath);

        await supabaseAdmin
          .from("wp_media")
          .update({
            storage_path: storagePath,
            storage_url: pub.publicUrl,
            filesize,
            imported_at: new Date().toISOString(),
          })
          .eq("id", m.id);

        results.push({ id: m.id, ok: true });
      } catch (e: any) {
        results.push({ id: m.id, ok: false, error: e?.message ?? String(e) });
      }
    }

    const newCursor = cursor + slice.length;
    const done = newCursor >= ITEMS.length;
    const failed = results.filter((r) => !r.ok);

    await supabaseAdmin
      .from("wp_import_state")
      .update({
        last_page: newCursor,
        imported_items: newCursor,
        total_items: ITEMS.length,
        status: done ? "done" : "running",
        last_error: failed.length ? failed.slice(0, 3).map((f) => `#${f.id}: ${f.error}`).join(" | ") : null,
      })
      .eq("content_kind", KIND);

    return {
      done,
      cursor: newCursor,
      processed: slice.length,
      total: ITEMS.length,
      failures: failed,
    };
  });

export const resetMediaSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("wp_import_state")
      .upsert(
        {
          content_kind: KIND,
          last_page: 0,
          imported_items: 0,
          total_items: ITEMS.length,
          status: "idle",
          last_error: null,
        },
        { onConflict: "content_kind" },
      );
    return { ok: true };
  });
