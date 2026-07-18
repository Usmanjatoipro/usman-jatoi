import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Usman Jatoi" },
      { name: "description", content: "Practical courses on AI automation, bulk publishing, SEO and creative production." },
    ],
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
