import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/brands-businesses")({
  head: () => ({
    meta: [
      { title: "Portfolio — Brands & Businesses" },
      { name: "description", content: "Brands and businesses founded, co-founded or operated by Usman Jatoi." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Portfolio"
      title="Brands & Businesses"
      description="Ventures across agency, publishing, SaaS and creative — Redsglow, UJ Online, RabbitFlare and more."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Brands & Businesses" },
      ]}
    />
  ),
});
