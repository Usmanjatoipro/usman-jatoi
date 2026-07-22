import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listCmsRows, type CmsRow } from "@/lib/wp-cms.functions";

type PT = "page" | "post" | "product" | "courses";
const TABS: { key: PT; label: string }[] = [
  { key: "page", label: "Pages" },
  { key: "post", label: "Posts" },
  { key: "product", label: "Products" },
  { key: "courses", label: "Courses" },
];

export const Route = createFileRoute("/_authenticated/cms")({
  head: () => ({
    meta: [
      { title: "CMS — Usman Jatoi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsPage,
});

function CmsPage() {
  const load = useServerFn(listCmsRows);
  const [tab, setTab] = useState<PT>("page");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CmsRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    supabase.auth.getSession().then(() => setReady(true));
    const { data } = supabase.auth.onAuthStateChange(() => setReady(true));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    load({ data: { post_type: tab, q, page, pageSize } })
      .then((r) => {
        setRows(r.rows);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }, [ready, tab, q, page, load]);

  useEffect(() => setPage(1), [tab, q]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">
              Content Browser
            </p>
            <h1 className="text-2xl font-bold text-neutral-900 mt-1">CMS</h1>
          </div>
          <Link to="/admin" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Admin
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                tab === t.key
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or path…"
            className="flex-1 min-w-[240px] rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
          />
          <p className="text-sm text-neutral-500 tabular-nums">
            {loading ? "Loading…" : `${total.toLocaleString()} items`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-3 w-16">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3 w-40">Modified</th>
                  <th className="px-4 py-3 w-24 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-400 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900 line-clamp-1">
                        {decodeEntities(r.title) || "(untitled)"}
                      </div>
                      {r.seo_title && (
                        <div className="text-xs text-neutral-400 line-clamp-1">
                          SEO: {decodeEntities(r.seo_title)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                      {r.path ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 tabular-nums text-xs">
                      {r.post_modified ? new Date(r.post_modified).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.path && (
                        <a
                          href={r.path}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline text-xs font-medium"
                        >
                          View →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-neutral-400">
                      Nothing matches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-sm">
            <p className="text-neutral-500 tabular-nums">
              Page {page} of {totalPages.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-md border border-neutral-200 disabled:opacity-40 hover:border-neutral-900"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-md border border-neutral-200 disabled:opacity-40 hover:border-neutral-900"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function decodeEntities(s: string): string {
  if (!s) return s;
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
