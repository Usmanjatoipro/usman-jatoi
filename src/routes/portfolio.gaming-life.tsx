import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/gaming-life")({
    head: () => ({
    meta: [
      { title: "Gaming Life — Usman Jatoi" },
      { name: "description", content: "Gaming setups, strategic plays, and high-focus recreation." },
      { property: "og:title", content: "Gaming Life — Usman Jatoi" },
      { property: "og:description", content: "Gaming setups, strategic plays, and high-focus recreation." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/portfolio/gaming-life" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/portfolio/gaming-life" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Portfolio"
      title="Gaming Life"
      description="From social gaming to digital creation — highlights, titles and lessons."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Gaming Life" },
      ]}
    />
  ),
});
