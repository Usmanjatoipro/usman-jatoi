import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getComparisonList } from "@/lib/comparisons.functions";

const SITE = "https://usmanjatoi.com";
const TITLE = "Comparisons — Usman Jatoi vs Top Builders & Marketers";
const DESC =
  "Side-by-side comparisons of Usman Jatoi with leading SEOs, indie builders, creators and CMOs — skills, timelines, income models and influence, backed by data tables.";

export const Route = createFileRoute("/comparisons/")({
  loader: () => getComparisonList({ data: {} }),
  head: ({ loaderData }) => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/comparisons` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE}/comparisons` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: `${SITE}/comparisons`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: (loaderData || []).length,
            itemListElement: (loaderData || []).slice(0, 100).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.title,
              url: `${SITE}/comparisons/${c.slug}`,
            })),
          },
        }),
      },
    ],
  }),
  component: ComparisonsIndex,
});

function ComparisonsIndex() {
  const items = Route.useLoaderData();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i: any) => i.title.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <main className="bg-white text-neutral-900">
      <PageHero
        eyebrow="Comparisons"
        title="Usman Jatoi vs the people shaping SEO, indie building and marketing"
        description="Honest, data-backed side-by-side breakdowns — skills, timelines, revenue models, tools and influence."
        crumbs={[{ label: "Home", href: "/" }, { label: "Comparisons" }]}
        size="md"
      />

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-neutral-500">
            <strong className="text-neutral-900">{filtered.length}</strong> comparisons
          </p>
          <label className="relative w-full md:w-80">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a name…"
              aria-label="Search comparisons"
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-900"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c: any) => (
            <Link
              key={c.slug}
              to="/comparisons/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_18px_40px_rgba(15,23,42,.10)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                    {c.rival || c.title}
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-[#FF6A00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Comparison
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-base font-semibold leading-snug text-neutral-900 group-hover:text-[#FF6A00]">
                  {c.title}
                </h2>
                {c.summary && (
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{c.summary}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                  Read more
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-neutral-500">No comparison matches “{q}”.</p>
        )}
      </section>
    </main>
  );
}
