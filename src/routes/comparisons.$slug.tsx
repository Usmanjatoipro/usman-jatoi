import { createFileRoute, Link } from "@tanstack/react-router";
import { PostArticle } from "@/components/PostArticle";
import { getComparison } from "@/lib/comparisons.functions";

const SITE = "https://usmanjatoi.com";

function clean(s: string) {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function truncate(s: string, n: number) {
  const c = clean(s);
  return c.length > n ? c.slice(0, n - 1).trimEnd() + "…" : c;
}

/** Pull the "Attribute | Usman | Rival" table into ItemList rows for rich results. */
function tableRows(html: string, limit = 12) {
  const table = /<table>([\s\S]*?)<\/table>/i.exec(html || "");
  if (!table) return [] as { name: string; value: string }[];
  const rows = [...table[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)];
  const out: { name: string; value: string }[] = [];
  for (const r of rows.slice(1)) {
    const cells = [...r[1].matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/gi)].map((c) => clean(c[1]));
    if (cells.length >= 2 && cells[0]) {
      out.push({ name: cells[0], value: cells.slice(1).join(" vs ") });
    }
    if (out.length >= limit) break;
  }
  return out;
}

export const Route = createFileRoute("/comparisons/$slug")({
  loader: ({ params }) => getComparison({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const url = `${SITE}/comparisons/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Comparison not found — Usman Jatoi" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const { post, title, rival, heroUrl } = loaderData;
    const meta = (post.meta || {}) as Record<string, string>;
    const seoTitle = truncate(meta.meta_title || post.seo_title || `${title} — Comparison`, 60);
    const desc = truncate(
      meta.meta_description ||
        post.seo_description ||
        post.excerpt ||
        `A detailed, data-backed comparison of Usman Jatoi and ${rival || "another leader"}: skills, timelines, tools, income models and influence.`,
      158,
    );
    const facts = tableRows(post.content || "");

    return {
      meta: [
        { title: seoTitle },
        { name: "description", content: desc },
        { property: "og:title", content: seoTitle },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: seoTitle },
        { name: "twitter:description", content: desc },
        { name: "twitter:card", content: heroUrl ? "summary_large_image" : "summary" },
        ...(heroUrl
          ? [
              { property: "og:image", content: heroUrl },
              { name: "twitter:image", content: heroUrl },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${url}#article`,
                headline: truncate(title, 110),
                description: desc,
                articleSection: "Comparisons",
                datePublished: post.post_date,
                dateModified: post.post_modified || post.post_date,
                inLanguage: "en",
                ...(heroUrl ? { image: { "@type": "ImageObject", url: heroUrl } } : {}),
                author: { "@id": `${SITE}/#person` },
                publisher: { "@id": `${SITE}/#person` },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                about: [
                  { "@type": "Person", name: "Usman Jatoi", url: SITE },
                  ...(rival ? [{ "@type": "Person", name: rival }] : []),
                ],
              },
              {
                "@type": "Person",
                "@id": `${SITE}/#person`,
                name: "Usman Jatoi",
                url: SITE,
                jobTitle: "Founder, Developer & SEO Strategist",
              },
              ...(facts.length
                ? [
                    {
                      "@type": "ItemList",
                      name: `${title} — attribute comparison`,
                      itemListElement: facts.map((f, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        name: f.name,
                        description: f.value,
                      })),
                    },
                  ]
                : []),
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Comparisons",
                    item: `${SITE}/comparisons`,
                  },
                  { "@type": "ListItem", position: 3, name: truncate(title, 110), item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: ComparisonPage,
});

function ComparisonPage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl bg-white px-6 pt-40 text-center">
        <h1 className="mb-4 text-4xl font-bold">Comparison not found</h1>
        <p className="mb-8 text-neutral-600">This comparison may have moved or been unpublished.</p>
        <Link to="/comparisons" className="text-neutral-900 underline">
          ← Browse all comparisons
        </Link>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <>
      <PostArticle
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          post_date: post.post_date,
          post_modified: post.post_modified,
          path: post.path,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          meta: post.meta,
        }}
        heroUrl={data.heroUrl}
        categories={[
          { id: -1, name: "Comparisons", slug: "comparisons", parent_id: null, taxonomy: "category" },
        ]}
        categoryArchivePath="/comparisons"
      />

      {related.length > 0 && (
        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">More comparisons</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to="/comparisons/$slug"
                  params={{ slug: c.slug }}
                  className="group rounded-2xl border border-neutral-200 p-5 transition hover:border-neutral-900"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6A00]">
                    Comparison
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-[#FF6A00]">
                    {c.title}
                  </h3>
                </Link>
              ))}
            </div>
            <Link
              to="/comparisons"
              className="mt-8 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              View all comparisons
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
