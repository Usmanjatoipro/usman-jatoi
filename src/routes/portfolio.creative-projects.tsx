import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/creative-projects")({
    head: () => ({
    meta: [
      { title: "Creative Projects — Usman Jatoi" },
      { name: "description", content: "Design systems, motion graphics, video assets, and creative campaigns." },
      { property: "og:title", content: "Creative Projects — Usman Jatoi" },
      { property: "og:description", content: "Design systems, motion graphics, video assets, and creative campaigns." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/portfolio/creative-projects" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/portfolio/creative-projects" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Portfolio"
      title="Creative Projects"
      description="Branding, thumbnails, social posters, mascots, motion, video and 3D."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Creative Projects" },
      ]}
    />
  ),
});
