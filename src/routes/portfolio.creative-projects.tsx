import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/creative-projects")({
  head: () => ({
    meta: [
      { title: "Portfolio — Creative Projects" },
      { name: "description", content: "Creative work: branding, thumbnails, social posters, mascots, video and 3D." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Portfolio"
      title="Creative Projects"
      description="Branding, thumbnails, social posters, mascots, motion, video and 3D."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Creative Projects" },
      ]}
    />
  ),
});
