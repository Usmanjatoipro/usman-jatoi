import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/shop")({
    head: () => ({
    meta: [
      { title: "Shop & Digital Products — Usman Jatoi" },
      { name: "description", content: "Themes, boilerplates, automation templates, and development resources." },
      { property: "og:title", content: "Shop & Digital Products — Usman Jatoi" },
      { property: "og:description", content: "Themes, boilerplates, automation templates, and development resources." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/shop" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/shop" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Store"
      title="Shop"
      description="Digital products, resource packs and merch coming soon. Join the newsletter to hear about the first drop."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Shop" }]}
    />
  ),
});
