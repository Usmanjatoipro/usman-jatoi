import { createFileRoute, Link } from "@tanstack/react-router";
import { PostArticle, PostArticleTerm } from "@/components/PostArticle";
import { getLocalPostBySlug } from "@/lib/wp-content-stats.functions";

const SITE = "https://usmanjatoi.lovable.app";

function truncate(s: string, n: number) {
  const clean = s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

async function loadPostHead(slug: string) {
  const data = await getLocalPostBySlug({ data: { slug } });
  if (!data) return null;
  return { ...data.post, image: data.heroUrl, categories: data.categories, tags: data.tags };
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => loadPostHead(params.slug),
  head: ({ loaderData, params }) => {
    const url = `${SITE}/blog/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Post not found — Usman Jatoi" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const rawTitle = loaderData.seo_title || loaderData.title || "Blog";
    const title = truncate(`${rawTitle} — Usman Jatoi`, 60);
    const desc = truncate(
      loaderData.seo_description || loaderData.excerpt || rawTitle,
      158
    );
    const image = loaderData.image || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "geo.region", content: "PK" },
        { name: "geo.placename", content: "Pakistan" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
        {
          name: "twitter:card",
          content: image ? "summary_large_image" : "summary",
        },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#article`,
              headline: truncate(rawTitle, 110),
              description: desc,
              datePublished: loaderData.post_date,
              dateModified: loaderData.post_modified || loaderData.post_date,
              image: image ? { "@type": "ImageObject", url: image } : undefined,
              author: { "@id": `${SITE}/#person` },
              publisher: { "@id": `${SITE}/#person` },
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              articleSection: (loaderData.categories || []).map((category: { name: string }) => category.name),
              keywords: (loaderData.tags || []).map((tag: { name: string }) => tag.name).join(", "),
              inLanguage: "en",
            },
            {
              "@type": "Person",
              "@id": `${SITE}/#person`,
              name: "Usman Jatoi",
              url: SITE,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
                { "@type": "ListItem", position: 3, name: truncate(rawTitle, 110), item: url },
              ],
            },
          ],
        }),
      }],
    };
  },
  component: PostPage,
});

function PostPage() {
  const loaderData = Route.useLoaderData() as any;
  if (!loaderData) {
    return (
      <div className="min-h-screen bg-white pt-40 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-neutral-600 mb-8">
          This story may have moved or been unpublished.
        </p>
        <Link to="/blog" className="underline text-neutral-900">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <PostArticle
      post={loaderData}
      heroUrl={loaderData.image || null}
      categories={(loaderData.categories || []) as PostArticleTerm[]}
      tags={(loaderData.tags || []) as PostArticleTerm[]}
    />
  );
}
