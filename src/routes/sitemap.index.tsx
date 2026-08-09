import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getHtmlSitemapPage,
  HTML_SITEMAP_PAGE_SIZE,
  type SitemapLink,
} from "@/lib/html-sitemap.functions";

const SITE = "https://usmanjatoi.lovable.app";

type Kind = "post" | "page" | "category";

const KINDS: { key: Kind; label: string }[] = [
  { key: "post", label: "Blog posts" },
  { key: "page", label: "Pages" },
  { key: "category", label: "Categories" },
];

export const Route = createFileRoute("/sitemap/")({
  validateSearch: (search: Record<string, unknown>) => ({
    kind: (["post", "page", "category"] as const).includes(search["kind"] as Kind)
      ? (search["kind"] as Kind)
      : ("post" as Kind),
    page: Math.min(50, Math.max(1, Number(search["page"]) || 1)),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getHtmlSitemapPage({ data: { kind: deps.kind, page: deps.page } }),
  head: ({ match }) => {
    const { kind, page } = match.search as { kind: Kind; page: number };
    const label = KINDS.find((k) => k.key === kind)?.label ?? "Content";
    const suffix = page > 1 ? ` — page ${page}` : "";
    const url = `${SITE}/sitemap?kind=${kind}${page > 1 ? `&page=${page}` : ""}`;
    const title = `HTML sitemap: ${label}${suffix} — Usman Jatoi`;
    const description = `Browse every ${label.toLowerCase()} published on usmanjatoi.com — a complete, crawlable index of articles, service pages and topic archives.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: HtmlSitemap,
});

function HtmlSitemap() {
  const { kind, page } = Route.useSearch();
  const { links, total } = Route.useLoaderData() as { links: SitemapLink[]; total: number };
  const totalPages = Math.max(1, Math.ceil(total / HTML_SITEMAP_PAGE_SIZE));

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <section className="bg-neutral-950 text-white px-6 md:px-10 pt-32 pb-14">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-[0.2em] text-white/50">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Sitemap</span>
          </nav>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
            Complete site index
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Every published article, page and topic archive in one crawlable index —{" "}
            {total.toLocaleString("en-US")} links in this section.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <Link
                key={k.key}
                to="/sitemap"
                search={{ kind: k.key, page: 1 }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  k.key === kind ? "bg-[#FF6A00] text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {k.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 max-w-7xl mx-auto py-14">
        <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.path} className="text-sm leading-snug">
              <a href={l.path} className="text-neutral-700 hover:text-[#FF6A00] hover:underline">
                {l.title || l.path}
              </a>
            </li>
          ))}
        </ul>
        {links.length === 0 && (
          <p className="text-neutral-500">Nothing to list in this section yet.</p>
        )}

        {totalPages > 1 && (
          <nav className="mt-12 flex flex-wrap items-center gap-2" aria-label="Sitemap pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                to="/sitemap"
                search={{ kind, page: i + 1 }}
                className={`w-10 h-10 grid place-items-center rounded-lg text-sm font-medium border transition ${
                  i + 1 === page
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </nav>
        )}

        <p className="mt-12 text-sm text-neutral-500">
          Machine-readable index:{" "}
          <a href="/sitemap.xml" className="underline">
            /sitemap.xml
          </a>{" "}
          ·{" "}
          <a href="/llms.txt" className="underline">
            /llms.txt
          </a>
        </p>
      </section>
    </div>
  );
}
