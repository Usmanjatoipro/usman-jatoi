import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Calendar,
  MessageSquare,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  MessageCircle,
  QrCode,
  ExternalLink,
  X,
  Send,
  Github,
  Instagram,
  Rss,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import PostCover from "@/components/PostCover";
import AdSlot from "@/components/AdSlot";
import CalEmbed from "@/components/CalEmbed";
import metaBg from "@/assets/Metas_of_my_posts.webp.asset.json";
import communityBg from "@/assets/Usman_Jatoi.webp.asset.json";
import authorImg from "@/assets/Usman-Jatoi-Official.webp.asset.json";
import contactImg from "@/assets/Usman-Jatoi-Contact-Us-image.webp.asset.json";
import redsglow from "@/assets/Redsglow-Banner.jpg.asset.json";
import featuredCta from "@/assets/featured-cta.jpg.asset.json";


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

/* ------------------------- helpers ------------------------- */

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
type SourceLink = { url: string; host: string; label: string };

/* Extract external outbound links as "sources". */
function extractSources(html: string): SourceLink[] {
  if (!html) return [];
  const out: SourceLink[] = [];
  const seen = new Set<string>();
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (!/^https?:\/\//i.test(url)) continue;
    try {
      const u = new URL(url);
      if (u.hostname.includes("usmanjatoi")) continue;
      const key = u.hostname + u.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      const label = decodeEntities(stripHtml(m[2])).slice(0, 120) || u.hostname;
      out.push({ url, host: u.hostname.replace(/^www\./, ""), label });
      if (out.length >= 20) break;
    } catch {}
  }
  return out;
}

