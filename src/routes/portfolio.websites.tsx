import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/portfolio/websites")({
  head: () => ({
    meta: [
      { title: "Portfolio — Websites" },
      { name: "description", content: "Web design and development portfolio: WordPress, Shopify, custom builds and more." },
    ],
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
