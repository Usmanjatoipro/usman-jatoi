import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import { getBlogIndexPage } from "@/lib/wp-blog.functions";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogIndexPage({ data: { offset: 0, limit: PAGE_SIZE, search: "" } }),
  head: () => ({
    meta: [
      { title: "Blog — Usman Jatoi" },
      {
        name: "description",
        content:
          "Essays, notes, tutorials and behind-the-scenes writing from Usman Jatoi on design, code, automation and building in public.",
      },
      { property: "og:title", content: "Blog — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Essays, notes, tutorials and behind-the-scenes writing from Usman Jatoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

type Post = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  post_date: string | null;
  featured_media_id: number | null;
  meta?: Record<string, unknown> | null;
};

type Media = { id: number; storage_url: string | null; source_url: string | null; alt_text: string | null };

const PAGE_SIZE = 18;

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function firstImageFromHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function metaImage(meta: Record<string, unknown> | null | undefined): string | null {
  if (!meta) return null;
  for (const key of ["fifu_image_url", "_thumbnail_url", "rank_math_facebook_image", "og_image"]) {
    const raw = meta[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) return value.trim();
  }
  return null;
}

function postImage(p: Post, media: Record<number, Media>): string | null {
  const m = p.featured_media_id && p.featured_media_id > 0 ? media[p.featured_media_id] : undefined;
  return (
    m?.source_url ||
    m?.storage_url ||
    metaImage(p.meta) ||
    firstImageFromHtml(p.content) ||
    null
  );
}

function readingMinutes(html: string | null | undefined) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}


function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function CoverFallback({ title, big }: { title: string; big?: boolean }) {
  const seed = Array.from(title).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const hue = seed % 360;
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 30% 16%), hsl(${(hue + 48) % 360} 42% 30%))`,
      }}
      aria-hidden
    >
      <span
        className={`font-semibold tracking-tight text-white/85 ${big ? "text-6xl" : "text-4xl"}`}
      >
        {initials || "UJ"}
      </span>
      <span className="absolute bottom-3 right-4 text-[10px] font-mono uppercase tracking-[0.24em] text-white/45">
        Usman Jatoi
      </span>
    </div>
  );
}

function CoverImage({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CoverFallback title={alt} big={eager} />;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}



function BlogPage() {
  const initial = Route.useLoaderData();
  const loadPage = useServerFn(getBlogIndexPage);
  const initialPosts = (initial?.posts ?? []) as Post[];
  const initialMedia = (initial?.media ?? {}) as Record<number, Media>;
  const initialTotal = initial?.total ?? 0;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [media, setMedia] = useState<Record<number, Media>>(initialMedia);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [debounced]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (page === 0 && !debounced && initial) {
        setPosts(initialPosts);
        setMedia(initialMedia);
        setTotal(initialTotal);
        setLoading(false);
        return;
      }
      const result = await loadPage({
        data: { offset: page * PAGE_SIZE, limit: PAGE_SIZE, search: debounced },
      });
      if (cancelled) return;
      setPosts(result.posts as Post[]);
      setMedia(result.media as Record<number, Media>);
      setTotal(result.total);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, debounced, loadPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    const cur = page;
    const max = totalPages - 1;
    const window = new Set<number>([0, max, cur - 1, cur, cur + 1]);
    const sorted = [...window].filter((n) => n >= 0 && n <= max).sort((a, b) => a - b);
    let prev = -2;
    for (const n of sorted) {
      if (n - prev > 1) nums.push("…");
      nums.push(n);
      prev = n;
    }
    return nums;
  }, [page, totalPages]);

  const [featured, ...rest] = posts;
  const featuredMedia =
    featured?.featured_media_id && featured.featured_media_id > 0 ? media[featured.featured_media_id] : undefined;
  const featuredThumb = featured ? postImage(featured, media) : null;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <PageHero
        eyebrow="Journal"
        title="Notes from the workshop."
        description="Essays, tutorials, and behind-the-scenes writing on design, code, automation, and building in public."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="pt-12 pb-6 px-6 md:px-10 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search stories"
            className="w-full px-5 py-3.5 pr-12 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-neutral-900 focus:outline-none transition text-[15px] placeholder:text-neutral-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </section>

      {/* Featured post */}
      {!loading && featured && page === 0 && !debounced && (
        <section className="px-6 md:px-10 max-w-7xl mx-auto pb-12">
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group grid md:grid-cols-5 gap-8 items-center border-b border-neutral-200 pb-12"
          >
            <div className="md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
              {featuredThumb ? (
                <CoverImage
                  src={featuredThumb}
                  alt={featuredMedia?.alt_text || stripHtml(featured.title) || "Featured article"}
                  eager
                />
              ) : (
                <CoverFallback title={stripHtml(featured.title)} big />
              )}
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mb-4">
                <span className="uppercase tracking-[0.18em] text-neutral-900 font-semibold">Featured</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <time>{formatDate(featured.post_date)}</time>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span>{readingMinutes(featured.content)} min read</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4 group-hover:text-neutral-600 transition-colors">
                {stripHtml(featured.title) || "Untitled"}
              </h2>
              <p className="text-neutral-600 leading-relaxed line-clamp-4 mb-6">
                {stripHtml(featured.excerpt) || stripHtml(featured.content).slice(0, 200)}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 border-b border-neutral-900 pb-0.5 group-hover:gap-3 transition-all">
                Read the story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[16/10] bg-neutral-100 rounded-xl animate-pulse" />
                <div className="mt-4 h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                <div className="mt-3 h-6 w-full bg-neutral-100 rounded animate-pulse" />
                <div className="mt-2 h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-neutral-500">
              No stories found{debounced ? ` for "${debounced}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {(page === 0 && !debounced ? rest : posts).map((p) => {
              const m = p.featured_media_id && p.featured_media_id > 0 ? media[p.featured_media_id] : undefined;
              const thumb = postImage(p, media);
              const excerpt = stripHtml(p.excerpt) || stripHtml(p.content).slice(0, 160);
              return (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                    {thumb ? (
                      <CoverImage
                        src={thumb}
                        alt={m?.alt_text || stripHtml(p.title) || "Article cover"}
                      />
                    ) : (
                      <CoverFallback title={stripHtml(p.title)} />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-mono tracking-wide text-neutral-500">
                    <time>{formatDate(p.post_date)}</time>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>{readingMinutes(p.content)} min read</span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight leading-snug line-clamp-2 group-hover:text-neutral-500 transition-colors">
                    {stripHtml(p.title) || "Untitled"}
                  </h2>
                  {excerpt && (
                    <p className="mt-2 text-[15px] text-neutral-600 leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 group-hover:gap-2.5 transition-all">
                    Read more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && totalPages > 1 && (
          <div className="mt-20 flex flex-wrap items-center justify-center gap-2">
            <button
              className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              disabled={page === 0}
              onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              ← Prev
            </button>
            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`e${i}`} className="px-2 text-neutral-400">…</span>
              ) : (
                <button
                  key={n}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    n === page
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                  onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                >
                  {n + 1}
                </button>
              )
            )}
            <button
              className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              disabled={page >= totalPages - 1}
              onClick={() => { setPage((p) => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
