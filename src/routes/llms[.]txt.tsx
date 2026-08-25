import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://usmanjatoi.com";

type Cluster = { slug: string; name: string | null; posts: number };

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        let totals = { page: 0, post: 0, media: 0, categories: 0, outlines: 0 };
        let clusters: Cluster[] = [];

        if (url && key) {
          const supa = createClient(url, key, { auth: { persistSession: false } });
          const { data } = await supa
            .from("content_stats_snapshot")
            .select("payload")
            .eq("id", 1)
            .maybeSingle();
          const payload = (data?.payload ?? {}) as Record<string, any>;
          totals = {
            page: payload["totals"]?.page ?? 0,
            post: payload["totals"]?.post ?? 0,
            media: payload["media"] ?? 0,
            categories: payload["categories"] ?? 0,
            outlines: payload["outlines"] ?? 0,
          };
          clusters = ((payload["clusters"] ?? []) as Cluster[])
            .filter((c) => c.posts > 0)
            .slice(0, 60);
        }

        const body = [
          `# Usman Jatoi`,
          ``,
          `> Personal site of Usman Jatoi — WordPress expert, full-stack web developer, SEO consultant and digital strategist based in Pakistan. Services, case studies, courses and a ${totals.post.toLocaleString("en-US")}-post archive on web development, SEO and digital growth.`,
          ``,
          `## About`,
          `- Name: Usman Jatoi`,
          `- Role: Web developer, WordPress specialist, SEO consultant, entrepreneur`,
          `- Location: Pakistan (serves clients globally)`,
          `- Primary services: Custom WordPress builds, Shopify stores, React/Next.js apps, SEO audits, white-label partnerships`,
          `- Contact: ${SITE}/contact-me`,
          `- Book a call: ${SITE}/call`,
          ``,
          `## Key pages`,
          `- Home: ${SITE}/`,
          `- Services: ${SITE}/services`,
          `- About: ${SITE}/about-me`,
          `- Blog: ${SITE}/blog`,
          `- Portfolio: ${SITE}/portfolio`,
          `- Courses: ${SITE}/courses`,
          `- Testimonials: ${SITE}/testimonials`,
          `- Careers: ${SITE}/careers`,
          `- HTML sitemap: ${SITE}/sitemap`,
          `- XML sitemap index: ${SITE}/sitemap.xml`,
          ``,
          `## Content inventory`,
          `- Pages: ${totals.page.toLocaleString("en-US")}`,
          `- Blog posts: ${totals.post.toLocaleString("en-US")}`,
          `- Topic categories: ${totals.categories.toLocaleString("en-US")}`,
          `- Media assets: ${totals.media.toLocaleString("en-US")}`,
          `- Posts with structured research (stats, quotes, citations): ${totals.outlines.toLocaleString("en-US")}`,
          `- All content is first-party and self-hosted; media is served from the site's own CDN.`,
          ``,
          `## Topic clusters`,
          ...clusters.map(
            (c) => `- ${c.name || c.slug} (${c.posts.toLocaleString("en-US")} posts): ${SITE}/category/${c.slug}`,
          ),
          ``,
          `## AI usage`,
          `Content on this site may be summarized, quoted and cited with a link back to the source page.`,
          `Please preserve author attribution: "Usman Jatoi (usmanjatoi.com)".`,
          ``,
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
