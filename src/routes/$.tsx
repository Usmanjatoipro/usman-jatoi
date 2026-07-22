import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowLeft, Tag, ChevronRight } from "lucide-react";

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
};

type WpMedia = { storage_url: string | null; source_url: string; alt_text: string | null };

type ChildPage = { id: number; title: string | null; path: string; slug: string; excerpt: string | null; featured_media_id: number | null };

const CANDIDATE_TYPES = ["page", "post", "product", "courses"];

function normalizeVariants(rawPath: string) {
  const p = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  return {
    withSlash: p.endsWith("/") ? p : p + "/",
    noSlash: p.replace(/\/+$/, ""),
    prefix: (p.endsWith("/") ? p : p + "/"),
  };
}

async function loadPage(
  rawPath: string,
): Promise<
  | { post: WpPost; media: WpMedia | null; children: ChildPage[]; childrenMedia: Record<number, WpMedia> }
  | null
> {
  const { withSlash, noSlash, prefix } = normalizeVariants(rawPath);

  const { data } = await supabase
    .from("wp_posts")
    .select(
      "id, post_type, slug, title, excerpt, content, path, permalink, seo_title, seo_description, post_date, featured_media_id",
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

  // For "hub" pages under /services/ or similar hierarchies, list direct children.
  let children: ChildPage[] = [];
  const childrenMedia: Record<number, WpMedia> = {};
  const segCount = prefix.split("/").filter(Boolean).length;
  const isHubCandidate = prefix.startsWith("/services/") || prefix === "/services/" || prefix.startsWith("/about-me/") || prefix.startsWith("/my-lifestyle/") || prefix.startsWith("/portfolio/") || prefix.startsWith("/skills-expertise/");

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
      // Keep only immediate children: exactly one segment deeper
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

// Rewrite absolute usmanjatoi.com URLs in the HTML at render time (defence in depth).
function rewriteContentHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(/https?:\/\/(?:www\.)?usmanjatoi\.com/g, "")
    .replace(/href="\/([^"#?]*?)\/?"/g, (_m, p1) => `href="/${p1}"`);
}

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!splat) throw notFound();
    const result = await loadPage(splat);
    if (result) return result;

    // Redirect fallback
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
    if (!loaderData) return { meta: [{ title: "Page — Usman Jatoi" }, { name: "robots", content: "noindex" }] };
    const { post, media } = loaderData;
    const title = post.seo_title || post.title || "Usman Jatoi";
    const desc =
      post.seo_description ||
      (post.excerpt ? post.excerpt.slice(0, 158) : `${post.title} — Usman Jatoi`);
    const splat = (params as { _splat?: string })._splat ?? "";
    const url = `https://usmanjatoi.lovable.app/${splat}`;
    const image = media?.storage_url || media?.source_url || undefined;

    const jsonLd: Record<string, unknown> = post.post_type === "post"
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
        };

    return {
      meta: [
        { title },
        { name: "description", content: (desc || "").slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: (desc || "").slice(0, 158) },
        { property: "og:type", content: post.post_type === "post" ? "article" : "website" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: DynamicPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
        <Link to="/" className="underline">Home</Link>
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
  const segs = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const acc: string[] = [];
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4 flex flex-wrap items-center gap-1">
      <Link to="/" className="hover:text-foreground">Home</Link>
      {segs.map((s, i) => {
        acc.push(s);
        const href = "/" + acc.join("/");
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            {i === segs.length - 1 ? (
              <span className="text-foreground">{decodeURIComponent(s).replace(/-/g, " ")}</span>
            ) : (
              <Link to={href as any} className="hover:text-foreground">{decodeURIComponent(s).replace(/-/g, " ")}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function DynamicPage() {
  const { post, media, children, childrenMedia } = Route.useLoaderData();
  const contentHtml = rewriteContentHtml(post.content || "");
  const heroUrl = media?.storage_url || media?.source_url || null;
  const date = post.post_date ? new Date(post.post_date) : null;

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          {post.path && <Breadcrumbs path={post.path} />}
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-4">
            <span className="px-2 py-1 rounded bg-muted">{post.post_type}</span>
            {date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-muted-foreground max-w-3xl">{post.excerpt}</p>
          )}
        </div>
      </section>

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

      {/* Children grid for parent/hub pages */}
      {children && children.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore in {post.title}</h2>
            <p className="text-sm text-muted-foreground mb-8">
              {children.length} {children.length === 1 ? "page" : "pages"} under this section.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(children as ChildPage[]).map((c: ChildPage) => {
                const cm = c.featured_media_id ? childrenMedia[c.featured_media_id] : null;
                const cImg = cm?.storage_url || cm?.source_url || null;
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
