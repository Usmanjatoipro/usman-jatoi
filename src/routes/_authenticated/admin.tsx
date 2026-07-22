import { createFileRoute, Link } from "@tanstack/react-router";
import { listCategoriesTree, type WpCategoryNode } from "@/lib/wp-categories.functions";
import {
  rewriteInlineMediaBatch,
  backfillFeaturedImagesBatch,
  getCleanupStats,
} from "@/lib/wp-cleanup.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/admin")({
  loader: async () => await listCategoriesTree(),
  head: () => ({
    meta: [
      { title: "Admin — Usman Jatoi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found</div>,
});


function AdminPage() {
  const { tree, flat } = Route.useLoaderData() as Awaited<ReturnType<typeof listCategoriesTree>>;
  const [q, setQ] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const filtered = useMemo(() => {
    if (!q.trim()) return tree;
    const needle = q.toLowerCase();
    const filterRec = (nodes: WpCategoryNode[]): WpCategoryNode[] =>
      nodes
        .map((n) => {
          const children = filterRec(n.children);
          const match =
            n.name.toLowerCase().includes(needle) ||
            n.slug.toLowerCase().includes(needle) ||
            String(n.id) === needle;
          if (match || children.length) return { ...n, children };
          return null;
        })
        .filter(Boolean) as WpCategoryNode[];
    return filterRec(tree);
  }, [q, tree]);

  const totalPosts = flat.reduce((s, c) => s + (c.count || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">
              Admin Console
            </p>
            <h1 className="text-2xl font-bold text-neutral-900 mt-1">Content Management</h1>
          </div>
          <Link
            to="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Categories" value={flat.length} />
          <Stat label="Root Categories" value={tree.length} />
          <Stat label="Total Posts" value={totalPosts.toLocaleString()} />
          <Stat label="Deepest Level" value={maxDepth(tree)} />
        </div>

        {/* Quick actions */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-bold mb-4">Import & Sync</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Link
              to="/import"
              className="group flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:border-indigo-600 hover:bg-indigo-50/40 transition"
            >
              <div>
                <p className="font-semibold text-neutral-900">WordPress Import</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Posts, pages, custom post types
                </p>
              </div>
              <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
            </Link>
            <Link
              to="/import"
              className="group flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:border-indigo-600 hover:bg-indigo-50/40 transition"
            >
              <div>
                <p className="font-semibold text-neutral-900">Media Sync</p>
                <p className="text-sm text-neutral-500 mt-1">
                  609 attachments to storage
                </p>
              </div>
              <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
            </Link>
          </div>
        </section>

        <CleanupPanel />

        {/* Categories */}
        <section className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">Categories</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  All {flat.length} categories with full parent → child hierarchy.
                  Click a name to view the public archive.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandAll((v) => !v)}
                  className="text-sm px-3 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-900 transition"
                >
                  {expandAll ? "Collapse all" : "Expand all"}
                </button>
              </div>
            </div>
            <input
              type="search"
              placeholder="Search by name, slug, or ID..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-4 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-2" key={String(expandAll)}>
            {filtered.length === 0 ? (
              <p className="text-center text-neutral-400 py-12 text-sm">No categories match.</p>
            ) : (
              <TreeList nodes={filtered} forceOpen={expandAll} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TreeList({ nodes, forceOpen }: { nodes: WpCategoryNode[]; forceOpen: boolean }) {
  return (
    <>
      {nodes.map((n) => (
        <TreeItem key={n.id} node={n} depth={0} forceOpen={forceOpen} />
      ))}
    </>
  );
}

function TreeItem({
  node,
  depth,
  forceOpen,
}: {
  node: WpCategoryNode;
  depth: number;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(forceOpen);
  const hasChildren = node.children.length > 0;
  const indent = depth * 20;

  return (
    <div>
      <div
        className="flex items-center justify-between gap-3 rounded-md py-2 pr-3 hover:bg-neutral-50 transition"
        style={{ paddingLeft: `${8 + indent}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-200 shrink-0"
              aria-label={open ? "Collapse" : "Expand"}
            >
              <span
                className={`inline-block transition-transform text-xs ${
                  open ? "rotate-90" : ""
                }`}
              >
                ▶
              </span>
            </button>
          ) : (
            <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center text-neutral-300 text-xs">
              •
            </span>
          )}
          <span className="text-[10px] font-mono text-neutral-400 w-12 shrink-0 tabular-nums">
            #{node.id}
          </span>
          <Link
            to="/category/$slug"
            params={{ slug: node.slug }}
            target="_blank"
            className="font-medium text-neutral-900 hover:text-indigo-600 truncate"
          >
            {node.name}
          </Link>
          <span className="text-xs text-neutral-400 truncate hidden sm:inline">
            /{node.slug}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasChildren && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 tabular-nums">
              {node.children.length} sub
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 tabular-nums font-medium">
            {node.count}
          </span>
        </div>
      </div>
      {hasChildren && open && (
        <div className="border-l border-neutral-200 ml-4">
          {node.children.map((c) => (
            <TreeItem key={c.id} node={c} depth={depth + 1} forceOpen={forceOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
        {label}
      </p>
      <p className="text-3xl font-bold text-neutral-900 mt-2 tabular-nums">{value}</p>
    </div>
  );
}

function maxDepth(nodes: WpCategoryNode[], d = 1): number {
  let max = nodes.length ? d : 0;
  for (const n of nodes) {
    if (n.children.length) max = Math.max(max, maxDepth(n.children, d + 1));
  }
  return max;
}