/* ------------------------- component ------------------------- */

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
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [siblings, setSiblings] = useState<{ title: string; href: string }[]>(
    primaryCategoryChildren
  );
  const [related, setRelated] = useState<
    { title: string; href: string; date: string | null; image: string | null }[]
  >([]);
  const [subcats, setSubcats] = useState<{ name: string; href: string }[]>([]);
  const [allCats, setAllCats] = useState<{ name: string; href: string }[]>([]);
  const [prevNext, setPrevNext] = useState<{
    prev: { title: string; href: string } | null;
    next: { title: string; href: string } | null;
  }>({ prev: null, next: null });

  const title = decodeEntities(stripHtml(post.title) || "Untitled");
  const excerpt = decodeEntities(stripHtml(post.excerpt || ""));
  const rt = useMemo(() => readingTime(post.content), [post.content]);
  const views = useMemo(() => 40 + ((post.id * 37) % 400), [post.id]);
  const responses = useMemo(() => (post.id * 7) % 30, [post.id]);
  const totalVotes = useMemo(() => (post.id * 3) % 15, [post.id]);

  const primaryCategory = categories[0];
  const primaryCategoryName = primaryCategory?.name || "Article";
  const archiveHref =
    categoryArchivePath ||
    (primaryCategory ? `/category/${primaryCategory.slug}` : "/blog");

  /* Enrich HTML with heading anchors + extract TOC. */
  const { enrichedHtml, headings, sources } = useMemo(() => {
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
    return {
      enrichedHtml: enriched,
      headings: hs,
      sources: extractSources(raw),
    };
  }, [post.content]);

  /* FAQ structured data — questions stay collapsed visually but indexed. */
  const faqSchema = useMemo(() => {
    const items: { q: string; a: string }[] = [];
    const re = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(enrichedHtml))) {
      const q = decodeEntities(stripHtml(m[1]));
      const a = decodeEntities(stripHtml(m[2]));
      if (q && a) items.push({ q, a });
    }
    if (!items.length) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
  }, [enrichedHtml]);



  /* Reading progress + active heading + back-to-top. */
  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(Math.min(100, (scrolled / Math.max(total, 1)) * 100));
      }
      setShowTop(window.scrollY > 600);
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

  /* Fetch data: siblings, related, subcats, all-cats, prev/next. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Subcategories under primary category
      if (primaryCategory) {
        const { data: subs } = await supabase
          .from("wp_terms")
          .select("id,name,slug,parent_id")
          .eq("parent_id", primaryCategory.id)
          .limit(12);
        if (!cancelled && subs) {
          setSubcats(
            (subs as any[]).map((s) => ({
              name: s.name,
              href: `/category/${s.slug}`,
            }))
          );
        }

        if (siblings.length === 0) {
          const { data: sib } = await supabase
            .from("wp_posts")
            .select("id,title,path,slug,post_type,featured_media_id,post_date")
            .eq("status", "publish")
            .contains("raw", { categories: [primaryCategory.id] })
            .neq("id", post.id)
            .order("post_date", { ascending: false })
            .limit(12);
          if (!cancelled && sib) {
            const list = (sib as any[]).map((r) => ({
              title: decodeEntities(stripHtml(r.title) || "Untitled"),
              href: (r.path as string) || `/blog/${r.slug}`,
            }));
            setSiblings(list);
          }
        }

        // Related posts with images (bento + explore-more)
        const { data: rel } = await supabase
          .from("wp_posts")
          .select("id,title,path,slug,featured_media_id,post_date")
          .eq("status", "publish")
          .eq("post_type", "post")
          .contains("raw", { categories: [primaryCategory.id] })
          .neq("id", post.id)
          .order("post_date", { ascending: false })
          .limit(6);
        if (!cancelled && rel) {
          const withMedia = await Promise.all(
            (rel as any[]).map(async (r) => {
              let image: string | null = null;
              if (r.featured_media_id) {
                const { data: m } = await supabase
                  .from("wp_media")
                  .select("storage_url,source_url")
                  .eq("id", r.featured_media_id)
                  .maybeSingle();
                image =
                  (m as any)?.storage_url || (m as any)?.source_url || null;
              }
              return {
                title: decodeEntities(stripHtml(r.title) || "Untitled"),
                href: (r.path as string) || `/blog/${r.slug}`,
                date: r.post_date,
                image,
              };
            })
          );
          if (!cancelled) setRelated(withMedia);
        }
      }

      // All top-level categories
      const { data: allC } = await supabase
        .from("wp_terms")
        .select("id,name,slug,parent_id,taxonomy")
        .eq("taxonomy", "category")
        .is("parent_id", null)
        .limit(32);
      if (!cancelled && allC) {
        setAllCats(
          (allC as any[])
            .filter((c) => c.name && c.name.toLowerCase() !== "uncategorized")
            .map((c) => ({ name: c.name, href: `/category/${c.slug}` }))
        );
      }

      // Prev / Next post by date
      if (post.post_date) {
        const [prevR, nextR] = await Promise.all([
          supabase
            .from("wp_posts")
            .select("title,slug,path")
            .eq("status", "publish")
            .eq("post_type", "post")
            .lt("post_date", post.post_date)
            .order("post_date", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("wp_posts")
            .select("title,slug,path")
            .eq("status", "publish")
            .eq("post_type", "post")
            .gt("post_date", post.post_date)
            .order("post_date", { ascending: true })
            .limit(1)
            .maybeSingle(),
        ]);
        if (!cancelled) {
          setPrevNext({
            prev: prevR.data
              ? {
                  title: decodeEntities(
                    stripHtml((prevR.data as any).title) || "Previous"
                  ),
                  href:
                    (prevR.data as any).path ||
                    `/blog/${(prevR.data as any).slug}`,
                }
              : null,
            next: nextR.data
              ? {
                  title: decodeEntities(
                    stripHtml((nextR.data as any).title) || "Next"
                  ),
                  href:
                    (nextR.data as any).path ||
                    `/blog/${(nextR.data as any).slug}`,
                }
              : null,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryCategory?.id, post.id]);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://usmanjatoi.lovable.app${post.path || `/blog/${post.slug}`}`;
  const shareText = encodeURIComponent(title);
  const enc = encodeURIComponent(shareUrl);
  const shares = [
    {
      label: "Facebook",
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
    },
    {
      label: "Twitter",
      Icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${enc}`,
    },
    {
      label: "LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
    },
    {
      label: "WhatsApp",
      Icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${shareText}%20${enc}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${enc}`;

  return (
    <article className="bg-neutral-50 text-neutral-900 relative">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}

      {/* Reading progress */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent"
        aria-hidden
      >
        <div
          className="h-full bg-orange-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top page hero — silky black bg with title + breadcrumb */}
      <PageHero
        title={title}
        eyebrow={primaryCategoryName || undefined}
        size="sm"
        crumbs={[
          { label: "Home", href: "/" },
          ...(primaryCategory
            ? [{ label: primaryCategoryName, href: archiveHref }]
            : [{ label: "Blog", href: "/blog" }]),
          { label: title },
        ]}
      />

      <div className="h-10" />

      {/* ================= 70/30 ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        {/* ---------- MAIN — one continuous white surface ---------- */}
        <main className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          {/* Featured image lives inside the 70% column */}
          {heroUrl && !heroFailed ? (
            <figure className="mb-8">
              <img
                src={heroUrl}
                alt={title}
                width={1200}
                height={630}
                fetchPriority="high"
                decoding="async"
                onError={() => setHeroFailed(true)}
                className="aspect-[16/9] w-full rounded-2xl object-cover bg-neutral-100"
              />
            </figure>
          ) : (
            <PostCover
              className="mb-8"
              seed={post.slug || String(post.id)}
              title={title}
              excerpt={excerpt}
              categories={categories.map((c) => c.name)}
            />
          )}

          {excerpt && (
            <p className="max-w-3xl text-lg leading-relaxed text-neutral-600">{excerpt}</p>
          )}

          {/* Meta row: views · date · responses  +  sources button */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-neutral-400" />
                Posts Views {views.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-neutral-400" />
                {formatDate(post.post_date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-neutral-400" />
                {responses === 0 ? "No Responses" : `${responses} Responses`}
              </span>
            </div>
            {sources.length > 0 && (
              <button
                type="button"
                onClick={() => setSourcesOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition px-3 py-1.5 text-sm font-medium text-neutral-800"
              >
                <span className="flex -space-x-1.5" aria-hidden>
                  {sources.slice(0, 3).map((s, i) => (
                    <img
                      key={i}
                      src={`https://www.google.com/s2/favicons?sz=32&domain=${s.host}`}
                      alt=""
                      className="h-4 w-4 rounded-full ring-2 ring-neutral-100 bg-white"
                    />
                  ))}
                </span>
                Sources ({sources.length})
              </button>
            )}
          </div>

          {/* Rating + QR row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1">
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
                        n <= rating
                          ? "fill-orange-500 text-orange-500"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {rating}/5 ({totalVotes} votes)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-2 text-sm rounded-full border border-neutral-300 px-4 py-1.5 hover:bg-neutral-50"
            >
              <QrCode className="h-4 w-4" /> Get QR Code
            </button>
          </div>

          {/* Article body */}
          <div
            ref={bodyRef}
            className="post-body mt-10"
            dangerouslySetInnerHTML={{ __html: enrichedHtml }}
          />


          {/* Featured-in-article CTA */}
          <div className="mt-10 relative overflow-hidden rounded-2xl text-white">
            <img
              src={featuredCta.url}
              alt="Get featured in this article"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/80" aria-hidden />
            <div className="relative p-6 md:p-8">
              <div className="text-lg md:text-xl font-semibold">
                Get Yourself Featured in This Article
              </div>
              <p className="mt-2 text-sm text-white/75 max-w-md">
                Want your name, brand, or service listed right here? We offer
                sponsored mentions and do-follow links starting from{" "}
                <b className="text-orange-400">$49 up to $500</b> depending on
                placement.
              </p>
              <Link
                to="/contact-me"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-orange-600"
              >
                APPLY NOW
              </Link>
            </div>
          </div>


          {/* Prev / Next */}
          {(prevNext.prev || prevNext.next) && (
            <div className="mt-8 grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 border-y border-neutral-200">
              {prevNext.prev ? (
                <Link
                  to={prevNext.prev.href as any}
                  className="flex items-center gap-3 p-5 hover:bg-neutral-50 transition group"
                >
                  <ChevronLeft className="h-5 w-5 text-neutral-400 flex-none" />
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-neutral-500">
                      Previous
                    </div>
                    <div className="text-sm font-medium text-neutral-900 truncate group-hover:underline">
                      {prevNext.prev.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {prevNext.next ? (
                <Link
                  to={prevNext.next.href as any}
                  className="flex items-center justify-end gap-3 p-5 text-right hover:bg-neutral-50 transition group"
                >
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-neutral-500">
                      Next
                    </div>
                    <div className="text-sm font-medium text-neutral-900 truncate group-hover:underline">
                      {prevNext.next.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400 flex-none" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* About Author */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">About Author</h2>
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200">
              <img
                src={communityBg.url}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-neutral-950/85" aria-hidden />
              <div className="relative">
                <div className="p-5 md:p-6 flex gap-5 items-start">
                  <img
                    src={authorImg.url}
                    alt="Usman Jatoi"
                    width={80}
                    height={80}
                    loading="lazy"
                    className="h-20 w-20 rounded-lg object-cover flex-none ring-1 ring-white/20"
                  />
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-white">
                      Usman Jatoi
                    </div>
                    <p className="text-sm text-white/80 mt-1 leading-relaxed">
                      Usman Jatoi — also known as Usman Jatoi Pro — a 19-year-old
                      creative artist, and tech innovator who began his digital
                      journey at just{" "}
                      <b className="text-orange-400">7 years old</b> and started
                      working professionally at{" "}
                      <b className="text-orange-400">12</b>.
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/15 px-6 py-3 flex items-center gap-3 text-white/60">
                  {[Instagram, Linkedin, Github, Twitter].map((Ic, i) => (
                    <a
                      key={i}
                      href="#"
                      className="h-7 w-7 flex items-center justify-center hover:text-white"
                      aria-label="social"
                    >
                      <Ic className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-semibold text-neutral-900 mb-2">
                Quick Links:
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-900">
                <Link to="/about-me" className="hover:underline">
                  About Me
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/portfolio" className="hover:underline">
                  My Portfolio
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/skills-expertise" className="hover:underline">
                  Skills &amp; Expertise
                </Link>
              </div>
            </div>
          </section>

        </main>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 sidebar-scroll">
          {/* Meta card — photo background with black overlay */}
          <div className="relative rounded-2xl p-6 text-white overflow-hidden border border-neutral-900">
            <img
              src={metaBg.url}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/80" aria-hidden />
            <dl className="relative space-y-2.5 text-sm">

              <div>
                <span className="font-semibold">Published:</span>{" "}
                <span className="text-white/85">
                  {formatDate(post.post_date)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Updated:</span>{" "}
                <span className="text-white/85">
                  {formatDate(post.post_modified || post.post_date)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Reading Time:</span>{" "}
                <span className="text-white/85">{rt} min read</span>
              </div>
              <div>
                <span className="font-semibold">Categories:</span>{" "}
                <span className="text-white/85">
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
                </span>
              </div>
            </dl>
          </div>

          {/* Ad slot */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-[13px] text-neutral-700 leading-snug">
              My site is professional. Ad is just for 'growth.' (Which means
              coffee.){" "}
              <Link
                to={"/legal/our-terms" as any}
                className="underline font-medium text-neutral-900"
              >
                Read Disclaimer
              </Link>
            </p>
            <AdSlot className="mt-3 min-h-[250px] overflow-hidden rounded-lg bg-white" />
          </div>


          {/* Explore More Under {Category} — subcategories list */}
          {subcats.length > 0 && (
            <div className="rounded-2xl border border-neutral-900 overflow-hidden">
              <div className="bg-neutral-950 text-white px-5 py-3 font-semibold text-sm">
                Explore More Under {primaryCategoryName}
              </div>
              <ul className="divide-y divide-neutral-100 bg-white">
                {subcats.slice(0, 10).map((s) => (
                  <li key={s.href}>
                    <Link
                      to={s.href as any}
                      className="flex items-center justify-between px-5 py-3 text-sm text-neutral-800 hover:bg-neutral-50 transition"
                    >
                      <span className="truncate">{s.name}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-400 flex-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of contents */}
          {headings.length > 1 && (
            <details
              open
              className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden"
            >
              <summary className="list-none px-5 py-3 flex items-center justify-between cursor-pointer text-sm font-semibold text-neutral-900">
                Table of Contents
                <ChevronDown className="h-4 w-4 text-neutral-500 group-open:rotate-180 transition" />
              </summary>
              <ul className="py-2 text-sm max-h-72 overflow-y-auto sidebar-scroll">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={`block px-5 py-1.5 border-l-2 transition ${
                        h.level === 3
                          ? "pl-9 text-neutral-600"
                          : "text-neutral-800"
                      } ${
                        activeId === h.id
                          ? "border-orange-500 bg-neutral-50 text-neutral-900 font-medium"
                          : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-neutral-300 mr-2">•</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Share this post */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-sm font-semibold text-neutral-900 mb-3">
              Share this post:
            </div>
            <div className="flex items-center gap-3">
              {shares.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${label}`}
                  className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy link"
                className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 text-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Rss className="h-4 w-4" /> Newsletter
            </div>
            <div className="mt-1 text-base font-semibold leading-tight">
              Get essays like this in your inbox.
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@domain.com"
                aria-label="Email address"
                className="flex-1 min-w-0 rounded-full bg-white/10 border border-white/15 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-9 w-9 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-100 flex-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* ================= FULL-WIDTH SECTIONS ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 space-y-16">
        {/* RedsGlow banner */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200">
          <img
            src={redsglow.url}
            alt="RedsGlow Creative Agency"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/75" aria-hidden />
          <div className="relative p-6 md:p-12 max-w-3xl">
            <p className="text-sm md:text-base text-white/85 leading-relaxed">
              From <b className="text-white">marketing to automation, technical development to
              management, creative design to operations, consulting to growth
              strategy</b> — we deliver it all under one roof. Whether you're
              launching something new, fixing what's broken, or scaling to the
              next level, our team makes it simple, fast, and effective. Trusted
              by clients worldwide for results that last.
            </p>
            <a
              href="https://redsglow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 hover:bg-orange-600"
            >
              VISIT NOW <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>


        {/* Explore My All Categories */}
        {allCats.length > 0 && (
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              Explore My All Categories
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {allCats.map((c) => (
                <Link
                  key={c.href}
                  to={c.href as any}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition"
                >
                  {c.name} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Read our More Blog Posts — bento (1 large + 2 stacked) */}
        {related.length >= 3 && (
          <section>
            <h2 className="text-center text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
              Read our More Blog Posts
            </h2>
            <div className="grid md:grid-cols-[2fr_1fr] gap-4">
              <Link
                to={related[0].href as any}
                className="relative rounded-2xl overflow-hidden aspect-[16/10] group"
                style={{
                  backgroundImage: related[0].image
                    ? `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%), url(${related[0].image})`
                    : `linear-gradient(135deg, #f5e6f5, #dae7f5)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 p-6 text-neutral-900">
                  <div className="bg-white/85 backdrop-blur rounded-xl p-4 md:p-5">
                    <h3 className="text-lg md:text-xl font-semibold leading-snug group-hover:underline">
                      {related[0].title}
                    </h3>
                  </div>
                </div>
              </Link>
              <div className="grid grid-rows-2 gap-4">
                {related.slice(1, 3).map((r) => (
                  <Link
                    key={r.href}
                    to={r.href as any}
                    className="relative rounded-2xl overflow-hidden group"
                    style={{
                      backgroundImage: r.image
                        ? `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%), url(${r.image})`
                        : `linear-gradient(135deg, #0a0a0a, #262626)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: 180,
                    }}
                  >
                    <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                      <div className="text-[11px] tracking-widest uppercase text-white/70">
                        {r.date
                          ? new Date(r.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </div>
                      <div className="text-base md:text-lg font-semibold leading-snug group-hover:underline">
                        {r.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Book a call — Cal.com inline */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">
            Book a Call with Me to Discuss Your Project in Detail
          </h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto text-center">
            Free 30-minute strategy call. Bring your idea, brief, or the mess
            you want fixed — leave with a plan.
          </p>
          <CalEmbed className="mt-8 rounded-2xl overflow-hidden" />
        </section>


        {/* Explore More — 3 more posts */}
        {related.length > 3 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Explore More
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.slice(3, 6).map((r) => (
                <Link
                  key={r.href}
                  to={r.href as any}
                  className="group block"
                >
                  <div
                    className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950"
                    style={{
                      backgroundImage: r.image
                        ? `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.85)), url(${r.image})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                      <div className="text-sm font-semibold line-clamp-2">
                        {r.title}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-[11px] uppercase tracking-widest text-neutral-500">
                      {primaryCategoryName}
                    </div>
                    <div className="mt-1 text-base font-semibold text-neutral-900 group-hover:underline line-clamp-2">
                      {r.title}
                    </div>
                    {r.date && (
                      <div className="mt-2 text-xs text-neutral-500">
                        {formatDate(r.date)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA — split form / gradient image */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-950 text-white overflow-hidden grid md:grid-cols-2">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-6 md:p-8 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Message"
                className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-white/70 uppercase mb-1.5">
                Subject
              </label>
              <select className="w-full rounded-md bg-white text-neutral-900 px-3 py-2.5 text-sm focus:outline-none">
                <option>Affiliate</option>
                <option>Project</option>
                <option>Partnership</option>
                <option>Feedback</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold tracking-widest py-3 text-sm transition"
            >
              SEND
            </button>
            <p className="text-center text-xs text-white/60">
              Prefer email? contact@usmanjatoi.com
            </p>
          </form>
          <div className="relative hidden md:flex items-end p-8">
            <img
              src={contactImg.url}
              alt="Usman Jatoi — get in touch"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/65" aria-hidden />
            <div className="relative">
              <p className="text-white/85 text-sm leading-relaxed max-w-sm">
                I believe in collaborating with smart, diverse, and creative
                people — and giving them the freedom to shine. Let's connect.
              </p>
              <div className="mt-4 text-lg font-semibold">Usman Jatoi</div>
              <div className="text-orange-400 text-sm">
                Versatile Creative Artist
              </div>
            </div>
          </div>

        </section>

        <div className="h-8" />
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

      {/* ============== Sources drawer ============== */}
      {sourcesOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={() => setSourcesOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <div className="text-lg font-semibold">Sources</div>
                <div className="text-xs text-neutral-500">
                  {sources.length} external references
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSourcesOpen(false)}
                aria-label="Close"
                className="h-9 w-9 rounded-full hover:bg-neutral-100 flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-start gap-3 px-5 py-4 hover:bg-neutral-50"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${s.host}`}
                      alt=""
                      className="h-8 w-8 rounded-md bg-neutral-100 flex-none mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-neutral-900 truncate">
                        {s.label}
                      </div>
                      <div className="text-xs text-neutral-500 truncate">
                        {s.host}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-neutral-400 flex-none mt-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ============== QR Modal ============== */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQrOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQrOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-neutral-100 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-lg font-semibold text-neutral-900 mb-2">
              Scan to read on your phone
            </div>
            <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
              {title}
            </p>
            <img
              src={qrSrc}
              alt="QR code"
              className="mx-auto rounded-lg border border-neutral-200"
              width={280}
              height={280}
            />
            <button
              type="button"
              onClick={copyLink}
              className="mt-4 inline-flex items-center gap-2 text-sm rounded-full border border-neutral-300 px-4 py-1.5 hover:bg-neutral-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" /> Copy link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============== prose styles + rich content enhancers ============== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .post-body { font-size: 17px; line-height: 1.85; color: #333; }
        .post-body p { margin: 1.1em 0; }
        .post-body h2 { font-size: 1.85em; font-weight: 700; margin: 1.9em 0 .6em; color:#111; scroll-margin-top: 120px; letter-spacing:-0.01em; }
        .post-body h3 { font-size: 1.35em; font-weight: 700; margin: 1.5em 0 .4em; color:#111; scroll-margin-top: 120px; }
        .post-body h4 { font-size: 1.1em; font-weight: 700; margin: 1.3em 0 .3em; color:#111; }
        .post-body a { color:#111; text-decoration: underline; text-decoration-color:#f97316; text-underline-offset: 3px; }
        .post-body img, .post-body figure img { max-width: 100%; height: auto; border-radius: 14px; margin: 1.5em auto; display:block; }
        .post-body ul, .post-body ol { padding-left: 1.5em; margin: 1em 0; }
        .post-body ul { list-style: disc; } .post-body ol { list-style: decimal; }
        .post-body li { margin: .35em 0; }
        .post-body blockquote {
          border-left: 3px solid #f97316;
          padding: 1em 1.25em; margin: 1.5em 0;
          font-style: italic; color:#333;
          background: #fafafa;
          border-radius: 0 12px 12px 0;
        }

        .post-body pre { background:#0b0b12; color:#e2e8f0; padding:1em; border-radius:12px; overflow-x:auto; font-size:.9em; }
        .post-body code { background:#f3f4f6; padding: .15em .4em; border-radius: 4px; font-size:.9em; color:#111; }
        .post-body pre code { background: transparent; padding: 0; color:inherit; }
        .post-body table { width:100%; border-collapse: collapse; margin: 1.5em 0; font-size:.95em; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #e5e7eb; }
        .post-body th, .post-body td { border-bottom: 1px solid #e5e7eb; padding: .8em 1em; text-align:left; }
        .post-body th { background:#f9fafb; font-weight:600; color:#111; }
        .post-body tr:last-child td { border-bottom: none; }
        .post-body iframe, .post-body video { max-width: 100%; border-radius: 14px; margin: 1.5em 0; }
        .post-body .migrated-field {
          margin: 2.2em 0;
          border: 0;
          border-top: 1px solid #ececec;
          border-radius: 0;
          background: transparent;
          padding: 1.6em 0 0;
          box-shadow: none;
        }
        .post-body .migrated-field:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
        .post-body .migrated-field > h2 {
          margin-top: 0;
          font-size: clamp(22px, 2.4vw, 32px);
          line-height: 1.12;
        }

        .post-body .migrated-grid,
        .post-body .migrated-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin: 1.4em 0;
        }
        .post-body .migrated-grid article,
        .post-body .migrated-steps article {
          position: relative;
          border: 1px solid #ececec;
          border-radius: 16px;
          background: #fff;
          padding: 20px 18px 18px;
          transition: box-shadow .2s, transform .2s;
        }
        .post-body .migrated-grid article:hover,
        .post-body .migrated-steps article:hover {
          box-shadow: 0 12px 30px rgba(15,23,42,.08);
          transform: translateY(-2px);
        }
        .post-body .migrated-steps article { border-top: 3px solid #f97316; }
        .post-body .migrated-grid article h3,
        .post-body .migrated-steps article h3 {
          margin: 0 0 8px;
          font-size: 1.05em;
          letter-spacing: -.01em;
        }
        .post-body .migrated-grid article p,
        .post-body .migrated-steps article p { margin: 0; font-size: .95em; color:#525252; }
        .post-body .migrated-steps article span {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          margin-bottom: 12px;
          border-radius: 999px;
          background: #0a0a0a;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }
        /* Checklist items */
        .post-body [data-field="checklist"] ul { list-style: none; padding: 0; display: grid; gap: 10px; }
        .post-body [data-field="checklist"] li {
          position: relative;
          border: 1px solid #ececec;
          border-radius: 12px;
          background: #fafafa;
          padding: 12px 14px 12px 42px;
          margin: 0;
        }
        .post-body [data-field="checklist"] li::before {
          content: "✓";
          position: absolute; left: 13px; top: 12px;
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 6px;
          background: #f97316; color: #fff; font-size: 12px; font-weight: 700;
        }
        .post-body [data-field="checklist"] li p { margin: 4px 0 0; color:#525252; font-size:.94em; }
        .post-body .migrated-table { overflow-x: auto; }

        /* FAQ — collapsed by default */
        .post-body .migrated-faqs { display: grid; gap: 10px; margin: 1.2em 0; }
        .post-body details {
          border: 1px solid #ececec; border-radius: 14px;
          background: #fff; padding: 14px 16px; margin: 0;
        }
        .post-body details[open] { background: #fafafa; }
        .post-body details summary {
          cursor: pointer; font-weight: 650; font-size: 1em;
          color: #111; list-style: none; display: flex; gap: 12px;
          justify-content: space-between; align-items: center;
        }
        .post-body details summary::-webkit-details-marker { display: none; }
        .post-body details summary::after {
          content: "+"; color: #f97316; font-weight: 700; font-size: 1.2em;
          transition: transform .2s; line-height: 1;
        }
        .post-body details[open] summary::after { transform: rotate(45deg); }
        .post-body details > p { margin: .8em 0 0; color: #525252; font-size: .96em; }


        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
      `,
        }}
      />
    </article>
  );
}
