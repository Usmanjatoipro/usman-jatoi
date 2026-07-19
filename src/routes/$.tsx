import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

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

const CANDIDATE_TYPES = ["page", "post", "product", "courses"];

async function loadPage(rawPath: string): Promise<{ post: WpPost; media: WpMedia | null } | null> {
  // Normalize to variants: /foo/bar and /foo/bar/
  let p = "/" + rawPath.replace(/^\/+|\/+$/g, "");
  const withSlash = p.endsWith("/") ? p : p + "/";
  const noSlash = p.replace(/\/+$/, "");

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
  return { post, media };
}

// Rewrite absolute usmanjatoi.com URLs & re-host media in the raw HTML content.
function rewriteContentHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(/https?:\/\/usmanjatoi\.com/g, "")
    .replace(/href="\/([^"#?]*?)\/?"/g, (m, p1) => `href="/${p1}"`);
}

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!splat) throw notFound();
    const result = await loadPage(splat);
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Page — Usman Jatoi" }] };
    const { post } = loaderData;
    const title = post.seo_title || post.title || "Usman Jatoi";
    const desc =
      post.seo_description ||
      (post.excerpt ? post.excerpt.slice(0, 158) : `${post.title} — Usman Jatoi`);
    const splat = (params as { _splat?: string })._splat ?? "";
    const url = `https://usmanjatoi.lovable.app/${splat}`;
    return {
      meta: [
        { title },
        { name: "description", content: (desc || "").slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: (desc || "").slice(0, 158) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
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

function DynamicPage() {
  const { post, media } = Route.useLoaderData();
  const contentHtml = rewriteContentHtml(post.content || "");
  const heroUrl = media?.storage_url || media?.source_url || null;
  const date = post.post_date ? new Date(post.post_date) : null;

  // Related posts (same post_type)
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
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

      {/* Featured image */}
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

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-6 inline-flex items-center gap-2">
              <Tag className="w-5 h-5" /> Related
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <a
                  key={r.id}
                  href={r.path || `/${r.slug}`}
                  className="block p-5 rounded-lg border bg-card hover:shadow-md transition"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {r.post_type}
                  </div>
                  <div className="font-semibold line-clamp-2">{r.title}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
