import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/my-journey")({
  head: () => ({
    meta: [
      { title: "My Journey — Usman Jatoi" },
      { name: "description", content: "The professional journey of Usman Jatoi across agencies, startups and independent projects." },
    ],
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
