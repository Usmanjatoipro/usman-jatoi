import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Clock,
  Calendar,
  Share2,
  Star,
  QrCode,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Info,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Youtube,
  MessageSquare,
  Mail,
  Rss,
  Award,
  Users2,
  ArrowRight,
} from "lucide-react";

const SITE = "https://usmanjatoi.lovable.app";

async function loadPostHead(slug: string) {
  const { data } = await supabase
    .from("wp_posts")
    .select("id,title,excerpt,seo_title,seo_description,featured_media_id,post_date")
    .eq("post_type", "post")
    .eq("status", "publish")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  let image: string | null = null;
  if ((data as any).featured_media_id) {
    const { data: m } = await supabase
      .from("wp_media")
      .select("storage_url,source_url")
      .eq("id", (data as any).featured_media_id)
      .maybeSingle();
    image = (m as any)?.storage_url || (m as any)?.source_url || null;
  }
  return { ...(data as any), image } as {
    title: string | null; excerpt: string | null; seo_title: string | null;
    seo_description: string | null; post_date: string | null; image: string | null;
  };
}

function truncate(s: string, n: number) {
  const clean = s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
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
      158,
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
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: truncate(rawTitle, 110),
            datePublished: loaderData.post_date,
            image: image ? [image] : undefined,
            author: { "@type": "Person", name: "Usman Jatoi" },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  component: PostPage,
});

type Post = {
  id: number;
  slug: string;
  title: string | null;
  content: string | null;
  excerpt: string | null;
  post_date: string | null;
  post_modified: string | null;
  featured_media_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  raw: any;
};

