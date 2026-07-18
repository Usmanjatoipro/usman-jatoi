import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Usman Jatoi" },
      { name: "description", content: "Digital products, resource packs and merch — coming soon." },
    ],
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
