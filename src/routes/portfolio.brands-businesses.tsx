import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/brands-businesses")({
    head: () => ({
    meta: [
      { title: "Brands & Businesses — Usman Jatoi" },
      { name: "description", content: "Ventures, digital products, and brand identities developed and scaled." },
      { property: "og:title", content: "Brands & Businesses — Usman Jatoi" },
      { property: "og:description", content: "Ventures, digital products, and brand identities developed and scaled." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/portfolio/brands-businesses" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/portfolio/brands-businesses" }],
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
