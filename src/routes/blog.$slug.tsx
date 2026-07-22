import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostArticle, PostArticleTerm } from "@/components/PostArticle";

const SITE = "https://usmanjatoi.lovable.app";

function truncate(s: string, n: number) {
  const clean = s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

async function loadPostHead(slug: string) {
  const { data } = await supabase
    .from("wp_posts")
    .select(
      "id,title,excerpt,seo_title,seo_description,featured_media_id,post_date"
    )
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
  return { ...(data as any), image };
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
      158
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
        {
          name: "twitter:card",
          content: image ? "summary_large_image" : "summary",
        },
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

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<PostArticleTerm[]>([]);
  const [tags, setTags] = useState<PostArticleTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMissing(false);
    (async () => {
      const { data } = await supabase
        .from("wp_posts")
        .select(
          "id,slug,title,content,excerpt,post_date,post_modified,featured_media_id,seo_title,seo_description,path,raw"
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
      const p = data as any;
      setPost(p);

      if (p.featured_media_id) {
        const { data: m } = await supabase
          .from("wp_media")
          .select("storage_url,source_url")
          .eq("id", p.featured_media_id)
          .maybeSingle();
        if (!cancelled && m)
          setHeroUrl((m as any).storage_url || (m as any).source_url);
      }

      const catIds: number[] = Array.isArray(p.raw?.categories)
        ? p.raw.categories
        : [];
      const tagIds: number[] = Array.isArray(p.raw?.tags) ? p.raw.tags : [];
      if (catIds.length) {
        const { data: c } = await supabase
          .from("wp_terms")
          .select("id,name,slug,parent_id,taxonomy")
          .in("id", catIds);
        if (!cancelled && c) setCategories(c as PostArticleTerm[]);
      }
      if (tagIds.length) {
        const { data: t } = await supabase
          .from("wp_terms")
          .select("id,name,slug,parent_id,taxonomy")
          .in("id", tagIds);
        if (!cancelled && t) setTags(t as PostArticleTerm[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-40 px-6 max-w-4xl mx-auto">
        <div className="h-10 w-2/3 bg-neutral-100 rounded mb-4 animate-pulse" />
        <div className="h-6 w-1/3 bg-neutral-100 rounded mb-10 animate-pulse" />
        <div className="aspect-[16/9] w-full bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (missing || !post) {
    return (
      <div className="min-h-screen bg-white pt-40 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-neutral-600 mb-8">
          This story may have moved or been unpublished.
        </p>
        <Link to="/blog" className="underline text-neutral-900">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <PostArticle
      post={post}
      heroUrl={heroUrl}
      categories={categories}
      tags={tags}
    />
  );
}
