import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/vision-values")({
    head: () => ({
    meta: [
      { title: "Vision & Values — Usman Jatoi" },
      { name: "description", content: "The core principles, work ethic, and long-term vision guiding Usman Jatoi." },
      { property: "og:title", content: "Vision & Values — Usman Jatoi" },
      { property: "og:description", content: "The core principles, work ethic, and long-term vision guiding Usman Jatoi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/about-me/vision-values" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/about-me/vision-values" }],
  }),
  component: () => (
    <PageShell
      eyebrow="About"
      title="Vision & Values"
      description="Honesty, craft, curiosity and long-term thinking — the principles behind every collaboration."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "About Me", to: "/about-me" }, { label: "Vision & Values" }]}
    />
  ),
});
