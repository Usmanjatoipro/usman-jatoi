import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// ─── Server-only Supabase client with SERVICE ROLE key for bulk writes ────────
function adminClient() {
  const url = process.env.SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const BATCH = 500; // rows per upsert call

// ─── Seed helpers ─────────────────────────────────────────────────────────────

async function upsertBatch(
  sb: ReturnType<typeof adminClient>,
  table: string,
  rows: object[]
) {
  if (!rows.length) return;
  const { error } = await sb.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
}

// ─── Individual seeders (called from the admin page) ──────────────────────────

export const seedMedia = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ count: number }> => {
    const sb = adminClient();
    const { default: mediaData } = await import("@/data/wp-media-manifest.json");
    const rows = (mediaData as any[]).map((m) => ({
      id: m.id,
      slug: m.slug ?? null,
      title: m.title ?? null,
      alt_text: m.alt_text ?? null,
      caption: m.caption ?? null,
      description: m.description ?? null,
      mime_type: m.mime_type ?? null,
      source_url: m.source_url,
      storage_url: m.storage_url ?? null,
      storage_path: m.storage_path ?? null,
      width: m.width ?? null,
      height: m.height ?? null,
      filesize: m.filesize ?? null,
      raw: m.raw ?? {},
    }));
    for (let i = 0; i < rows.length; i += BATCH) {
      await upsertBatch(sb, "wp_media", rows.slice(i, i + BATCH));
    }
    return { count: rows.length };
  }
);

export const seedTerms = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ count: number }> => {
    const sb = adminClient();
    const { default: termsData } = await import("@/data/wp-terms-manifest.json");
    const rows = (termsData as any[]).map((t, idx) => ({
      id: t.id ?? idx + 1,
      taxonomy: t.taxonomy,
      slug: t.slug,
      name: t.name ?? t.slug,
      description: t.description ?? null,
      parent_id: t.parent_id ?? null,
      count: t.count ?? 0,
      raw: {},
    }));
    // dedupe by id
    const seen = new Set<number>();
    const deduped = rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    for (let i = 0; i < deduped.length; i += BATCH) {
      await upsertBatch(sb, "wp_terms", deduped.slice(i, i + BATCH));
    }
    return { count: deduped.length };
  }
);

export const seedPostsBatch = createServerFn({ method: "POST" })
  .validator(
    (d: { offset: number; postType: "posts" | "pages" }): { offset: number; postType: "posts" | "pages" } => d
  )
  .handler(async ({ data }): Promise<{ done: boolean; count: number; offset: number }> => {
    const sb = adminClient();
    let manifest: any[];
    if (data.postType === "posts") {
      const { default: d } = await import("@/data/wp-posts-manifest.json");
      manifest = d as any[];
    } else {
      const { default: d } = await import("@/data/wp-pages-manifest.json");
      manifest = d as any[];
    }

    const batch = manifest.slice(data.offset, data.offset + BATCH);
    const done = data.offset + batch.length >= manifest.length;

    const rows = batch.map((p: any) => ({
      id: p.id,
      post_type: p.post_type,
      status: p.status ?? "publish",
      slug: p.slug,
      title: p.title ?? null,
      excerpt: p.excerpt ?? null,
      content: p.content ?? null,
      permalink: p.permalink ?? null,
      path: p.path ?? null,
      parent_id: p.parent_id ?? null,
      menu_order: p.menu_order ?? 0,
      author_id: p.author_id ?? null,
      featured_media_id: p.featured_media_id ?? null,
      post_date: p.post_date ?? null,
      post_modified: p.post_modified ?? null,
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
      meta: p.meta ?? {},
      raw: {},
    }));

    await upsertBatch(sb, "wp_posts", rows);

    // Upsert post_terms
    const ptRows: { post_id: number; term_id: number; taxonomy: string }[] = [];
    // We need term ids from wp_terms. We'll resolve by slug.
    const { data: termsData } = await sb
      .from("wp_terms")
      .select("id,slug,taxonomy")
      .limit(10000);
    const termLookup = new Map<string, number>();
    for (const t of termsData || []) {
      termLookup.set(`${(t as any).taxonomy}:${(t as any).slug}`, (t as any).id);
    }

    for (const p of batch) {
      for (const term of p.terms || []) {
        const tid = termLookup.get(`${term.taxonomy}:${term.slug}`);
        if (tid) {
          ptRows.push({ post_id: p.id, term_id: tid, taxonomy: term.taxonomy });
        }
      }
    }

    if (ptRows.length) {
      const { error } = await sb
        .from("wp_post_terms")
        .upsert(ptRows, { onConflict: "post_id,term_id" });
      if (error) console.warn("post_terms error:", error.message);
    }

    return { done, count: rows.length, offset: data.offset + rows.length };
  });

export const getSeedStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const sb = adminClient();
    const { data: counts } = await sb.rpc
      ? await Promise.resolve(null).then(async () => {
          const [mediaRes, postsRes, pagesRes, termsRes] = await Promise.all([
            sb.from("wp_media").select("id", { count: "exact", head: true }),
            sb
              .from("wp_posts")
              .select("id", { count: "exact", head: true })
              .eq("post_type", "post"),
            sb
              .from("wp_posts")
              .select("id", { count: "exact", head: true })
              .eq("post_type", "page"),
            sb.from("wp_terms").select("id", { count: "exact", head: true }),
          ]);
          return {
            data: {
              media: mediaRes.count ?? 0,
              posts: postsRes.count ?? 0,
              pages: pagesRes.count ?? 0,
              terms: termsRes.count ?? 0,
            },
          };
        })
      : { data: null };
    return counts || { media: 0, posts: 0, pages: 0, terms: 0 };
  }
);
