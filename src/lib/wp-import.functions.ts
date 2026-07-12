import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/wordpress";
const PER_PAGE = 50;

type Kind = "posts" | "pages" | "media" | "product" | "courses" | "categories" | "tags";

const KIND_TO_ENDPOINT: Record<Kind, string> = {
  posts: "/posts",
  pages: "/pages",
  media: "/media",
  product: "/product",
  courses: "/courses",
  categories: "/categories",
  tags: "/tags",
};

function wpFetch(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(GATEWAY + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const key = process.env.LOVABLE_API_KEY;
  const conn = process.env.WORDPRESS_API_KEY;
  if (!key || !conn) throw new Error("WordPress gateway credentials missing");
  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${key}`,
      "X-Connection-Api-Key": conn,
    },
  });
}

function stripHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const getImportState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("wp_import_state")
      .select("*")
      .order("content_kind");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // First user to sign up becomes admin. If any admin exists already, deny.
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("An admin already exists");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const importChunk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { kind: Kind }) =>
    z
      .object({
        kind: z.enum(["posts", "pages", "media", "product", "courses", "categories", "tags"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { kind } = data;

    const { data: stateRow } = await supabaseAdmin
      .from("wp_import_state")
      .select("*")
      .eq("content_kind", kind)
      .maybeSingle();

    const currentPage = (stateRow?.last_page ?? 0) + 1;
    const endpoint = KIND_TO_ENDPOINT[kind];

    await supabaseAdmin
      .from("wp_import_state")
      .update({ status: "running", last_error: null })
      .eq("content_kind", kind);

    let items: any[] = [];
    let totalPages = stateRow?.total_pages ?? null;
    let totalItems = stateRow?.total_items ?? null;

    try {
      const res = await wpFetch(endpoint, {
        page: currentPage,
        per_page: PER_PAGE,
        status: kind === "media" || kind === "categories" || kind === "tags" ? "" : "publish",
        _fields:
          kind === "media"
            ? "id,slug,title,alt_text,caption,description,mime_type,source_url,media_details,date"
            : kind === "categories" || kind === "tags"
              ? "id,name,slug,description,parent,count,taxonomy"
              : "id,slug,title,excerpt,content,link,date,modified,type,parent,menu_order,author,featured_media,categories,tags,yoast_head_json",
        orderby: "id",
        order: "asc",
      });

      if (!res.ok) {
        // WP may 400 on empty page — treat as done.
        if (res.status === 400) {
          await supabaseAdmin
            .from("wp_import_state")
            .update({ status: "done" })
            .eq("content_kind", kind);
          return { done: true, page: currentPage, imported: 0 };
        }
        const text = await res.text();
        throw new Error(`WP ${res.status}: ${text.slice(0, 500)}`);
      }

      const totalHdr = res.headers.get("x-wp-total");
      const totalPagesHdr = res.headers.get("x-wp-totalpages");
      if (totalHdr) totalItems = parseInt(totalHdr, 10);
      if (totalPagesHdr) totalPages = parseInt(totalPagesHdr, 10);

      items = await res.json();
      if (!Array.isArray(items) || items.length === 0) {
        await supabaseAdmin
          .from("wp_import_state")
          .update({ status: "done", total_pages: totalPages, total_items: totalItems })
          .eq("content_kind", kind);
        return { done: true, page: currentPage, imported: 0 };
      }

      // Persist per kind
      if (kind === "media") {
        const rows = items.map((m: any) => ({
          id: m.id,
          slug: m.slug ?? null,
          title: m.title?.rendered ?? null,
          alt_text: m.alt_text ?? null,
          caption: stripHtml(m.caption?.rendered) || null,
          description: stripHtml(m.description?.rendered) || null,
          mime_type: m.mime_type ?? null,
          source_url: m.source_url,
          width: m.media_details?.width ?? null,
          height: m.media_details?.height ?? null,
          filesize: m.media_details?.filesize ?? null,
          media_date: m.date ?? null,
          raw: m,
        }));
        const { error } = await supabaseAdmin.from("wp_media").upsert(rows, { onConflict: "id" });
        if (error) throw new Error(error.message);

        // Now download + upload each file
        for (const m of rows) {
          try {
            const dl = await fetch(m.source_url);
            if (!dl.ok) continue;
            const buf = new Uint8Array(await dl.arrayBuffer());
            const urlPath = new URL(m.source_url).pathname.replace(/^\/+/, "");
            const storagePath = `wp/${m.id}/${urlPath.split("/").pop() ?? m.id}`;
            const { error: upErr } = await supabaseAdmin.storage
              .from("wp-media")
              .upload(storagePath, buf, {
                contentType: m.mime_type ?? "application/octet-stream",
                upsert: true,
              });
            if (upErr && !upErr.message.includes("exists")) continue;
            const { data: pub } = supabaseAdmin.storage.from("wp-media").getPublicUrl(storagePath);
            await supabaseAdmin
              .from("wp_media")
              .update({
                storage_path: storagePath,
                storage_url: pub.publicUrl,
                imported_at: new Date().toISOString(),
              })
              .eq("id", m.id);
          } catch (e) {
            console.error(`media ${m.id}`, e);
          }
        }
      } else if (kind === "categories" || kind === "tags") {
        const rows = items.map((t: any) => ({
          id: t.id,
          taxonomy: t.taxonomy ?? (kind === "categories" ? "category" : "post_tag"),
          slug: t.slug,
          name: t.name,
          description: t.description ?? null,
          parent_id: t.parent || null,
          count: t.count ?? 0,
          raw: t,
        }));
        const { error } = await supabaseAdmin.from("wp_terms").upsert(rows, { onConflict: "id" });
        if (error) throw new Error(error.message);
      } else {
        // posts / pages / product / courses
        const rows = items.map((p: any) => {
          const link: string = p.link ?? "";
          let path: string | null = null;
          try {
            path = new URL(link).pathname;
          } catch {
            /* ignore */
          }
          const yoast = p.yoast_head_json ?? {};
          return {
            id: p.id,
            post_type: p.type ?? kind,
            status: "publish",
            slug: p.slug,
            title: p.title?.rendered ?? null,
            excerpt: stripHtml(p.excerpt?.rendered) || null,
            content: p.content?.rendered ?? null,
            permalink: link || null,
            path,
            parent_id: p.parent || null,
            menu_order: p.menu_order ?? 0,
            author_id: p.author ?? null,
            featured_media_id: p.featured_media || null,
            post_date: p.date ?? null,
            post_modified: p.modified ?? null,
            seo_title: yoast.title ?? null,
            seo_description: yoast.description ?? null,
            raw: p,
          };
        });
        const { error } = await supabaseAdmin.from("wp_posts").upsert(rows, { onConflict: "id" });
        if (error) throw new Error(error.message);

        // Term assignments
        const links: { post_id: number; term_id: number; taxonomy: string }[] = [];
        for (const p of items) {
          if (Array.isArray(p.categories))
            for (const t of p.categories) links.push({ post_id: p.id, term_id: t, taxonomy: "category" });
          if (Array.isArray(p.tags))
            for (const t of p.tags) links.push({ post_id: p.id, term_id: t, taxonomy: "post_tag" });
        }
        if (links.length > 0) {
          await supabaseAdmin.from("wp_post_terms").upsert(links, { onConflict: "post_id,term_id" });
        }
      }

      const imported = (stateRow?.imported_items ?? 0) + items.length;
      const isDone = totalPages != null && currentPage >= totalPages;
      await supabaseAdmin
        .from("wp_import_state")
        .update({
          last_page: currentPage,
          total_pages: totalPages,
          total_items: totalItems,
          imported_items: imported,
          status: isDone ? "done" : "running",
        })
        .eq("content_kind", kind);

      return {
        done: isDone,
        page: currentPage,
        totalPages,
        totalItems,
        imported,
        pageCount: items.length,
      };
    } catch (e: any) {
      await supabaseAdmin
        .from("wp_import_state")
        .update({ status: "error", last_error: e?.message?.slice(0, 500) ?? String(e) })
        .eq("content_kind", kind);
      throw e;
    }
  });

export const resetImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { kind: Kind }) =>
    z
      .object({
        kind: z.enum(["posts", "pages", "media", "product", "courses", "categories", "tags"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("wp_import_state")
      .update({
        last_page: 0,
        imported_items: 0,
        status: "idle",
        last_error: null,
      })
      .eq("content_kind", data.kind);
    return { ok: true };
  });
