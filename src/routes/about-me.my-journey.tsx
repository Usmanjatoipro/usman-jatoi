import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/my-journey")({
    head: () => ({
    meta: [
      { title: "My Journey — Usman Jatoi" },
      { name: "description", content: "Career milestones, professional growth, and turning points in Usman Jatoi's journey." },
      { property: "og:title", content: "My Journey — Usman Jatoi" },
      { property: "og:description", content: "Career milestones, professional growth, and turning points in Usman Jatoi's journey." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/about-me/my-journey" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/about-me/my-journey" }],
  }),
  component: () => (
    <PageShell
      eyebrow="About"
      title="My Journey"
      description="From early curiosity to global collaboration — the timeline of experiments, jobs, launches and lessons that built the current chapter."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "About Me", to: "/about-me" }, { label: "My Journey" }]}
    />
  ),
});
