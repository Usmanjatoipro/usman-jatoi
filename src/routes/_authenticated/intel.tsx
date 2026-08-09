import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  getContentStats,
  refreshContentStats,
  type ClusterStat,
  type ContentStats,
} from "@/lib/content-intel.functions";

export const Route = createFileRoute("/_authenticated/intel")({
  loader: () => getContentStats(),
  head: () => ({
    meta: [
      { title: "Content Intelligence — Usman Jatoi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: IntelPage,
});

const ORANGE = "#FF6A00";

function n(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("en-US");
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-neutral-200 rounded-xl p-5 bg-white">
      <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ORANGE }} />
    </div>
  );
}

function IntelPage() {
  const initial = Route.useLoaderData() as ContentStats;
  const refresh = useServerFn(refreshContentStats);
  const [stats, setStats] = useState<ContentStats>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"posts" | "gap" | "thin">("posts");

  const clusters = useMemo(() => {
    const list = (stats.clusters ?? []).filter((c) =>
      query ? `${c.name ?? ""} ${c.slug}`.toLowerCase().includes(query.toLowerCase()) : true,
    );
    const scored = list.map((c) => ({ ...c, gap: c.posts - c.with_outline }));
    scored.sort((a, b) =>
      sort === "posts" ? b.posts - a.posts : sort === "thin" ? b.thin - a.thin : b.gap - a.gap,
    );
    return scored;
  }, [stats.clusters, query, sort]);

  const maxPosts = clusters.reduce((m, c) => Math.max(m, c.posts), 0);
  const empty = (stats.clusters ?? []).filter((c: ClusterStat) => c.posts === 0).length;
  const totalPosts = stats.totals?.["post"] ?? 0;

  async function onRefresh() {
    setBusy(true);
    setError(null);
    try {
      setStats(await refresh({ data: undefined }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Admin</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Content intelligence</h1>
            <p className="mt-2 text-neutral-600 max-w-2xl">
              Inventory, quality gaps and topical-authority coverage across every page, post and
              category on the site.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cms" className="text-sm underline text-neutral-700">
              Open CMS
            </Link>
            <button
              onClick={onRefresh}
              disabled={busy}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: ORANGE }}
            >
              {busy ? "Recalculating…" : "Refresh stats"}
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-neutral-500">
          {stats.generated_at
            ? `Snapshot generated ${new Date(stats.generated_at).toLocaleString("en-US", { timeZone: "UTC" })} UTC`
            : "No snapshot yet — hit refresh."}
          {error && <span className="ml-3 text-red-600">{error}</span>}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Published items" value={n(stats.total_published)} hint="pages + posts + products" />
          <Stat label="Blog posts" value={n(totalPosts)} hint={`${n(stats.totals?.["page"])} pages`} />
          <Stat label="Categories" value={n(stats.categories)} hint={`${n(empty)} with no posts`} />
          <Stat
            label="Research outlines"
            value={n(stats.outlines)}
            hint={`${totalPosts ? Math.round((stats.outlines / totalPosts) * 100) : 0}% of posts enriched`}
          />
        </div>

        <h2 className="mt-12 text-lg font-semibold tracking-tight">Quality gaps</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Missing SEO title" value={n(stats.quality.missing_seo_title)} />
          <Stat label="Missing meta desc" value={n(stats.quality.missing_seo_description)} />
          <Stat label="Thin content" value={n(stats.quality.thin_content)} hint="< 2,000 chars" />
          <Stat label="No featured image" value={n(stats.quality.no_featured_media)} />
          <Stat label="Uncategorised posts" value={n(stats.uncategorised_posts)} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Topical authority by cluster</h2>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter clusters…"
              className="px-3 py-2 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
            />
            {(["posts", "gap", "thin"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                  sort === key
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {key === "posts" ? "Most posts" : key === "gap" ? "Biggest research gap" : "Most thin"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cluster</th>
                <th className="px-4 py-3 font-medium w-56">Coverage</th>
                <th className="px-4 py-3 font-medium text-right">Posts</th>
                <th className="px-4 py-3 font-medium text-right">Enriched</th>
                <th className="px-4 py-3 font-medium text-right">Thin</th>
                <th className="px-4 py-3 font-medium text-right">Avg chars</th>
              </tr>
            </thead>
            <tbody>
              {clusters.slice(0, 120).map((c) => (
                <tr key={c.slug} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="font-medium hover:underline"
                    >
                      {c.name || c.slug}
                    </Link>
                    <div className="text-[11px] text-neutral-400">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Bar value={c.posts} max={maxPosts} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(c.posts)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(c.with_outline)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(c.thin)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(c.avg_len)}</td>
                </tr>
              ))}
              {clusters.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                    No clusters match that filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-lg font-semibold tracking-tight">Site hierarchy</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(stats.sections ?? []).map((s) => (
            <div key={s.section} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="text-sm font-medium truncate">/{s.section || "root"}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{n(s.items)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
