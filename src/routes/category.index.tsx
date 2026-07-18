import { createFileRoute, Link } from "@tanstack/react-router";
import { listCategoriesTree, type WpCategoryNode } from "@/lib/wp-categories.functions";

const SITE = "https://usman-connects-us.lovable.app";

export const Route = createFileRoute("/category/")({
  loader: async () => await listCategoriesTree(),
  head: ({ loaderData }) => {
    const count = loaderData?.flat.length ?? 0;
    const title = `All Categories — ${count} Topics | Usman Jatoi`;
    const desc = `Explore ${count} categories on Usman Jatoi's site — marketing, AI, business, growth, digital tools, case studies and more.`;
    const url = `${SITE}/category`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CategoriesIndex,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold mb-3">Couldn't load categories</h1>
      <p className="text-neutral-600">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">Not found</div>
  ),
});

function Node({ node, depth }: { node: WpCategoryNode; depth: number }) {
  return (
    <li>
      <Link
        to="/category/$slug"
        params={{ slug: node.slug }}
        className="inline-flex items-baseline gap-2 py-1 hover:text-indigo-600"
      >
        <span className="font-medium">{node.name}</span>
        <span className="text-xs text-neutral-400">({node.count})</span>
      </Link>
      {node.children.length > 0 && (
        <ul className={`mt-1 ml-${depth === 0 ? 4 : 6} space-y-1 border-l border-neutral-200 pl-4`}>
          {node.children.map((c) => (
            <Node key={c.id} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function CategoriesIndex() {
  const { tree, flat } = Route.useLoaderData() as Awaited<ReturnType<typeof listCategoriesTree>>;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <nav className="text-sm text-neutral-500 mb-6">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 font-medium">Categories</span>
        </nav>

        <header className="mb-12 border-b border-neutral-200 pb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-600 mb-4">
            <span className="h-px w-8 bg-indigo-600" />
            Content Library
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All Categories</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Browse {flat.length} categories covering marketing, AI, business, growth, tools, case studies and more.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {tree.map((root) => (
            <section key={root.id} className="rounded-xl border border-neutral-200 p-6 hover:border-neutral-900 transition">
              <Link
                to="/category/$slug"
                params={{ slug: root.slug }}
                className="text-xl font-bold hover:text-indigo-600"
              >
                {root.name}
              </Link>
              <p className="text-xs text-neutral-500 mt-1 mb-4">
                {root.count} posts{root.children.length > 0 && ` · ${root.children.length} subcategories`}
              </p>
              {root.children.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {root.children.slice(0, 8).map((c) => (
                    <Node key={c.id} node={c} depth={0} />
                  ))}
                  {root.children.length > 8 && (
                    <li className="text-xs text-neutral-400 pt-2">
                      + {root.children.length - 8} more
                    </li>
                  )}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
