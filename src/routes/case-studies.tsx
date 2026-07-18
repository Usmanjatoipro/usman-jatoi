import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — Usman Jatoi" },
      { name: "description", content: "In-depth breakdowns of client engagements, outcomes and lessons." },
    ],
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
