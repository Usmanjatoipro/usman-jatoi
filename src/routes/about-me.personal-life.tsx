import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/personal-life")({
    head: () => ({
    meta: [
      { title: "Personal Life — Usman Jatoi" },
      { name: "description", content: "Life outside of the screen: fitness, mindset, disciplines, and passions." },
      { property: "og:title", content: "Personal Life — Usman Jatoi" },
      { property: "og:description", content: "Life outside of the screen: fitness, mindset, disciplines, and passions." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/about-me/personal-life" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/about-me/personal-life" }],
  }),
  component: () => (
    <PageShell
      eyebrow="About"
      title="Personal Life"
      description="The people, places and quiet rituals behind the public work."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "About Me", to: "/about-me" }, { label: "Personal Life" }]}
    />
  ),
});
