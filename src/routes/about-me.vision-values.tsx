import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/vision-values")({
  head: () => ({
    meta: [
      { title: "Vision & Values — Usman Jatoi" },
      { name: "description", content: "The vision and core values guiding every project, partnership and product." },
    ],
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
