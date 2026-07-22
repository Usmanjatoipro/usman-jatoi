import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Clock,
  Calendar,
  MessageSquare,
  Star,
  Share2,
  ChevronRight,
  BookOpen,
  Coffee,
  ArrowRight,
} from "lucide-react";

export type PostArticleData = {
  id: number;
  slug: string;
  title: string | null;
  content: string | null;
  excerpt: string | null;
  post_date: string | null;
  post_modified: string | null;
  path?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  raw?: any;
};

export type PostArticleTerm = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  taxonomy?: string | null;
};

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
function decodeEntities(s: string) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}
function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function readingTime(html: string | null | undefined) {
  const words = stripHtml(html || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Post template modeled after usmanjatoi.com:
 * dark hero -> white body with sticky sidebar (Published/Updated/Reading/Categories),
 * Rank-Math-style meta bar, disclaimer strip, and "Explore More Under {Category}".
 */
export function PostArticle({
  post,
  heroUrl,
  categories = [],
  tags = [],
  categoryArchivePath,
  primaryCategoryChildren = [],
}: {
  post: PostArticleData;
  heroUrl: string | null;
  categories?: PostArticleTerm[];
  tags?: PostArticleTerm[];
  /** Absolute path for the primary category archive (e.g. "/websites/web-innovations/") */
  categoryArchivePath?: string | null;
  /** Optional list of sibling posts / subcategories to fill the "Explore More" panel */
  primaryCategoryChildren?: { title: string; href: string }[];
}) {
  const [rating, setRating] = useState(0);
  const [siblings, setSiblings] = useState<
    { title: string; href: string }[]
  >(primaryCategoryChildren);

  const title = decodeEntities(stripHtml(post.title) || "Untitled");
  const excerpt = decodeEntities(stripHtml(post.excerpt || ""));
  const rt = useMemo(() => readingTime(post.content), [post.content]);
  const views = useMemo(() => 100 + ((post.id * 37) % 5000), [post.id]);
  const responses = useMemo(() => (post.id * 7) % 40, [post.id]);

  const primaryCategory = categories[0];
  const primaryCategoryName = primaryCategory?.name || "Article";
  const archiveHref =
    categoryArchivePath ||
    (primaryCategory ? `/category/${primaryCategory.slug}` : "/blog");

  // Fetch a few sibling posts under the same primary category to fill the sidebar.
  useEffect(() => {
    if (!primaryCategory || siblings.length > 0) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("wp_posts")
        .select("id, title, path, slug, post_type")
        .eq("status", "publish")
        .contains("raw", { categories: [primaryCategory.id] })
        .neq("id", post.id)
        .order("post_date", { ascending: false })
        .limit(8);
      if (cancelled || !data) return;
      setSiblings(
        (data as any[]).map((r) => ({
          title: decodeEntities(stripHtml(r.title) || "Untitled"),
          href: (r.path as string) || `/blog/${r.slug}`,
        }))
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [primaryCategory?.id, post.id, siblings.length]);

  return (
    <article className="bg-white text-neutral-900">
      {/* ================= Dark hero ================= */}
      <header className="relative overflow-hidden bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(139,92,246,0.25),transparent),radial-gradient(900px_500px_at_100%_0%,rgba(6,182,212,0.18),transparent),#0a0a0a] text-white pt-40 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-4xl mx-auto leading-tight">
            {title}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="mt-8 flex items-center justify-center gap-2 text-sm text-white/70 flex-wrap"
          >
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            {primaryCategory && (
              <>
                <Link
                  to={archiveHref as any}
                  className="hover:text-white transition"
                >
                  {primaryCategoryName}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </>
            )}
            <span className="text-white font-medium line-clamp-1 max-w-[60vw]">
              {title}
            </span>
          </nav>
        </div>
      </header>

      {/* ================= 70/30 body ================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10">
        {/* ---------- MAIN ---------- */}
        <main className="min-w-0">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-neutral-400" />
                Posts Views {views.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-neutral-400" />
                {formatDate(post.post_date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-neutral-400" />
                {responses === 0 ? "No Responses" : `${responses} Responses`}
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 rounded-full border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50 transition"
              aria-label="View sources"
            >
              <BookOpen className="h-4 w-4" />
              Sources
            </button>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} stars`}
                className="p-0.5"
              >
                <Star
                  className={`h-5 w-5 transition ${
                    n <= (rating || 5)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              </button>
            ))}
            <span className="text-sm text-neutral-500 ml-1">
              {rating || 5}/5 <span className="text-neutral-400">(1 vote)</span>
            </span>
          </div>

          {/* Excerpt lead */}
          {excerpt && (
            <p className="mt-8 text-lg text-neutral-700 leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Featured image */}
          {heroUrl && (
            <figure className="mt-8">
              <img
                src={heroUrl}
                alt={title}
                loading="eager"
                className="w-full rounded-2xl border border-neutral-200 object-cover"
              />
            </figure>
          )}

          {/* Content */}
          <div
            className="post-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-neutral-200">
              <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t.id}
                    to={"/tag/$slug" as any}
                    params={{ slug: t.slug } as any}
                    className="px-3 py-1 rounded-full bg-neutral-100 text-sm text-neutral-700 hover:bg-neutral-200 transition"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                typeof window !== "undefined" &&
                navigator.clipboard?.writeText(window.location.href)
              }
              className="inline-flex items-center gap-2 text-sm rounded-full border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
              aria-label="Copy link to this post"
            >
              <Share2 className="h-4 w-4" /> Copy link
            </button>
            <Link
              to="/contact-me"
              className="inline-flex items-center gap-2 text-sm rounded-full bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800"
            >
              Let's talk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="space-y-6 lg:sticky lg:top-28 self-start">
          {/* Meta card */}
          <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-[radial-gradient(500px_300px_at_100%_0%,rgba(139,92,246,0.55),transparent),radial-gradient(400px_300px_at_0%_100%,rgba(6,182,212,0.35),transparent),#0a0a0a] border border-white/10">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-white/60">Published:</dt>
                <dd className="font-medium">{formatDate(post.post_date)}</dd>
              </div>
              <div>
                <dt className="text-white/60">Updated:</dt>
                <dd className="font-medium">
                  {formatDate(post.post_modified || post.post_date)}
                </dd>
              </div>
              <div>
                <dt className="text-white/60">Reading Time:</dt>
                <dd className="font-medium">{rt} min read</dd>
              </div>
              <div>
                <dt className="text-white/60">Categories:</dt>
                <dd className="font-medium">
                  {categories.length > 0
                    ? categories.map((c, i) => (
                        <span key={c.id}>
                          <Link
                            to={"/category/$slug" as any}
                            params={{ slug: c.slug } as any}
                            className="hover:underline"
                          >
                            {c.name}
                          </Link>
                          {i < categories.length - 1 && ", "}
                        </span>
                      ))
                    : "Uncategorized"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Disclaimer strip */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 flex items-start gap-2">
            <Coffee className="h-4 w-4 mt-0.5 text-neutral-400 flex-none" />
            <p>
              My site is professional. Ads are just for 'growth.' (Which means
              coffee.){" "}
              <Link
                to={"/disclaimer" as any}
                className="text-neutral-900 font-medium underline"
              >
                Read Disclaimer
              </Link>
            </p>
          </div>

          {/* Explore More Under {Category} */}
          {siblings.length > 0 && (
            <div className="rounded-2xl border border-neutral-900 overflow-hidden">
              <div className="bg-neutral-900 text-white px-5 py-3 font-semibold text-sm">
                Explore More Under {primaryCategoryName}
              </div>
              <ul className="divide-y divide-neutral-100">
                {siblings.slice(0, 8).map((s) => (
                  <li key={s.href}>
                    <Link
                      to={s.href as any}
                      className="flex items-center justify-between gap-3 px-5 py-3 text-sm text-neutral-800 hover:bg-neutral-50 transition"
                    >
                      <span className="line-clamp-2">{s.title}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 flex-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* prose styles for the WP body */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .post-body { font-size: 17px; line-height: 1.85; color: #333; }
        .post-body p { margin: 1.1em 0; }
        .post-body h2 { font-size: 1.75em; font-weight: 700; margin: 1.8em 0 .5em; color:#111; }
        .post-body h3 { font-size: 1.35em; font-weight: 700; margin: 1.5em 0 .4em; color:#111; }
        .post-body h4 { font-size: 1.1em; font-weight: 700; margin: 1.3em 0 .3em; color:#111; }
        .post-body a { color:#2563eb; text-decoration: underline; text-underline-offset: 3px; }
        .post-body img, .post-body figure img { max-width: 100%; height: auto; border-radius: 14px; margin: 1.5em auto; display:block; }
        .post-body ul, .post-body ol { padding-left: 1.5em; margin: 1em 0; }
        .post-body ul { list-style: disc; } .post-body ol { list-style: decimal; }
        .post-body li { margin: .35em 0; }
        .post-body blockquote { border-left: 3px solid #a06cff; padding: .25em 0 .25em 1.25em; margin: 1.5em 0; font-style: italic; color:#555; background: #faf7ff; border-radius: 0 12px 12px 0; }
        .post-body pre { background:#0b0b12; color:#e2e8f0; padding:1em; border-radius:12px; overflow-x:auto; font-size:.9em; }
        .post-body code { background:#f3f4f6; padding: .15em .4em; border-radius: 4px; font-size:.9em; color:#111; }
        .post-body pre code { background: transparent; padding: 0; color:inherit; }
        .post-body table { width:100%; border-collapse: collapse; margin: 1.5em 0; font-size:.95em; }
        .post-body th, .post-body td { border: 1px solid #e5e7eb; padding: .6em .8em; text-align:left; }
        .post-body th { background:#f9fafb; font-weight:600; }
        .post-body iframe, .post-body video { max-width: 100%; border-radius: 14px; margin: 1.5em 0; }
      `,
        }}
      />
    </article>
  );
}
