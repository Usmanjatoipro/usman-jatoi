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
  ArrowUp,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Mail,
  Hash,
  ListTree,
  Sparkles,
  Newspaper,
  Bookmark,
  TrendingUp,
  Send,
  User as UserIcon,
  Award,
  Rss,
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
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Enhanced post template modeled after usmanjatoi.com with a rich sticky sidebar:
 * TOC · author · newsletter · share rail · related · tag cloud · back-to-top
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
  categoryArchivePath?: string | null;
  primaryCategoryChildren?: { title: string; href: string }[];
}) {
  const [rating, setRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [siblings, setSiblings] = useState<{ title: string; href: string }[]>(
    primaryCategoryChildren
  );

  const title = decodeEntities(stripHtml(post.title) || "Untitled");
  const excerpt = decodeEntities(stripHtml(post.excerpt || ""));
  const rt = useMemo(() => readingTime(post.content), [post.content]);
  const wordCount = useMemo(
    () => stripHtml(post.content || "").split(/\s+/).filter(Boolean).length,
    [post.content]
  );
  const views = useMemo(() => 100 + ((post.id * 37) % 5000), [post.id]);
  const responses = useMemo(() => (post.id * 7) % 40, [post.id]);
  const coffees = useMemo(() => Math.max(1, Math.round(rt / 5)), [rt]);

  const primaryCategory = categories[0];
  const primaryCategoryName = primaryCategory?.name || "Article";
  const archiveHref =
    categoryArchivePath ||
    (primaryCategory ? `/category/${primaryCategory.slug}` : "/blog");

  // Enrich HTML with heading anchors + extract TOC.
  const { enrichedHtml, headings, keyTakeaways } = useMemo(() => {
    const raw = post.content || "";
    const hs: Heading[] = [];
    const used = new Set<string>();
    const enriched = raw.replace(
      /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
      (_m, lvl, attrs, inner) => {
        const text = decodeEntities(stripHtml(inner));
        if (!text) return _m;
        let id = slugify(text);
        if (!id) return _m;
        let i = 2;
        while (used.has(id)) id = `${slugify(text)}-${i++}`;
        used.add(id);
        hs.push({ id, text, level: Number(lvl) as 2 | 3 });
        return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
      }
    );
    // Pull first ~4 headings as key takeaways.
    const takeaways = hs.filter((h) => h.level === 2).slice(0, 5).map((h) => h.text);
    return { enrichedHtml: enriched, headings: hs, keyTakeaways: takeaways };
  }, [post.content]);

  // Reading progress + active heading + back-to-top visibility.
  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(Math.min(100, (scrolled / Math.max(total, 1)) * 100));
      setShowTop(window.scrollY > 600);
      // Active heading
      let current = "";
      for (const h of headings) {
        const node = document.getElementById(h.id);
        if (!node) continue;
        if (node.getBoundingClientRect().top < 140) current = h.id;
      }
      if (current) setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  // Fetch a few sibling posts under the same primary category.
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

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `https://usmanjatoi.lovable.app${post.path || `/blog/${post.slug}`}`;
  const shareText = encodeURIComponent(title);
  const enc = encodeURIComponent(shareUrl);
  const shares = [
    { label: "Share on Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?text=${shareText}&url=${enc}` },
    { label: "Share on LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}` },
    { label: "Share on Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: "Share via Email", Icon: Mail, href: `mailto:?subject=${shareText}&body=${enc}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <article className="bg-white text-neutral-900 relative">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= Dark hero (silky bg + gradient overlay) ================= */}
      <PageHero
        title={title}
        eyebrow={primaryCategoryName || undefined}
        size="md"
        crumbs={[
          { label: "Home", href: "/" },
          ...(primaryCategory
            ? [{ label: primaryCategoryName!, href: archiveHref }]
            : []),
          { label: title },
        ]}
      />


      {/* ================= 70/30 body ================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 relative">
        {/* Vertical share rail (desktop only) */}
        <div className="hidden xl:flex flex-col items-center gap-2 fixed left-6 top-1/2 -translate-y-1/2 z-40">
          {shares.map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="h-10 w-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link"
            className="h-10 w-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
          </button>
        </div>

        {/* ---------- MAIN ---------- */}
        <main className="min-w-0">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-neutral-400" />
                {views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-neutral-400" />
                {formatDate(post.post_date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-neutral-400" />
                {responses === 0 ? "No Responses" : `${responses} Responses`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="h-4 w-4 text-neutral-400" />
                {wordCount.toLocaleString()} words
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookmarked((v) => !v)}
                className={`inline-flex items-center gap-2 text-sm font-medium rounded-full border px-3 py-1.5 transition ${
                  bookmarked
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                }`}
                aria-label="Bookmark"
              >
                <Bookmark className="h-4 w-4" />
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 rounded-full border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50 transition"
                aria-label="View sources"
              >
                <BookOpen className="h-4 w-4" />
                Sources
              </button>
            </div>
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

          {/* Key takeaways */}
          {keyTakeaways.length > 0 && (
            <div className="mt-8 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50/50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-900 uppercase tracking-widest mb-3">
                <Sparkles className="h-4 w-4" />
                Key Takeaways
              </div>
              <ul className="space-y-2">
                {keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-800">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-500 flex-none" />
                    <a href={`#${slugify(t)}`} className="hover:underline">{t}</a>
                  </li>
                ))}
              </ul>
            </div>
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
              <figcaption className="mt-2 text-xs text-neutral-500 text-center">
                {title}
              </figcaption>
            </figure>
          )}

          {/* Content */}
          <div
            ref={bodyRef}
            className="post-body mt-10"
            dangerouslySetInnerHTML={{ __html: enrichedHtml }}
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

          {/* Share bar (mobile / inline) */}
          <div className="mt-8 rounded-2xl border border-neutral-200 p-5 bg-neutral-50/60">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
              Share this article
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {shares.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center gap-2 text-sm rounded-full border border-neutral-200 bg-white px-3.5 py-2 hover:border-neutral-400 transition"
                >
                  <Icon className="h-4 w-4" />
                  {label.replace("Share on ", "").replace("Share via ", "")}
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 text-sm rounded-full border border-neutral-200 bg-white px-3.5 py-2 hover:border-neutral-400 transition"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>

          {/* Author bio */}
          <div className="mt-8 rounded-2xl border border-neutral-200 p-6 flex gap-5 items-start bg-white">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-lg flex-none">
              UJ
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-neutral-900">Usman Jatoi</div>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                  <Award className="h-3 w-3" /> Author
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Digital polymath — web, SEO, creative & AI. Building brands, shipping products, and writing what actually works.
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <Link to="/about-me" className="text-neutral-900 font-medium underline underline-offset-4">
                  About
                </Link>
                <Link to="/contact-me" className="inline-flex items-center gap-1 text-neutral-900 font-medium">
                  Work with me <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Comments / CTA */}
          <div className="mt-8 rounded-2xl border border-neutral-900 bg-neutral-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-lg">Enjoyed the read?</div>
              <div className="text-white/70 text-sm">
                Say hi, share your thoughts, or start a project with me.
              </div>
            </div>
            <Link
              to="/contact-me"
              className="inline-flex items-center gap-2 text-sm rounded-full bg-white text-neutral-900 px-4 py-2 font-medium hover:bg-neutral-100"
            >
              Let's talk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 sidebar-scroll">
          {/* Meta card */}
          <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-[radial-gradient(500px_300px_at_100%_0%,rgba(139,92,246,0.55),transparent),radial-gradient(400px_300px_at_0%_100%,rgba(6,182,212,0.35),transparent),#0a0a0a] border border-white/10">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-white/60">Published</dt>
                <dd className="font-medium">{formatDate(post.post_date)}</dd>
              </div>
              <div>
                <dt className="text-white/60">Updated</dt>
                <dd className="font-medium">
                  {formatDate(post.post_modified || post.post_date)}
                </dd>
              </div>
              <div>
                <dt className="text-white/60">Reading Time</dt>
                <dd className="font-medium">{rt} min · {coffees} ☕</dd>
              </div>
              <div>
                <dt className="text-white/60">Word Count</dt>
                <dd className="font-medium">{wordCount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-white/60">Categories</dt>
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

          {/* Table of contents */}
          {headings.length > 1 && (
            <nav
              aria-label="Table of contents"
              className="rounded-2xl border border-neutral-200 overflow-hidden bg-white"
            >
              <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <ListTree className="h-4 w-4 text-neutral-500" />
                On this page
              </div>
              <ul className="py-2 text-sm max-h-72 overflow-y-auto sidebar-scroll">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={`block px-5 py-1.5 border-l-2 transition ${
                        h.level === 3 ? "pl-8 text-neutral-600" : "text-neutral-800"
                      } ${
                        activeId === h.id
                          ? "border-violet-500 bg-violet-50 text-violet-900"
                          : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Newsletter */}
          <div className="rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-900 text-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Rss className="h-4 w-4" /> Newsletter
            </div>
            <div className="mt-1 text-lg font-semibold leading-tight">
              Get essays like this in your inbox.
            </div>
            <p className="text-white/60 text-xs mt-1">
              One email a week. No spam. Unsubscribe anytime.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@domain.com"
                aria-label="Email address"
                className="flex-1 rounded-full bg-white/10 border border-white/15 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-9 w-9 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Disclaimer strip */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 flex items-start gap-2">
            <Coffee className="h-4 w-4 mt-0.5 text-neutral-400 flex-none" />
            <p>
              My site is professional. Ads are just for "growth." (Which means coffee.){" "}
              <Link to={"/disclaimer" as any} className="text-neutral-900 font-medium underline">
                Read Disclaimer
              </Link>
            </p>
          </div>

          {/* Explore More Under {Category} */}
          {siblings.length > 0 && (
            <div className="rounded-2xl border border-neutral-900 overflow-hidden">
              <div className="bg-neutral-900 text-white px-5 py-3 font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Explore More Under {primaryCategoryName}
              </div>
              <ul className="divide-y divide-neutral-100 bg-white">
                {siblings.slice(0, 8).map((s, i) => (
                  <li key={s.href}>
                    <Link
                      to={s.href as any}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-neutral-800 hover:bg-neutral-50 transition"
                    >
                      <span className="text-neutral-400 font-mono text-xs w-5 flex-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-2 flex-1">{s.title}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 flex-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tag cloud (sidebar) */}
          {tags.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Related tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 20).map((t) => (
                  <Link
                    key={t.id}
                    to={"/tag/$slug" as any}
                    params={{ slug: t.slug } as any}
                    className="text-xs rounded-full border border-neutral-200 px-2.5 py-1 text-neutral-700 hover:bg-neutral-100 transition"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hire me card */}
          <div className="rounded-2xl overflow-hidden border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-900">
              <UserIcon className="h-4 w-4" /> Need something built?
            </div>
            <p className="mt-1 text-sm text-neutral-700">
              I ship websites, brands, and full digital systems — end to end.
            </p>
            <Link
              to="/contact-me"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white bg-violet-600 rounded-full px-4 py-2 hover:bg-violet-700 transition"
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center hover:bg-neutral-800 transition"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* prose styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .post-body { font-size: 17px; line-height: 1.85; color: #333; }
        .post-body p { margin: 1.1em 0; }
        .post-body h2 { font-size: 1.75em; font-weight: 700; margin: 1.8em 0 .5em; color:#111; scroll-margin-top: 120px; }
        .post-body h3 { font-size: 1.35em; font-weight: 700; margin: 1.5em 0 .4em; color:#111; scroll-margin-top: 120px; }
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
        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
      `,
        }}
      />
    </article>
  );
}
