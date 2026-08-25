import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  ArrowLeft,
  Tag,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  FolderOpen,
} from "lucide-react";
import { loadCategoryArchiveByPath, type CategoryArchive } from "@/lib/wp-category-archive";
import { PostArticle, type PostArticleTerm } from "@/components/PostArticle";
import { coverImageUrl } from "@/components/PostCover";
import ServiceArticle, {
  type ServiceArticleData,
  type ServiceChild,
} from "@/components/ServiceArticle";

import PageHero from "@/components/PageHero";
import PearlLemonExperience from "@/components/PearlLemonExperience";
import { getLocalContentByPath } from "@/lib/wp-content-stats.functions";
import { hydrateContentHtml } from "@/lib/wp-hydrate";

type WpPost = {
  id: number;
  post_type: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  path: string | null;
  permalink: string | null;
  seo_title: string | null;
  seo_description: string | null;
  post_date: string | null;
  featured_media_id: number | null;
  meta: Record<string, unknown> | null;
};

type WpMedia = { storage_url: string | null; source_url: string; alt_text: string | null };
type ChildPage = {
  id: number;
  title: string | null;
  path: string;
  slug: string;
  excerpt: string | null;
  featured_media_id: number | null;
};

// -------------------- Structured meta parsing --------------------

type HeroSection = {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  paragraphs?: string[];
  bullets?: Array<{ heading?: string; description?: string; list?: string[] }>;
};
type ProcessSection = {
  steps?: Array<{ step_number?: number; title?: string; description?: string }>;
};
type FaqSection = { faqs?: Array<{ question?: string; answer?: string }> };
type ServicesSection = {
  section_title?: string;
  section_subtitle?: string;
  services?: Array<{
    icon?: string;
    title?: string;
    description?: string;
    tags?: string[];
    link?: string;
  }>;
};
type AboutSection = {
  title?: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: Array<{ heading?: string; description?: string; list?: string[] }>;
};

type Structured = {
  hero: HeroSection | null;
  about: AboutSection | null;
  process: ProcessSection | null;
  services: ServicesSection | null;
  faqs: FaqSection | null;
  promoVideo: string | null;
};

function pickFirst<T>(value: unknown): T | null {
  if (value == null) return null;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first === "string") {
    const trimmed = first.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      return null;
    }
  }
  if (typeof first === "object") return first as T;
  return null;
}

function firstMetaString(value: unknown) {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" ? first.trim() : "";
}

function decodeHtml(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const hex = code[1]?.toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function htmlText(value: string) {
  return decodeHtml(
    value
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function tagTexts(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))]
    .map((match) => htmlText(match[1]))
    .filter(Boolean);
}

function parseHeroHtml(html: string): HeroSection | null {
  const title = tagTexts(html, "h1")[0] || tagTexts(html, "h2")[0];
  if (!title) return null;
  const paragraphs = tagTexts(html, "p");
  return {
    title,
    subtitle: paragraphs[0],
    description: paragraphs.at(-1),
    features: tagTexts(html, "li"),
  };
}

function parseAboutHtml(html: string): AboutSection | null {
  const title = tagTexts(html, "h2")[0] || tagTexts(html, "h3")[0];
  if (!title) return null;
  const paragraphs = tagTexts(html, "p");
  const items = tagTexts(html, "li");
  const midpoint = Math.max(1, Math.ceil(items.length / 2));
  return {
    title,
    intro: paragraphs[0],
    paragraphs: paragraphs.slice(1),
    bullets: items.length
      ? [
          { heading: "My expertise", list: items.slice(0, midpoint) },
          { heading: "How I help", list: items.slice(midpoint) },
        ].filter((group) => group.list.length)
      : [],
  };
}

function parseServicesHtml(html: string): ServicesSection | null {
  const heading = tagTexts(html, "h2")[0];
  const services = [
    ...html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi),
  ]
    .map((match) => ({
      title: htmlText(match[1]),
      description: htmlText(match[2]),
      tags: [] as string[],
    }))
    .filter((item) => item.title && item.description);
  if (!heading && !services.length) return null;
  const paragraphs = tagTexts(html, "p");
  return { section_title: heading, section_subtitle: paragraphs[0], services };
}

