import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { serverGetCategoryBySlug } from "@/lib/wp-data.server";

const SITE = "https://usman-connects-us.lovable.app";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: z.object({ page: z.number().int().min(1).max(50).optional() }).parse,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const result = await serverGetCategoryBySlug(params.slug, deps.page, 24);
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { category, total } = loaderData;
    const title = `${category.name} — Articles, Guides & Resources | Usman Jatoi`;
    const desc =
      (category.description && category.description.slice(0, 155)) ||
      `Browse ${total} posts in the ${category.name} category on Usman Jatoi's site — expert articles, guides, and resources.`;
    const url = `${SITE}/category/${params.slug}`;
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: desc,
            url,
          }),
        },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">{error.message}</p>
        <button
          onClick={() => {
            reset();
            router.invalidate();
          }}
          className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-100"
        >
          Try again
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-3">Category not found</h1>
      <p className="text-neutral-600 mb-6">This category doesn't exist or has been removed.</p>
      <Link to="/category" className="text-indigo-600 hover:underline">
        Browse all categories
      </Link>
    </div>
  ),
});

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function CategoryPage() {
  const data = Route.useLoaderData();
  const { category, ancestors, children, posts, page, totalPages, total, mediaMap } = data as any;
  const params = Route.useParams();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link to="/category" className="hover:text-neutral-900">Categories</Link>
          {(ancestors || []).map((a: any) => (
            <span key={a.slug} className="flex items-center gap-2">
              <span>/</span>
              <Link to="/category/$slug" params={{ slug: a.slug }} className="hover:text-neutral-900">
                {a.name}
              </Link>
            </span>
          ))}
          <span>/</span>
          <span className="text-neutral-900 font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-neutral-200 pb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-600 mb-4">
            <span className="h-px w-8 bg-indigo-600" />
            Category Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-neutral-600 max-w-3xl">{category.description}</p>
          )}
          <p className="text-sm text-neutral-500 mt-4">
            {total} {total === 1 ? "post" : "posts"} in this category
          </p>
        </header>

        {/* Subcategories */}
        {(children || []).length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {(children || []).map((c: any) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-sm transition"
                >
                  {c.name}
                  {c.count ? <span className="text-neutral-400 ml-1">({c.count})</span> : null}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts grid */}
        {posts.length === 0 ? (
          <p className="text-neutral-500 py-12 text-center">No posts published in this category yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => {
              const m = post.featured_media_id ? (mediaMap || {})[post.featured_media_id] : undefined;
              const thumb = m?.storage_url || m?.source_url || null;
              const href = post.path || `/blog/${post.slug}`;
              return (
                <article
                  key={post.id}
                  className="group rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-900 hover:shadow-lg transition"
                >
                  {thumb && (
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                      <img
                        src={thumb}
                        alt={m?.alt_text || post.title || ""}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.post_date && (
                      <time className="text-xs uppercase tracking-widest text-neutral-500">
                        {new Date(post.post_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-indigo-600 transition">
                      <a href={href}>{stripHtml(post.title) || "Untitled"}</a>
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{stripHtml(post.excerpt)}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && (
              <Link
                to="/category/$slug"
                params={{ slug: params.slug }}
                search={{ page: page - 1 }}
                className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-50 text-sm"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-neutral-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                to="/category/$slug"
                params={{ slug: params.slug }}
                search={{ page: page + 1 }}
                className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-50 text-sm"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
