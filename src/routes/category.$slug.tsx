import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { getCategoryBySlug } from "@/lib/wp-categories.functions";
import { getLocalCategoryArchiveBySlug } from "@/lib/wp-content-stats.functions";
import PageHero, { type Crumb } from "@/components/PageHero";

const SITE = "https://usman-connects-us.lovable.app";

type CategoryViewItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent_id: number | null;
  count: number;
};

type CategoryPostView = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  permalink?: string | null;
  path?: string | null;
  post_date: string | null;
  featured_image: string | null;
};

export const Route = createFileRoute("/category/$slug")({
  validateSearch: z.object({ page: z.number().int().min(1).max(50).optional() }).parse,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const local = await getLocalCategoryArchiveBySlug({ data: { slug: params.slug, page: deps.page } });
    if (local) return local;
    const result = await getCategoryBySlug({ data: { slug: params.slug, page: deps.page } });
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
      <a href="/category" className="text-indigo-600 hover:underline">
        Browse all categories
      </a>
    </div>
  ),
});

function CategoryPage() {
  const data = Route.useLoaderData() as any;
  const { category, ancestors, children, posts, page, totalPages, total } = data;
  const params = Route.useParams();

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/category" },
    ...ancestors.map((a: CategoryViewItem) => ({ label: a.name, href: `/category/${a.slug}` })),
    { label: category.name },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <PageHero
        eyebrow="Category Archive"
        title={category.name}
        description={category.description || undefined}
        crumbs={crumbs}
        size="lg"
      >
      </PageHero>

      <div className="mx-auto max-w-6xl px-6 py-14">


        {children.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {children.map((c: CategoryViewItem) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-sm transition"
                >
                  {c.name} <span className="text-neutral-400">({c.count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 ? (
          <p className="text-neutral-500 py-12 text-center">No posts published in this category yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: CategoryPostView) => (
              <article
                key={post.id}
                className="group rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-900 hover:shadow-lg transition"
              >
                {post.featured_image && (
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.post_date && (
                    <time className="text-xs uppercase tracking-widest text-neutral-500">
                      {new Date(post.post_date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-indigo-600 transition">
                    {post.path || post.permalink ? (
                      <a href={(post.path || post.permalink) || undefined}>
                        {post.title}
                      </a>
                    ) : (
                      post.title
                    )}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

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
