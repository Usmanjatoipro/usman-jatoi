import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type AuditFinding = {
  id: string;
  kind: string;
  severity: string;
  target_path: string;
  target_kind: string | null;
  detail: string | null;
  resolved: boolean;
};

export type AuditSnapshot = {
  generated_at: string | null;
  totals: Record<string, number>;
  total_issues: number;
  audited: number;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getAuditSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const empty: AuditSnapshot = { generated_at: null, totals: {}, total_issues: 0, audited: 0 };
  if (!supa) return empty;
  const { data } = await supa
    .from("seo_audit_snapshot")
    .select("payload, generated_at")
    .eq("id", 1)
    .maybeSingle();
  if (!data) return empty;
  const p = (data.payload ?? {}) as Record<string, any>;
  return {
    generated_at: data.generated_at as string,
    totals: (p["totals"] ?? {}) as Record<string, number>,
    total_issues: Number(p["total_issues"] ?? 0),
    audited: Number(p["audited"] ?? 0),
  } satisfies AuditSnapshot;
});

export const listAuditFindings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        kind: z.string().max(60).optional(),
        limit: z.number().int().min(1).max(200).default(100),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("seo_audit_findings")
      .select("id, kind, severity, target_path, target_kind, detail, resolved")
      .eq("resolved", false)
      .order("severity", { ascending: true })
      .limit(data.limit);
    if (data.kind) q = q.eq("kind", data.kind);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as AuditFinding[];
  });

export const runSeoAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("run_seo_audit");
    if (error) throw new Error(error.message);
    const p = (data ?? {}) as Record<string, any>;
    return {
      generated_at: new Date().toISOString(),
      totals: (p["totals"] ?? {}) as Record<string, number>,
      total_issues: Number(p["total_issues"] ?? 0),
      audited: Number(p["audited"] ?? 0),
    } satisfies AuditSnapshot;
  });

export const resolveFinding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("seo_audit_findings")
      .update({ resolved: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const STATIC_PATHS = new Set([
  "/",
  "/services",
  "/blog",
  "/about-me",
  "/contact-me",
  "/call",
  "/portfolio",
  "/courses",
  "/testimonials",
  "/awards",
  "/certifications",
  "/careers",
  "/media-kit",
  "/businesses",
  "/press-release",
  "/white-label-partnership",
  "/sitemap",
]);

function normalise(href: string) {
  return href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
}

/** Scans a batch of posts for internal links that do not resolve to a known page. */
export const scanBrokenLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        offset: z.number().int().min(0).default(0),
        batch: z.number().int().min(10).max(300).default(150),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("wp_posts")
      .select("id, path, content")
      .eq("status", "publish")
      .not("path", "is", null)
      .order("id", { ascending: true })
      .range(data.offset, data.offset + data.batch - 1);
    if (error) throw new Error(error.message);

    const links = new Map<string, number>(); // path -> source post id
    for (const row of (rows ?? []) as Array<{ id: number; path: string; content: string | null }>) {
      const html = row.content ?? "";
      const re = /href="((?:https?:\/\/(?:www\.)?usmanjatoi\.com)?\/[^"']*)"/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html))) {
        const raw = m[1].replace(/^https?:\/\/(?:www\.)?usmanjatoi\.com/i, "");
        if (!raw.startsWith("/")) continue;
        if (/\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|mp4|css|js)$/i.test(raw)) continue;
        if (raw.startsWith("/wp-")) continue;
        const p = normalise(raw);
        if (STATIC_PATHS.has(p) || p.startsWith("/category/")) continue;
        if (!links.has(p)) links.set(p, row.id);
      }
    }

    const candidates = [...links.keys()];
    const found = new Set<string>();
    for (let i = 0; i < candidates.length; i += 200) {
      const slice = candidates.slice(i, i + 200);
      const variants = slice.flatMap((p) => [p, `${p}/`]);
      const { data: hits } = await context.supabase
        .from("wp_posts")
        .select("path")
        .in("path", variants)
        .eq("status", "publish");
      for (const h of (hits ?? []) as Array<{ path: string }>) found.add(normalise(h.path));
    }

    const broken = candidates.filter((p) => !found.has(p));
    if (broken.length) {
      await context.supabase.from("broken_links").upsert(
        broken.map((p) => ({
          path: p,
          source_post_id: links.get(p) ?? null,
          checked_at: new Date().toISOString(),
        })),
        { onConflict: "path" },
      );
    }

    return {
      scanned: rows?.length ?? 0,
      nextOffset: data.offset + (rows?.length ?? 0),
      done: (rows?.length ?? 0) < data.batch,
      uniqueLinks: candidates.length,
      broken: broken.length,
      examples: broken.slice(0, 10),
    };
  });

export const listBrokenLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("broken_links")
      .select("path, suggested, source_post_id, checked_at")
      .order("checked_at", { ascending: false })
      .limit(200);
    return (data ?? []) as Array<{
      path: string;
      suggested: string | null;
      source_post_id: number | null;
      checked_at: string;
    }>;
  });
