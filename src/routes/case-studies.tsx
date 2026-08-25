import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/case-studies")({
    head: () => ({
    meta: [
      { title: "Case Studies & Results — Usman Jatoi" },
      { name: "description", content: "Measurable impact, traffic growth, and ROI delivered for enterprise clients." },
      { property: "og:title", content: "Case Studies & Results — Usman Jatoi" },
      { property: "og:description", content: "Measurable impact, traffic growth, and ROI delivered for enterprise clients." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/case-studies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/case-studies" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Work"
      title="Case Studies"
      description="Detailed teardowns of client engagements — objectives, execution, numbers and what we would do differently next time."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Case Studies" }]}
    />
  ),
});
