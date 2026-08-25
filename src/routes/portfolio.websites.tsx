import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/websites")({
    head: () => ({
    meta: [
      { title: "Websites Portfolio — Usman Jatoi" },
      { name: "description", content: "High-performance WordPress, React, and custom web applications delivered for clients worldwide." },
      { property: "og:title", content: "Websites Portfolio — Usman Jatoi" },
      { property: "og:description", content: "High-performance WordPress, React, and custom web applications delivered for clients worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/portfolio/websites" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/portfolio/websites" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Portfolio"
      title="Websites"
      description="Selected web design and development work across WordPress, Shopify, and custom stacks."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/portfolio" },
        { label: "Websites" },
      ]}
    />
  ),
});
