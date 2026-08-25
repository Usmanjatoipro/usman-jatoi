import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Knowledge Hub — Usman Jatoi" },
      { name: "description", content: "In-depth articles, tutorials, and frameworks on web development, SEO, and AI systems." },
      { property: "og:title", content: "Blog & Knowledge Hub — Usman Jatoi" },
      { property: "og:description", content: "In-depth articles, tutorials, and frameworks on web development, SEO, and AI systems." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/blog" }],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  return <Outlet />;
}