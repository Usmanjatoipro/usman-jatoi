import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/gaming-life")({
  head: () => ({
    meta: [
      { title: "Portfolio — Gaming Life" },
      { name: "description", content: "The gaming-to-creation journey and highlights." },
    ],
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