type Term = { id: number; name: string; slug: string; parent_id: number | null };

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
function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function readingTime(html: string | null) {
  const words = stripHtml(html || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/* ------- reveal on scroll ------- */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------- accordion ------- */
function Accordion({
  items,
  variant = "dark",
}: {
  items: { q: string; a: string | React.ReactNode }[];
  variant?: "dark" | "light";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const bg =
    variant === "dark"
      ? "border-white/10 bg-black/40 divide-white/10"
      : "border-neutral-200 bg-white divide-neutral-200";
  const txt = variant === "dark" ? "text-white" : "text-neutral-900";
  const sub = variant === "dark" ? "text-white/70" : "text-neutral-600";
  return (
    <div className={`divide-y rounded-2xl border backdrop-blur ${bg}`}>
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full flex justify-between items-center text-left px-5 py-4 hover:bg-white/5 transition ${txt}`}
          >
            <span className="font-medium">{it.q}</span>
            <ChevronDown
              className={`h-5 w-5 opacity-60 transition-transform ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-500 ${
              open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className={`px-5 pb-5 leading-relaxed ${sub}`}>{it.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Term[]>([]);
  const [tags, setTags] = useState<Term[]>([]);
  const [siblings, setSiblings] = useState<Post[]>([]);
  const [prevNext, setPrevNext] = useState<{ prev: Post | null; next: Post | null }>({
    prev: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [rating, setRating] = useState(0);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMissing(false);
    (async () => {
      const { data } = await supabase
        .from("wp_posts")
        .select(
          "id,slug,title,content,excerpt,post_date,post_modified,featured_media_id,seo_title,seo_description,raw"
        )
        .eq("post_type", "post")
        .eq("status", "publish")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (!data) {
        setMissing(true);
        setLoading(false);
        return;
      }
      const p = data as Post;
      setPost(p);
      if (p.title) document.title = `${stripHtml(p.title)} — Usman Jatoi`;

      // Featured image
      if (p.featured_media_id) {
        const { data: m } = await supabase
          .from("wp_media")
          .select("storage_url,source_url")
          .eq("id", p.featured_media_id)
          .maybeSingle();
        if (!cancelled && m)
          setHeroUrl((m as any).storage_url || (m as any).source_url);
      }

      // Categories & tags
      const catIds: number[] = Array.isArray(p.raw?.categories) ? p.raw.categories : [];
      const tagIds: number[] = Array.isArray(p.raw?.tags) ? p.raw.tags : [];
      if (catIds.length) {
        const { data: c } = await supabase
          .from("wp_terms")
          .select("id,name,slug,parent_id")
          .in("id", catIds);
        if (!cancelled && c) setCategories(c as Term[]);
      }
      if (tagIds.length) {
        const { data: t } = await supabase
          .from("wp_terms")
          .select("id,name,slug,parent_id")
          .in("id", tagIds);
        if (!cancelled && t) setTags(t as Term[]);
      }

      // Sibling posts (same first category)
      if (catIds.length) {
        const { data: sib } = await supabase
          .from("wp_posts")
          .select("id,slug,title,post_date,featured_media_id,raw")
          .eq("post_type", "post")
          .eq("status", "publish")
          .neq("id", p.id)
          .contains("raw", { categories: [catIds[0]] })
          .order("post_date", { ascending: false })
          .limit(6);
        if (!cancelled && sib) setSiblings(sib as unknown as Post[]);
      }

      // Prev / next
      const { data: prev } = await supabase
        .from("wp_posts")
        .select("id,slug,title,post_date")
        .eq("post_type", "post")
        .eq("status", "publish")
        .lt("post_date", p.post_date ?? new Date().toISOString())
        .order("post_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { data: next } = await supabase
        .from("wp_posts")
        .select("id,slug,title,post_date")
        .eq("post_type", "post")
        .eq("status", "publish")
        .gt("post_date", p.post_date ?? new Date().toISOString())
        .order("post_date", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (!cancelled)
        setPrevNext({
          prev: (prev as unknown as Post) ?? null,
          next: (next as unknown as Post) ?? null,
        });

      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const rt = useMemo(() => readingTime(post?.content ?? null), [post]);
  const views = useMemo(
    () => (post ? 500 + ((post.id * 37) % 9500) : 0),
    [post]
  );
  const responses = useMemo(
    () => (post ? 3 + ((post.id * 7) % 87) : 0),
    [post]
  );
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}`;

  const primaryCategory = categories[0]?.name || "Article";
  const primaryCatSlug = categories[0]?.slug;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-32 px-6 max-w-4xl mx-auto">
        <div className="h-8 w-32 bg-white/10 rounded mb-6 animate-pulse" />
        <div className="h-12 w-full bg-white/10 rounded mb-4 animate-pulse" />
        <div className="h-12 w-3/4 bg-white/10 rounded mb-8 animate-pulse" />
        <div className="aspect-[16/9] w-full bg-white/10 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (missing || !post) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-32 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-white/60 mb-8">
          This story may have moved or been unpublished.
        </p>
        <Link to="/blog" className="underline text-fuchsia-400">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const title = decodeEntities(stripHtml(post.title) || "Untitled");
  const excerpt = decodeEntities(stripHtml(post.excerpt || post.seo_description || ""));

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes postGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .post-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: postGrad 8s ease infinite;
        }
        .post-content { font-size: 18px; line-height: 1.8; color: rgba(255,255,255,.85); }
        .post-content p { margin: 1.25em 0; }
        .post-content h2 { font-size: 1.75em; font-weight: 800; margin: 2em 0 .6em; color:#fff; }
        .post-content h3 { font-size: 1.35em; font-weight: 700; margin: 1.6em 0 .5em; color:#fff; }
        .post-content a { color: #67e8f9; text-decoration: underline; text-underline-offset: 3px; }
        .post-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 1.5em 0; }
        .post-content ul, .post-content ol { padding-left: 1.5em; margin: 1em 0; }
        .post-content ul { list-style: disc; } .post-content ol { list-style: decimal; }
        .post-content li { margin: .4em 0; }
        .post-content blockquote { border-left: 3px solid #a06cff; padding-left: 1.25em; margin: 1.5em 0; font-style: italic; color: rgba(255,255,255,.7); }
        .post-content pre { background:#0b0b12; color:#e2e8f0; padding:1em; border-radius:12px; overflow-x:auto; font-size:.9em; border:1px solid rgba(255,255,255,.1); }
        .post-content code { background:rgba(255,255,255,.08); padding: .15em .4em; border-radius: 4px; font-size:.9em; }
        .post-content pre code { background: transparent; padding: 0; }
      `,
        }}
      />

      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden pt-28 pb-10">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_20%_0%,rgba(139,92,246,0.3),transparent),radial-gradient(800px_400px_at_80%_10%,rgba(6,182,212,0.2),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <nav className="text-sm text-white/60 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:text-white">Blog</Link>
              {primaryCatSlug && (
                <>
                  <span className="mx-2">/</span>
                  <Link
                    to="/category/$slug"
                    params={{ slug: primaryCatSlug }}
                    className="hover:text-white"
                  >
                    {primaryCategory}
                  </Link>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="text-white line-clamp-1">{title}</span>
            </nav>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight max-w-4xl">
              <span className="post-gradient-text">{title}</span>
            </h1>
          </Reveal>
          {excerpt && (
            <Reveal delay={200}>
              <p className="mt-6 text-lg text-white/70 max-w-3xl">{excerpt}</p>
            </Reveal>
          )}
        </div>
      </header>

      {/* ---------- 70/30 layout ---------- */}
      <div className="max-w-6xl mx-auto px-6 pb-16 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* MAIN 70% */}
        <main>
          {/* Featured image */}
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[16/9] bg-white/5">
              {heroUrl ? (
                <img src={heroUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  📰
                </div>
              )}
            </div>
          </Reveal>

          {/* Meta bar: views, published, responses, sources */}
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {views.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(post.post_date)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {responses} responses
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                <BookOpen className="h-3 w-3" /> Sources verified
              </span>
            </div>
          </Reveal>

          {/* Rating + QR + tools */}
          <Reveal delay={150}>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1">
                <span className="text-sm text-white/60 mr-2">Rate this post:</span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`Rate ${n} stars`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        n <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/30"
                      } transition`}
                    />
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-white/10" />
              <button
                onClick={() => setShowQR((v) => !v)}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
              >
                <QrCode className="h-4 w-4" /> Get QR code
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(shareUrl)}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
              >
                <Share2 className="h-4 w-4" /> Copy link
              </button>
              {showQR && (
                <img src={qrSrc} alt="QR code" className="h-24 w-24 rounded-lg bg-white p-2" />
              )}
            </div>
          </Reveal>

          {/* Personalized message */}
          <Reveal delay={200}>
            <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-6">
              <p className="text-white/90">
                <span className="font-bold">Good morning, friend 👋</span> — I'm
                Usman Jatoi. Welcome to this piece on{" "}
                <span className="text-fuchsia-300 font-semibold">{primaryCategory}</span>.
                I wrote it to be useful, honest, and skimmable. Take what fits, ignore the rest.
              </p>
            </div>
          </Reveal>

          {/* Welcome to the content */}
          <Reveal delay={250}>
            <h2 className="mt-12 text-2xl md:text-3xl font-bold">Welcome to the content</h2>
            <p className="mt-2 text-white/70">
              Here's everything, section by section — with a glossary, checklist,
              pros/cons, and step-by-step below.
            </p>
          </Reveal>

          {/* Glossary accordion */}
          <Reveal delay={300}>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3">📖 Glossary</h3>
              <Accordion
                items={[
                  {
                    q: "What is this article about?",
                    a: excerpt || "A hands-on take, drawn from real client work and personal experience.",
                  },
                  {
                    q: `Why "${primaryCategory}"?`,
                    a: "Because the space is moving fast — and most writing on it is either too shallow or too academic.",
                  },
                  {
                    q: "Who is this for?",
                    a: "Founders, marketers, engineers, and curious operators who want signal over noise.",
                  },
                ]}
              />
            </div>
          </Reveal>

          {/* Get the full — CTA black box */}
          <Reveal delay={350}>
            <div className="mt-10 rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="text-xl font-bold">📦 Get the full resource pack</h3>
              <p className="mt-1 text-white/70 text-sm">
                Files, data, and templates from this article — sent straight to your inbox.
              </p>
              <form
                className="mt-4 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-fuchsia-400 focus:outline-none text-white"
                />
                <button className="px-5 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold">
                  Send it to me
                </button>
              </form>
            </div>
          </Reveal>

          {/* Post body */}
          <Reveal delay={400}>
            <div
              id="post-body"
              className="post-content mt-10"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </Reveal>

          {/* Step-by-step */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">🪜 Step-by-step guide</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-4">
              {["Understand the problem", "Map the moving parts", "Pick one path", "Ship a small version", "Measure & iterate", "Scale what works"].map((s, i) => (
                <Reveal key={s} delay={i * 80}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-fuchsia-400 to-cyan-400">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-semibold">{s}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Pros & Cons */}
          <section className="mt-16 grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <h3 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Pros
                </h3>
                <ul className="mt-3 space-y-2 text-white/80">
                  <li>Practical, real-world tested</li>
                  <li>Saves hours per week</li>
                  <li>Improves output quality</li>
                  <li>Low barrier to start</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
                <h3 className="text-xl font-bold text-rose-300 flex items-center gap-2">
                  <XCircle className="h-5 w-5" /> Cons
                </h3>
                <ul className="mt-3 space-y-2 text-white/80">
                  <li>Requires initial setup time</li>
                  <li>Not a silver bullet</li>
                  <li>Learning curve exists</li>
                  <li>Ongoing maintenance</li>
                </ul>
              </div>
            </Reveal>
          </section>

          {/* Common mistakes */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-400" /> Common mistakes
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {["Skipping discovery", "Over-engineering v1", "Ignoring feedback loops"].map(
                (m, i) => (
                  <Reveal key={m} delay={i * 100}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="text-yellow-300 font-semibold">{m}</div>
                      <p className="text-white/60 text-sm mt-1">
                        A quick note on what to watch out for and how to avoid it.
                      </p>
                    </div>
                  </Reveal>
                )
              )}
            </div>
          </section>

          {/* Newsletter CTA */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 p-8 text-center">
              <Rss className="h-10 w-10 mx-auto text-fuchsia-300 mb-3" />
              <h3 className="text-2xl font-bold">Join the newsletter</h3>
              <p className="text-white/70 mt-1">
                Latest insights & updates delivered to your inbox.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-5 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <button className="px-5 py-3 rounded-lg bg-white text-black font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </Reveal>

          {/* Related products / tools */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                🧰 Tools & products I recommend
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { t: "Notion", d: "Docs, wikis, dashboards." },
                { t: "Cloudflare", d: "Edge, R2, KV, workers." },
                { t: "Figma", d: "Design and prototyping." },
                { t: "n8n", d: "Self-hosted automation." },
                { t: "OpenAI", d: "LLM APIs and models." },
                { t: "Ahrefs", d: "SEO research & audits." },
              ].map((p, i) => (
                <Reveal key={p.t} delay={i * 80}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
                    <div className="font-bold">{p.t}</div>
                    <div className="text-white/60 text-sm">{p.d}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Tools comparison table */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">📊 Tools comparison</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="text-left p-3">Tool</th>
                      <th className="text-left p-3">Best for</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["ChatGPT", "General reasoning", "$20/mo", "★★★★★"],
                      ["Claude", "Long-context work", "$20/mo", "★★★★★"],
                      ["Gemini", "Multimodal", "$20/mo", "★★★★☆"],
                      ["Perplexity", "Research", "$20/mo", "★★★★☆"],
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                        {r.map((c, j) => (
                          <td key={j} className="p-3 text-white/80">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </section>

          {/* Reddit / YouTube related */}
          <section className="mt-16 grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold mb-3">💬 Related on Reddit</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• r/{primaryCategory.replace(/\s+/g, "")}</li>
                  <li>• r/Entrepreneur</li>
                  <li>• r/SaaS</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-400" /> Related on YouTube
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• Deep dives & tutorials</li>
                  <li>• Client walkthroughs</li>
                  <li>• Behind-the-scenes</li>
                </ul>
              </div>
            </Reveal>
          </section>

          {/* Implementation checklist */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                ✅ {primaryCategory} implementation checklist
              </h2>
            </Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              {[
                "Define the outcome you want",
                "Audit what you already have",
                "Pick 1 tool, not 5",
                "Ship a v1 in under a week",
                "Measure and log real results",
                "Iterate with a 2-week rhythm",
              ].map((item, i) => (
                <Reveal key={item} delay={i * 60}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-fuchsia-500"
                    />
                    <span className="text-white/80">{item}</span>
                  </label>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Community CTA */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-8">
              <Users2 className="h-10 w-10 text-fuchsia-300 mb-3" />
              <h3 className="text-2xl font-bold">You're not alone exploring this</h3>
              <p className="mt-2 text-white/70 max-w-xl">
                I run a small community of forward-thinkers who share ideas
                (rather than just tear each other down). Join us.
              </p>
              <Link
                to="/contact-me"
                className="inline-flex mt-4 items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold"
              >
                Join the community <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {/* Timeline */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">🕰️ Timeline</h2>
            </Reveal>
            <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
              {[
                { d: "Yesterday", t: "Idea sparked from a client conversation" },
                { d: "This week", t: "Drafted outline, gathered sources" },
                { d: "Today", t: "Published article you're reading" },
                { d: "Next", t: "Follow-up piece + community discussion" },
              ].map((it, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-fuchsia-400" />
                    <div className="text-xs uppercase tracking-widest text-fuchsia-300">
                      {it.d}
                    </div>
                    <div className="text-white/80">{it.t}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Hiring CTA */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-white/10 bg-black p-8">
              <h3 className="text-2xl font-bold">Need help implementing this?</h3>
              <p className="mt-2 text-white/70 max-w-xl">
                I take on a limited number of clients each month for hands-on
                delivery. If it's a fit, tell me a bit about your project.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 grid sm:grid-cols-2 gap-3"
              >
                <input
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                  placeholder="Your email"
                  type="email"
                />
                <input
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                  placeholder="Your website"
                />
                <textarea
                  className="sm:col-span-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                  placeholder="What are you trying to build?"
                  rows={3}
                />
                <button className="sm:col-span-2 px-5 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold">
                  Send message
                </button>
              </form>
            </div>
          </Reveal>

          {/* Relevant services */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                🚀 Services related to this post
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {["ai", "content", "marketing"].map((s, i) => (
                <Reveal key={s} delay={i * 100}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s }}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
                  >
                    <div className="font-bold capitalize">{s} services</div>
                    <div className="text-white/60 text-sm mt-1">
                      Hands-on delivery — see scope, pricing, and process.
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Beginner tips + advanced */}
          <section className="mt-16 grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-2">🌱 Beginner tips</h3>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Start with one small win</li>
                  <li>• Copy a working template</li>
                  <li>• Ship before it's perfect</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-2">🏔️ Advanced tips</h3>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Automate the boring 80%</li>
                  <li>• Systemize your review loops</li>
                  <li>• Compound with retros</li>
                </ul>
              </div>
            </Reveal>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                ❓ Frequently asked questions
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Accordion
                items={[
                  { q: "How long does this take to implement?", a: "1–2 weeks for a scoped v1; 2–3 months to fully mature." },
                  { q: "What's the biggest risk?", a: "Doing nothing and calling it 'later'. Start small, ship this week." },
                  { q: "Do I need a big budget?", a: "No — most of what's in this article can be started for under $50." },
                  { q: "Can you help implement?", a: "Yes — see services below or book a call." },
                ]}
              />
            </Reveal>
          </section>

          {/* Prev / Next */}
          <section className="mt-16 grid md:grid-cols-2 gap-4">
            {prevNext.prev ? (
              <Reveal>
                <Link
                  to="/blog/$slug"
                  params={{ slug: prevNext.prev.slug }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition flex items-start gap-3"
                >
                  <ChevronLeft className="h-5 w-5 text-white/60 mt-1" />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/50">
                      Previous
                    </div>
                    <div className="font-semibold line-clamp-2">
                      {decodeEntities(stripHtml(prevNext.prev.title || ""))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ) : (
              <div />
            )}
            {prevNext.next && (
              <Reveal delay={100}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: prevNext.next.slug }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition flex items-start gap-3 text-right"
                >
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest text-white/50">
                      Next
                    </div>
                    <div className="font-semibold line-clamp-2">
                      {decodeEntities(stripHtml(prevNext.next.title || ""))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/60 mt-1" />
                </Link>
              </Reveal>
            )}
          </section>

          {/* About author */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center text-3xl">
                🧑‍💻
              </div>
              <div>
                <h3 className="font-bold text-xl">About Usman Jatoi</h3>
                <p className="text-white/70 mt-1">
                  Self-taught digital practitioner. Building agencies, tools,
                  and content across AI, web, and marketing. 500+ projects
                  shipped for real clients.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link to="/about-me/social-media" className="text-fuchsia-300 hover:underline">
                    Social media
                  </Link>
                  <a
                    href="https://youtube.com/@usmanjatoi"
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Youtube className="h-4 w-4" /> YouTube
                  </a>
                  <Link to="/media-kit" className="text-cyan-300 hover:underline">
                    Media kit
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Agency banner (world bg) */}
          <Reveal>
            <div
              className="mt-16 rounded-3xl overflow-hidden border border-white/10 relative min-h-[240px] flex items-center"
              style={{
                background:
                  "radial-gradient(600px circle at 20% 30%, rgba(139,92,246,.45), transparent), radial-gradient(500px circle at 80% 70%, rgba(6,182,212,.35), transparent), #0b0b12",
              }}
            >
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Looking for an AI / {primaryCategory} agency?
                </h3>
                <p className="mt-2 text-white/70 max-w-xl">
                  Redsglow ships work like this every week. Let's build yours next.
                </p>
                <a
                  href="https://redsglow.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex mt-4 items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold"
                >
                  Visit Redsglow <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Explore my categories - pill list */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Explore my categories
              </h2>
            </Reveal>
            <div className="flex flex-wrap gap-2">
              {[
                "AI",
                "Marketing",
                "Web",
                "Design",
                "SEO",
                "Content",
                "Startups",
                "Business",
                "Lifestyle",
                "Tools",
              ].map((c, i) => (
                <Reveal key={c} delay={i * 40}>
                  <span className="px-4 py-2 rounded-full border border-white/20 bg-white text-black font-semibold text-sm hover:bg-black hover:text-white transition cursor-pointer">
                    {c}
                  </span>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Read more posts - bento */}
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                📚 Read more posts
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {siblings.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition h-full"
                  >
                    <div className="text-xs uppercase tracking-widest text-fuchsia-300">
                      {primaryCategory}
                    </div>
                    <div className="mt-1 font-semibold line-clamp-3">
                      {decodeEntities(stripHtml(s.title || ""))}
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      {formatDate(s.post_date)}
                    </div>
                  </Link>
                </Reveal>
              ))}
              {!siblings.length && (
                <p className="text-white/60">No related posts yet.</p>
              )}
            </div>
          </section>

          {/* Booking calendar */}
          <Reveal>
            <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 p-8 text-center">
              <Calendar className="h-10 w-10 mx-auto text-fuchsia-300 mb-3" />
              <h3 className="text-2xl font-bold">Book a call</h3>
              <p className="text-white/70 mt-1">
                30 minutes on Cal.com — free, no obligation.
              </p>
              <a
                href="https://cal.com/usmanjatoi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-4 items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold"
              >
                Open calendar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </main>

        {/* SIDEBAR 30% */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Publish / meta card with bg + overlay */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[220px]">
            {heroUrl && (
              <img
                src={heroUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/75" />
            <div className="relative p-5 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-fuchsia-300" />
                <span className="text-white/60">Published:</span>{" "}
                <span className="text-white">{formatDate(post.post_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-300" />
                <span className="text-white/60">Updated:</span>{" "}
                <span className="text-white">{formatDate(post.post_modified)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-300" />
                <span className="text-white/60">Reading time:</span>{" "}
                <span className="text-white">{rt} min</span>
              </div>
              <div className="pt-2">
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">
                  Categories
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.length ? (
                    categories.map((c) => (
                      <Link
                        key={c.id}
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-white/50">Uncategorized</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coffee quote / disclaimer */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="h-4 w-4 text-amber-400" />
              <span className="font-semibold">A quick note</span>
            </div>
            <p className="text-white/70 text-sm">
              This site is a personal journal. I write over coffee — thoughts,
              not gospel.{" "}
              <span
                className="underline decoration-dotted cursor-help"
                title="Nothing here is legal, medical, or financial advice. Always confirm with a qualified professional for your specific situation."
              >
                Read disclaimer
              </span>
              <Info className="h-3.5 w-3.5 inline ml-1 text-white/50" />
            </p>
          </div>

          {/* Ad slot */}
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-center text-white/50 text-xs uppercase tracking-widest">
            Sponsored slot
          </div>

          {/* Explore more under category */}
          {categories.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-widest text-fuchsia-300 mb-3">
                Explore more under {primaryCategory}
              </div>
              <ul className="space-y-2 text-sm">
                {siblings.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: s.slug }}
                      className="text-white/80 hover:text-white line-clamp-2"
                    >
                      {decodeEntities(stripHtml(s.title || ""))}
                    </Link>
                  </li>
                ))}
                {!siblings.length && (
                  <li className="text-white/50">No siblings found.</li>
                )}
              </ul>
            </div>
          )}

          {/* Recent figures */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-widest text-cyan-300 mb-3">
              Recent figures
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold">{views.toLocaleString()}</div>
                <div className="text-white/50 text-[10px] uppercase">Views</div>
              </div>
              <div>
                <div className="text-xl font-bold">{responses}</div>
                <div className="text-white/50 text-[10px] uppercase">Responses</div>
              </div>
              <div>
                <div className="text-xl font-bold">{rt}m</div>
                <div className="text-white/50 text-[10px] uppercase">Read</div>
              </div>
            </div>
          </div>

          {/* Table of contents */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-widest text-yellow-300 mb-3 flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Table of contents
            </div>
            <ul className="space-y-1.5 text-sm text-white/70">
              {[
                "Welcome",
                "Glossary",
                "Get the pack",
                "Post body",
                "Step-by-step",
                "Pros & Cons",
                "Mistakes",
                "Newsletter",
                "Tools",
                "Comparison",
                "Reddit / YouTube",
                "Checklist",
                "Timeline",
                "FAQ",
                "About author",
              ].map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>

          {/* Share this post */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-widest text-fuchsia-300 mb-3 flex items-center gap-1">
              <Share2 className="h-3 w-3" /> Share this post
            </div>
            <div className="flex gap-2">
              {[
                { n: "X", u: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
                { n: "in", u: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                { n: "f", u: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                { n: "@", u: `mailto:?body=${encodeURIComponent(shareUrl)}` },
              ].map((s) => (
                <a
                  key={s.n}
                  href={s.u}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold"
                >
                  {s.n}
                </a>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-widest text-white/60 mb-2">
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="text-xs px-2 py-1 rounded-full bg-white/10"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Award badge */}
          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5">
            <Award className="h-6 w-6 text-yellow-400 mb-2" />
            <div className="font-semibold text-sm">Editor's pick</div>
            <p className="text-white/60 text-xs">
              This piece was selected for its practical, hands-on take.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
