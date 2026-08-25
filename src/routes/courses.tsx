import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/courses")({
    head: () => ({
    meta: [
      { title: "Courses & Training — Usman Jatoi" },
      { name: "description", content: "Masterclasses on full-stack development, programmatic SEO, and modern web architectures." },
      { property: "og:title", content: "Courses & Training — Usman Jatoi" },
      { property: "og:description", content: "Masterclasses on full-stack development, programmatic SEO, and modern web architectures." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/courses" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/courses" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Learn"
      title="Courses"
      description="Hands-on courses distilled from real client work — AI automation, bulk publishing, SEO and creative production. New cohorts announced soon."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Courses" }]}
    />
  ),
});
