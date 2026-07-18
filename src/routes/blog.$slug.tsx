import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
});

type Post = {
  id: number;
  slug: string;
  title: string | null;
  content: string | null;
  excerpt: string | null;
  post_date: string | null;
  featured_media_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMissing(false);
    (async () => {
      const { data } = await supabase
        .from("wp_posts")
        .select("id,slug,title,content,excerpt,post_date,featured_media_id,seo_title,seo_description")
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
      if (p.featured_media_id) {
        const { data: m } = await supabase
          .from("wp_media")
          .select("storage_url,source_url")
          .eq("id", p.featured_media_id)
          .maybeSingle();
        if (!cancelled && m) setHeroUrl((m as any).storage_url || (m as any).source_url);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6 max-w-3xl mx-auto">
        <div className="h-8 w-32 bg-neutral-100 rounded mb-6 animate-pulse" />
        <div className="h-12 w-full bg-neutral-100 rounded mb-4 animate-pulse" />
        <div className="h-12 w-3/4 bg-neutral-100 rounded mb-8 animate-pulse" />
        <div className="aspect-[16/9] w-full bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (missing || !post) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-neutral-600 mb-8">This story may have moved or been unpublished.</p>
        <Link to="/blog" className="underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes postGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .post-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: postGrad 8s ease infinite;
        }
        .post-content { font-size: 18px; line-height: 1.75; color:#333; }
        .post-content p { margin: 1.25em 0; }
        .post-content h2 { font-size: 1.75em; font-weight: 700; margin: 2em 0 .6em; color:#111; }
        .post-content h3 { font-size: 1.35em; font-weight: 700; margin: 1.6em 0 .5em; color:#111; }
        .post-content a { color: #4facfe; text-decoration: underline; text-underline-offset: 3px; }
        .post-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 1.5em 0; }
        .post-content ul, .post-content ol { padding-left: 1.5em; margin: 1em 0; }
        .post-content ul { list-style: disc; } .post-content ol { list-style: decimal; }
        .post-content li { margin: .4em 0; }
        .post-content blockquote { border-left: 3px solid #a06cff; padding-left: 1.25em; margin: 1.5em 0; font-style: italic; color:#555; }
        .post-content pre { background:#0f172a; color:#e2e8f0; padding:1em; border-radius:12px; overflow-x:auto; font-size:.9em; }
        .post-content code { background:#f5f5f5; padding: .15em .4em; border-radius: 4px; font-size:.9em; }
        .post-content pre code { background: transparent; padding: 0; }
      `}} />

      <article className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
        <Link to="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 transition">← All posts</Link>

        <time className="block mt-8 text-sm font-mono text-neutral-500">{formatDate(post.post_date)}</time>
        <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
          {stripHtml(post.title) || "Untitled"}
        </h1>

        {heroUrl && (
          <div className="mt-10 rounded-2xl overflow-hidden">
            <img src={heroUrl} alt="" className="w-full h-auto" />
          </div>
        )}

        <div
          className="post-content mt-10"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        <div className="mt-16 pt-8 border-t border-neutral-200 text-center">
          <Link to="/blog" className="text-neutral-900 font-semibold hover:underline">← Back to all posts</Link>
        </div>
      </article>
    </div>
  );
}
