import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
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
  post_date: string | null;
  featured_media_id: number | null;
};

type Media = { id: number; storage_url: string | null; source_url: string | null; alt_text: string | null };

const PAGE_SIZE = 24;

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&hellip;/g, "…").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [media, setMedia] = useState<Record<number, Media>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);

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
      let q = supabase
        .from("wp_posts")
        .select("id,slug,title,excerpt,post_date,featured_media_id", { count: "exact" })
        .eq("post_type", "post")
        .eq("status", "publish")
        .order("post_date", { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (debounced) q = q.ilike("title", `%${debounced}%`);

      const { data, count } = await q;
      if (cancelled) return;
      const rows = (data ?? []) as Post[];
      setPosts(rows);
      setTotal(count ?? 0);

      const mediaIds = rows.map((r) => r.featured_media_id).filter((x): x is number => !!x);
      if (mediaIds.length) {
        const { data: mediaRows } = await supabase
          .from("wp_media")
          .select("id,storage_url,source_url,alt_text")
          .in("id", mediaIds);
        if (!cancelled && mediaRows) {
          const map: Record<number, Media> = {};
          for (const m of mediaRows as Media[]) map[m.id] = m;
          setMedia(map);
        }
      } else {
        setMedia({});
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, debounced]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    const push = (n: number | "…") => nums.push(n);
    const cur = page;
    const max = totalPages - 1;
    const window = new Set<number>([0, max, cur - 1, cur, cur + 1]);
    const sorted = [...window].filter((n) => n >= 0 && n <= max).sort((a, b) => a - b);
    let prev = -2;
    for (const n of sorted) {
      if (n - prev > 1) push("…");
      push(n);
      prev = n;
    }
    return nums;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes blogGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .blog-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: blogGrad 8s ease infinite;
        }
        .blog-tag {
          display:inline-block; font-size:11px; letter-spacing:.12em; text-transform:uppercase;
          padding:4px 10px; border-radius:999px; background:#111; color:#fff; font-weight:600;
        }
        .blog-card { position:relative; border-radius:20px; background:#fff; overflow:hidden; transition:transform .3s ease; display:flex; flex-direction:column; }
        .blog-card:hover { transform: translateY(-4px); }
        .blog-card::before {
          content:""; position:absolute; inset:0; padding:1.5px; border-radius:20px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: blogGrad 10s ease infinite; pointer-events:none; z-index:1;
        }
        .blog-card > * { position: relative; z-index: 2; }
        .blog-pill {
          position:relative; display:inline-flex; align-items:center; gap:8px;
          padding:10px 20px; border-radius:999px; background:#fff; color:#111;
          font-weight:600; font-size:14px; text-decoration:none; cursor:pointer; border:0;
        }
        .blog-pill::before {
          content:""; position:absolute; inset:0; padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: blogGrad 8s ease infinite; pointer-events:none;
        }
        .blog-pill[disabled] { opacity:.4; cursor:not-allowed; }
        .blog-pill.is-active { background:#111; color:#fff; }
        .blog-thumb { aspect-ratio: 16/10; background:#f5f5f5; overflow:hidden; }
        .blog-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
        .blog-card:hover .blog-thumb img { transform:scale(1.05); }
        .blog-skeleton { animation: pulse 1.5s ease-in-out infinite; background:#f5f5f5; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="blog-tag mb-6">Blog</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Notes from the <span className="blog-gradient-text">workshop</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          Essays, tutorials, experiments and behind-the-scenes writing on design,
          code, automation and building in public.
        </p>
        <p className="mt-4 text-sm text-neutral-500 font-mono">
          {total.toLocaleString()} posts in the archive
        </p>

        {/* Search */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full px-6 py-4 pr-14 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition text-base"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="blog-card">
                <div className="blog-thumb blog-skeleton" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 blog-skeleton rounded" />
                  <div className="h-6 w-full blog-skeleton rounded" />
                  <div className="h-4 w-3/4 blog-skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-neutral-500">No posts found{debounced ? ` for "${debounced}"` : ""}.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => {
              const m = p.featured_media_id ? media[p.featured_media_id] : undefined;
              const thumb = m?.storage_url || m?.source_url;
              const excerpt = stripHtml(p.excerpt);
              return (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="blog-card group"
                >
                  <div className="blog-thumb">
                    {thumb ? (
                      <img src={thumb} alt={m?.alt_text || p.title || ""} loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <time className="text-xs font-mono text-neutral-500 mb-2">
                      {formatDate(p.post_date)}
                    </time>
                    <h2 className="text-xl font-bold tracking-tight leading-snug mb-2 line-clamp-2">
                      {stripHtml(p.title) || "Untitled"}
                    </h2>
                    {excerpt && (
                      <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{excerpt}</p>
                    )}
                    <span className="mt-auto text-sm font-semibold text-neutral-900 group-hover:translate-x-1 transition-transform inline-block">
                      Read more →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && totalPages > 1 && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <button
              className="blog-pill"
              disabled={page === 0}
              onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              ← Prev
            </button>
            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`e${i}`} className="px-3 text-neutral-400">…</span>
              ) : (
                <button
                  key={n}
                  className={`blog-pill ${n === page ? "is-active" : ""}`}
                  onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                >
                  {n + 1}
                </button>
              )
            )}
            <button
              className="blog-pill"
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