function parseProcessHtml(html: string): ProcessSection | null {
  const steps = [
    ...html.matchAll(
      /class=["'][^"']*process-title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>[\s\S]*?class=["'][^"']*process-description[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi,
    ),
  ].map((match, index) => ({
    step_number: index + 1,
    title: htmlText(match[1]),
    description: htmlText(match[2]),
  }));
  return steps.length ? { steps } : null;
}

function parseFaqHtml(html: string): FaqSection | null {
  const faqs = [
    ...html.matchAll(
      /class=["'][^"']*faq-question[^"']*["'][^>]*>([\s\S]*?)<\/button>[\s\S]*?class=["'][^"']*faq-answer[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    ),
  ].map((match) => ({ question: htmlText(match[1]), answer: htmlText(match[2]) }));
  return faqs.length ? { faqs } : null;
}

function structuredField<T>(value: unknown, parseHtml: (html: string) => T | null) {
  const parsed = pickFirst<T>(value);
  if (parsed) return parsed;
  const html = firstMetaString(value);
  return html.startsWith("<") ? parseHtml(html) : null;
}

function extractStructured(meta: Record<string, unknown> | null): Structured {
  if (!meta)
    return { hero: null, about: null, process: null, services: null, faqs: null, promoVideo: null };
  const promo = firstMetaString(meta["promovideo"]);
  return {
    hero: structuredField(meta["hero_section"], parseHeroHtml),
    about: structuredField(meta["aboutexpertise_section"], parseAboutHtml),
    process: structuredField(meta["process"], parseProcessHtml),
    services: structuredField(meta["our_services"], parseServicesHtml),
    faqs: structuredField(meta["faqs"], parseFaqHtml),
    promoVideo: promo || null,
  };
}

function toYouTubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// -------------------- Loader --------------------

const CANDIDATE_TYPES = ["page", "post", "product", "courses"];

function normalizeVariants(rawPath: string) {
  const p = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  return {
    withSlash: p.endsWith("/") ? p : p + "/",
    noSlash: p.replace(/\/+$/, ""),
    prefix: p.endsWith("/") ? p : p + "/",
  };
}

async function loadPage(rawPath: string): Promise<{
  post: WpPost;
  media: WpMedia | null;
  children: ChildPage[];
  childrenMedia: Record<number, WpMedia>;
} | null> {
  const { withSlash, noSlash, prefix } = normalizeVariants(rawPath);

  const { data } = await supabase
    .from("wp_posts")
    .select(
      "id, post_type, slug, title, excerpt, content, path, permalink, seo_title, seo_description, post_date, featured_media_id, meta",
    )
    .in("post_type", CANDIDATE_TYPES)
    .in("path", [withSlash, noSlash])
    .eq("status", "publish")
    .limit(1);

  const post = data?.[0] as WpPost | undefined;
  if (!post) return null;

  let media: WpMedia | null = null;
  if (post.featured_media_id) {
    const { data: m } = await supabase
      .from("wp_media")
      .select("storage_url, source_url, alt_text")
      .eq("id", post.featured_media_id)
      .maybeSingle();
    media = (m as WpMedia) ?? null;
  }

  let children: ChildPage[] = [];
  const childrenMedia: Record<number, WpMedia> = {};
  const segCount = prefix.split("/").filter(Boolean).length;
  const isHubCandidate =
    prefix.startsWith("/services/") ||
    prefix === "/services/" ||
    prefix.startsWith("/about-me/") ||
    prefix.startsWith("/my-lifestyle/") ||
    prefix.startsWith("/portfolio/") ||
    prefix.startsWith("/skills-expertise/");

  if (isHubCandidate) {
    const { data: kids } = await supabase
      .from("wp_posts")
      .select("id, title, path, slug, excerpt, featured_media_id")
      .eq("post_type", "page")
      .eq("status", "publish")
      .like("path", `${prefix}%`)
      .not("path", "eq", prefix)
      .not("path", "eq", noSlash)
      .limit(500);

    if (kids && kids.length) {
      const direct = (kids as any[]).filter((k) => {
        if (!k.path) return false;
        const kSegs = k.path.replace(/^\/+|\/+$/g, "").split("/");
        return kSegs.length === segCount + 1;
      }) as ChildPage[];
      children = direct.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

      const ids = children.map((c) => c.featured_media_id).filter(Boolean) as number[];
      if (ids.length) {
        const { data: cm } = await supabase
          .from("wp_media")
          .select("id, storage_url, source_url, alt_text")
          .in("id", ids);
        (cm || []).forEach((row: any) => {
          childrenMedia[row.id] = row as WpMedia;
        });
      }
    }
  }

  return { post, media, children, childrenMedia };
}

function rewriteContentHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(/https?:\/\/(?:www\.)?usmanjatoi\.com/g, "")
    .replace(/href="\/([^"#?]*?)\/?"/g, (_m, p1) => `href="/${p1}"`);
}

function serviceHtmlField(meta: Record<string, unknown> | null, key: string) {
  if (!meta) return "";
  const raw = Array.isArray(meta[key]) ? meta[key][0] : meta[key];
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\sstyle=("[^"]*"|'[^']*')/gi, "")
    .replace(/\son\w+=("[^"]*"|'[^']*')/gi, "");
}

// -------------------- Route --------------------

export const Route = createFileRoute("/$")({
  validateSearch: z.object({ page: z.number().int().min(1).max(500).optional() }).parse,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!splat) throw notFound();

    // 1) Local WordPress manifests (optional). If the shards are unavailable,
    // fall through to the database, which is the authoritative source.
    try {
      const local = await getLocalContentByPath({ data: { path: splat } });
      if (local) return { kind: "post" as const, ...local };
    } catch {
      /* shards unavailable — use the database */
    }

    // 2) Try wp_posts (page/post/product/course)
    const result = await loadPage(splat);
    if (result) return { kind: "post" as const, ...result };

    // 3) Try category archive (matches /websites/, /websites/web-innovations/, etc.)
    const archive = await loadCategoryArchiveByPath(splat, deps.page);
    if (archive) return { kind: "category" as const, archive };

    // 4) Redirects table
    const p = "/" + splat.replace(/^\/+|\/+$/g, "");
    const { data: rd } = await supabase
      .from("redirects")
      .select("to_path")
      .in("from_path", [p, p + "/"])
      .maybeSingle();
    if (rd?.to_path) throw redirect({ to: rd.to_path as string });

    throw notFound();
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Page not found — Usman Jatoi" }, { name: "robots", content: "noindex" }],
      };

    const splat = (params as { _splat?: string })._splat ?? "";
    // Canonical always points at the production property, never the preview host.
    const url = `https://usmanjatoi.com/${splat}`;

    const truncate = (s: string, n: number) => {
      const c = (s || "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return c.length > n ? c.slice(0, n - 1).trimEnd() + "…" : c;
    };

    if (loaderData.kind === "category") {
      const { category, total } = loaderData.archive;
      const title = truncate(`${category.name} — Articles & Resources | Usman Jatoi`, 60);
      const desc = truncate(
        category.description ||
          `Browse ${total} posts in the ${category.name} category — expert articles, guides and resources by Usman Jatoi.`,
        158,
      );
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
          { property: "og:type", content: "website" },
          { property: "og:url", content: url },
          { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [{ rel: "canonical", href: url }],
        scripts: [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: category.name,
              description: desc,
              url,
            }),
          },
        ],
      };
    }

    const { post, media } = loaderData;
    const rawTitle = post.seo_title || post.title || "Usman Jatoi";
    const title = truncate(`${rawTitle} — Usman Jatoi`, 60);
    const desc = truncate(
      post.seo_description || post.excerpt || `${post.title} — Usman Jatoi`,
      158,
    );
    // Every page gets a social image: the real featured media when we have it,
    // otherwise the deterministic auto-generated silk cover for that slug.
    const image =
      media?.source_url ||
      media?.storage_url ||
      `https://usmanjatoi.com${coverImageUrl(post.slug || splat)}`;

    const structured = extractStructured((post.meta ?? null) as Record<string, unknown> | null);
    const jsonLdEntries: Array<Record<string, unknown>> = [];

    jsonLdEntries.push(
      post.post_type === "post"
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.post_date,
            image: image ? [image] : undefined,
            author: { "@type": "Person", name: "Usman Jatoi" },
            mainEntityOfPage: url,
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: post.title,
            url,
            description: (desc || "").slice(0, 158),
            image: image || undefined,
          },
    );

    if (structured.faqs?.faqs?.length) {
      jsonLdEntries.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: structured.faqs.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    // BreadcrumbList Schema (Google Rich Results compliant)
    const pathParts = splat.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const itemListElement = [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://usmanjatoi.com/",
        },
      ];
      let currentPath = "https://usmanjatoi.com";
      pathParts.forEach((seg, idx) => {
        currentPath += `/${seg}`;
        const isLast = idx === pathParts.length - 1;
        const name = isLast
          ? post.title || seg.replace(/-/g, " ")
          : seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        itemListElement.push({
          "@type": "ListItem",
          position: idx + 2,
          name,
          item: `${currentPath}/`,
        });
      });

      jsonLdEntries.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      });
    }

    // Service Schema for /services/ routes
    if (splat.startsWith("services/") || (post.path && post.path.startsWith("/services/"))) {
      jsonLdEntries.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: post.title || "Usman Jatoi Services",
        description: desc,
        provider: {
          "@type": "Person",
          name: "Usman Jatoi",
          url: "https://usmanjatoi.com",
          jobTitle: "Full-Stack Developer & AI Systems Architect",
        },
        areaServed: "Worldwide",
        url,
      });
    }

    // VideoObject Schema if video is present
    if (structured.promoVideo) {
      jsonLdEntries.push({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${post.title || "Usman Jatoi"} — Video Overview`,
        description: desc,
        thumbnailUrl: image ? [image] : ["https://usmanjatoi.com/favicon.ico"],
        uploadDate: post.post_date || new Date().toISOString(),
        contentUrl: structured.promoVideo,
        embedUrl: toYouTubeEmbed(structured.promoVideo) || structured.promoVideo,
      });
    }

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: post.post_type === "post" ? "article" : "website" },
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
      scripts: jsonLdEntries.map((entry) => ({
        type: "application/ld+json",
        children: JSON.stringify(entry),
      })),
    };
  },
  component: DynamicPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
        <Link to="/" className="underline">
          Home
        </Link>
      </div>
    </div>
  ),
});

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </div>
    </div>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const segs = path
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  const acc: string[] = [];
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-muted-foreground mb-4 flex flex-wrap items-center gap-1"
    >
      <Link to="/" className="hover:text-foreground">
        Home
      </Link>
      {segs.map((s, i) => {
        acc.push(s);
        const href = "/" + acc.join("/");
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            {i === segs.length - 1 ? (
              <span className="text-foreground">{decodeURIComponent(s).replace(/-/g, " ")}</span>
            ) : (
              <Link to={href as any} className="hover:text-foreground">
                {decodeURIComponent(s).replace(/-/g, " ")}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// -------------------- Structured section components --------------------

function StructuredHero({
  hero,
  post,
  media,
}: {
  hero: HeroSection;
  post: WpPost;
  media: WpMedia | null;
}) {
  const heroUrl = media?.source_url || media?.storage_url || null;
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-30 pointer-events-none [background:radial-gradient(60%_60%_at_10%_10%,#a855f7_0%,transparent_60%),radial-gradient(50%_50%_at_90%_20%,#3b82f6_0%,transparent_60%),radial-gradient(50%_50%_at_50%_100%,#ec4899_0%,transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        {post.path && (
          <div className="[&_a]:text-white/70 [&_span]:text-white/70">
            <Breadcrumbs path={post.path} />
          </div>
        )}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3" /> {post.post_type === "page" ? "Service" : post.post_type}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-4xl">
          {hero.title || post.title}
        </h1>
        {hero.subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-6">{hero.subtitle}</p>
        )}
        {hero.description && (
          <p className="text-base text-white/70 max-w-3xl mb-8">{hero.description}</p>
        )}
        {hero.features && hero.features.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl mb-8">
            {hero.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3">
          <Link
            to="/contact-me"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-white/90 transition"
          >
            Hire Me <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
          >
            All Services
          </Link>
        </div>
        {heroUrl && (
          <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={heroUrl}
              alt={media?.alt_text || post.title || ""}
              className="w-full"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function AboutBlock({ about }: { about: AboutSection }) {
  return (
    <section className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {about.title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{about.title}</h2>}
        {about.intro && (
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">{about.intro}</p>
        )}
        {about.paragraphs?.map((p, i) => (
          <p key={i} className="text-base text-foreground/80 max-w-3xl mb-4">
            {p}
          </p>
        ))}
        {about.bullets && about.bullets.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {about.bullets.map((b, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card">
                {b.heading && <h3 className="font-semibold text-lg mb-2">{b.heading}</h3>}
                {b.description && (
                  <p className="text-sm text-muted-foreground mb-3">{b.description}</p>
                )}
                {b.list && (
                  <ul className="space-y-2">
                    {b.list.map((li, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProcessBlock({ process }: { process: ProcessSection }) {
  if (!process.steps?.length) return null;
  return (
    <section className="border-b bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">My Process</h2>
        <p className="text-muted-foreground mb-10">How I deliver results, step by step.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {process.steps.map((s, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {s.step_number ?? i + 1}
              </div>
              <div>
                {s.title && <h3 className="font-semibold mb-1">{s.title}</h3>}
                {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesBlock({ services }: { services: ServicesSection }) {
  if (!services.services?.length) return null;
  return (
    <section className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {services.section_title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{services.section_title}</h2>
        )}
        {services.section_subtitle && (
          <p className="text-muted-foreground mb-10">{services.section_subtitle}</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.services.map((s, i) => {
            const cleanLink = s.link
              ? s.link.replace(/https?:\/\/(?:www\.)?usmanjatoi\.com/g, "")
              : null;
            const inner = (
              <>
                {s.icon && (
                  <i className={`${s.icon} text-2xl text-primary mb-3 block`} aria-hidden="true" />
                )}
                {s.title && <h3 className="font-semibold text-lg mb-2">{s.title}</h3>}
                {s.description && (
                  <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                )}
                {s.tags && s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {s.tags.map((t, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );
            return cleanLink ? (
              <Link
                key={i}
                to={cleanLink as any}
                className="block p-6 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                {inner}
              </Link>
            ) : (
              <div key={i} className="p-6 rounded-xl border bg-card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqsBlock({ faqs }: { faqs: FaqSection }) {
  if (!faqs.faqs?.length) return null;
  return (
    <section className="border-b bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mb-8">Everything you need to know.</p>
        <div className="space-y-3">
          {faqs.faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border bg-card p-5 open:shadow-md transition"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold">
                <span>{f.question}</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              {f.answer && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.answer}</p>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoVideoBlock({ url }: { url: string }) {
  const embed = toYouTubeEmbed(url);
  if (!embed) {
    return (
      <section className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            <PlayCircle className="w-6 h-6" /> Watch the promo
          </a>
        </div>
      </section>
    );
  }
  return (
    <section className="border-b">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">See it in action</h2>
        <div className="aspect-video rounded-2xl overflow-hidden border shadow-xl bg-black">
          <iframe
            src={embed}
            title="Promo video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

// -------------------- Page --------------------

function DynamicPage() {
  const loaderData = Route.useLoaderData();
  if (loaderData.kind === "category") {
    return <CategoryArchivePage archive={loaderData.archive} />;
  }
  const { post, media, children, childrenMedia } = loaderData;
  const heroUrl = media?.source_url || media?.storage_url || null;
  const date = post.post_date ? new Date(post.post_date) : null;
  const structured = extractStructured((post.meta ?? null) as Record<string, unknown> | null);
  const hasStructured = !!(
    structured.hero ||
    structured.about ||
    structured.process ||
    structured.services ||
    structured.faqs
  );
  // When no dedicated structured template applies, fold the imported meta
  // sections (FAQ, glossary, checklist…) into the body so nothing is lost.
  const contentHtml = rewriteContentHtml(
    hasStructured
      ? post.content || ""
      : hydrateContentHtml(post.content, (post.meta ?? null) as Record<string, unknown> | null),
  );

  const { data: related } = useQuery({
    queryKey: ["related", post.id, post.post_type],
    queryFn: async () => {
      const { data } = await supabase
        .from("wp_posts")
        .select("id, title, path, slug, post_type")
        .eq("post_type", post.post_type)
        .eq("status", "publish")
        .neq("id", post.id)
        .not("path", "is", null)
        .order("post_date", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  if (
    post.slug === "pearl-lemon" ||
    (post.path || "").replace(/\/+$/, "") === "/about-me/my-journey/professional-experience/pearl-lemon"
  ) {
    return <PearlLemonExperience />;
  }

  if (post.post_type === "page" && /^\/services\//.test(post.path || "")) {
    const aboutLists = structured.about?.bullets?.flatMap((item) => item.list || []) || [];
    const serviceChildren: ServiceChild[] = (children || []).map((child: any) => {
      const childMedia = child.featured_media_id
        ? (childrenMedia as Record<number, WpMedia>)[child.featured_media_id]
        : null;
      return {
        title: child.title || child.slug,
        href: child.path,
        excerpt: child.excerpt,
        featured_image: childMedia?.source_url || childMedia?.storage_url || null,
      };
    });
    const meta = (post.meta ?? null) as Record<string, unknown> | null;
    const serviceData: ServiceArticleData = {
      id: post.id,
      slug: post.slug,
      title: post.title || post.slug,
      h1: structured.hero?.title || post.title || post.slug,
      paragraphs: [
        structured.hero?.subtitle || structured.hero?.description || post.excerpt || "",
        structured.about?.intro || "",
        ...(structured.about?.paragraphs || []),
      ].filter(Boolean),
      bullets: [...(structured.hero?.features || []), ...aboutLists].filter(Boolean),
      content: post.content,
      excerpt: post.excerpt,
      post_date: post.post_date,
      path: post.path,
      fifu_image_url: heroUrl,
      structured,
      sections: {
        _cached_industries_block: serviceHtmlField(meta, "_cached_industries_block"),
        _cached_locations_block_v4: serviceHtmlField(meta, "_cached_locations_block_v4"),
      },
    };
    return (
      <ServiceArticle
        service={serviceData}
        children={serviceChildren}
        childCount={serviceChildren.length}
      />
    );
  }

  // WordPress blog posts get the dedicated PostArticle template
  // (mirrors usmanjatoi.com — dark hero + 70/30 body with sticky sidebar).
  if (post.post_type === "post") {
    return (
      <PostArticleFromWp
        post={post as any}
        heroUrl={heroUrl}
        related={related as any[] | undefined}
      />
    );
  }

  // Rich structured template — used when RankMath/ACF meta sections exist.
  if (hasStructured) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {structured.hero && (
          <StructuredHero hero={structured.hero} post={post as any} media={media} />
        )}
        {structured.about && <AboutBlock about={structured.about} />}
        {structured.services && <ServicesBlock services={structured.services} />}
        {structured.process && <ProcessBlock process={structured.process} />}
        {structured.promoVideo && <PromoVideoBlock url={structured.promoVideo} />}
        {structured.faqs && <FaqsBlock faqs={structured.faqs} />}

        {contentHtml && contentHtml.replace(/<[^>]+>/g, "").trim().length > 40 && (
          <article className="max-w-3xl mx-auto px-6 py-12">
            <div
              className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        )}

        {children && children.length > 0 && (
          <ChildrenGrid
            title={`Explore in ${post.title}`}
            children={children}
            childrenMedia={childrenMedia}
          />
        )}
      </div>
    );
  }

  // Fallback template — plain HTML content.
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHero
        title={post.title || ""}
        eyebrow={post.post_type}
        description={post.excerpt || undefined}
        size="md"
        crumbs={
          post.path
            ? [
                { label: "Home", href: "/" },
                ...post.path
                  .replace(/^\/|\/$/g, "")
                  .split("/")
                  .slice(0, -1)
                  .map((seg: string, i: number, arr: string[]) => ({
                    label: seg.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
                    href: "/" + arr.slice(0, i + 1).join("/") + "/",
                  })),
                { label: post.title || "" },
              ]
            : [{ label: "Home", href: "/" }, { label: post.title || "" }]
        }
      />

      {heroUrl && (
        <div className="max-w-5xl mx-auto px-6 -mt-4 md:-mt-8">
          <img
            src={heroUrl}
            alt={media?.alt_text || post.title || ""}
            loading="lazy"
            className="w-full rounded-lg shadow-xl border"
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {children && children.length > 0 && (
        <ChildrenGrid
          title={`Explore in ${post.title}`}
          children={children}
          childrenMedia={childrenMedia}
        />
      )}

      {related && related.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-6 inline-flex items-center gap-2">
              <Tag className="w-5 h-5" /> Related
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <Link
                  key={r.id}
                  to={(r.path || `/${r.slug}`) as any}
                  className="block p-5 rounded-lg border bg-card hover:shadow-md transition"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {r.post_type}
                  </div>
                  <div className="font-semibold line-clamp-2">{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// -------------------- Post template wrapper --------------------

function PostArticleFromWp({
  post,
  heroUrl,
  related,
}: {
  post: WpPost;
  heroUrl: string | null;
  related?: any[];
}) {
  const catIds: number[] = Array.isArray((post as any).raw?.categories)
    ? (post as any).raw.categories
    : [];
  const tagIds: number[] = Array.isArray((post as any).raw?.tags) ? (post as any).raw.tags : [];
  const localTerms = Array.isArray((post as any).raw?.terms)
    ? ((post as any).raw.terms as Array<{ taxonomy: string; slug: string; name: string }>)
    : null;
  const localCategories = localTerms
    ?.filter((term) => term.taxonomy === "category")
    .map((term, index) => ({
      id: index + 1,
      name: term.name,
      slug: term.slug,
      parent_id: null,
      taxonomy: term.taxonomy,
    }));
  const localTags = localTerms
    ?.filter((term) => term.taxonomy === "post_tag")
    .map((term, index) => ({
      id: index + 1000,
      name: term.name,
      slug: term.slug,
      parent_id: null,
      taxonomy: term.taxonomy,
    }));

  const { data: taxonomies } = useQuery({
    queryKey: ["post-terms", post.id, catIds.join(","), tagIds.join(",")],
    enabled: !localTerms && !!(catIds.length || tagIds.length),
    queryFn: async () => {
      const ids = [...catIds, ...tagIds];
      if (!ids.length)
        return { categories: [] as PostArticleTerm[], tags: [] as PostArticleTerm[] };
      const { data } = await supabase
        .from("wp_terms")
        .select("id,name,slug,parent_id,taxonomy")
        .in("id", ids);
      const rows = (data || []) as PostArticleTerm[];
      return {
        categories: rows.filter((r) => catIds.includes(r.id)),
        tags: rows.filter((r) => tagIds.includes(r.id)),
      };
    },
  });

  // Reuse the fetched `related` list to hydrate the sidebar so we do not
  // double-fetch inside PostArticle when the splat route already knows the
  // sibling set.
  const primaryChildren = (related || [])
    .filter((r) => r?.path)
    .slice(0, 8)
    .map((r) => ({
      title: (r.title || "Untitled").replace(/<[^>]+>/g, ""),
      href: r.path as string,
    }));

  // Build the archive path for the primary category from the current post path.
  let archivePath: string | null = null;
  if (post.path) {
    const parts = post.path
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);
    if (parts.length > 1) {
      archivePath = "/" + parts.slice(0, -1).join("/") + "/";
    }
  }

  return (
    <PostArticle
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: hydrateContentHtml(post.content, (post as any).meta ?? null),
        excerpt: post.excerpt,
        post_date: post.post_date,
        post_modified: (post as any).post_modified ?? null,
        path: post.path,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        meta: (post as any).meta ?? null,
        raw: (post as any).raw,
      }}
      heroUrl={heroUrl}
      categories={localCategories ?? taxonomies?.categories ?? []}
      tags={localTags ?? taxonomies?.tags ?? []}
      categoryArchivePath={archivePath}
      primaryCategoryChildren={primaryChildren}
    />
  );
}

function ChildrenGrid({
  title,
  children,
  childrenMedia,
}: {
  title: string;
  children: ChildPage[];
  childrenMedia: Record<number, WpMedia>;
}) {
  return (
    <section className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {children.length} {children.length === 1 ? "page" : "pages"} under this section.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {children.map((c) => {
            const cm = c.featured_media_id ? childrenMedia[c.featured_media_id] : null;
            const cImg = cm?.source_url || cm?.storage_url || null;
            return (
              <Link
                key={c.id}
                to={c.path as any}
                className="group block rounded-xl border bg-card overflow-hidden hover:shadow-lg transition"
              >
                {cImg && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={cImg}
                      alt={cm?.alt_text || c.title || ""}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition">
                    {c.title}
                  </h3>
                  {c.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{c.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-primary mt-3">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -------------------- Category archive template --------------------

function CategoryArchivePage({ archive }: { archive: CategoryArchive }) {
  const { category, ancestors, children, posts, page, totalPages, total } = archive;
  const basePath = "/" + [...ancestors.map((a) => a.slug), category.slug].join("/") + "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHero
        title={category.name}
        eyebrow="Category"
        description={category.description || undefined}
        size="md"
        crumbs={[
          { label: "Home", href: "/" },
          ...ancestors.map((a, i) => ({
            label: a.name,
            href:
              "/" +
              ancestors
                .slice(0, i + 1)
                .map((x) => x.slug)
                .join("/") +
              "/",
          })),
          { label: category.name },
        ]}
      >
        <p className="text-xs text-white/60">
          {total} {total === 1 ? "post" : "posts"} in this category
        </p>
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {children.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Browse subcategories
            </h2>
            <div className="flex flex-wrap gap-2">
              {children.map((c) => {
                const href = basePath + c.slug + "/";
                return (
                  <Link
                    key={c.id}
                    to={href as any}
                    className="px-4 py-2 rounded-full border border-border hover:border-foreground hover:bg-muted text-sm transition"
                  >
                    {c.name} <span className="text-muted-foreground">({c.count})</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {posts.length === 0 ? (
          <p className="text-muted-foreground py-16 text-center">
            No posts published in this category yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={(p.path || `/${p.slug}`) as any}
                className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg hover:border-foreground/30 transition"
              >
                {p.featured_image && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={p.featured_image}
                      alt={p.title || ""}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  {p.post_date && (
                    <time className="text-xs uppercase tracking-widest text-muted-foreground">
                      {new Date(p.post_date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary transition line-clamp-2">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && (
              <Link
                to={basePath as any}
                search={{ page: page - 1 } as any}
                className="px-4 py-2 rounded-full border border-border hover:bg-muted text-sm"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                to={basePath as any}
                search={{ page: page + 1 } as any}
                className="px-4 py-2 rounded-full border border-border hover:bg-muted text-sm"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
