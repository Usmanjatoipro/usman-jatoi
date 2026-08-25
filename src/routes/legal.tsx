import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { PageShell, LinkGrid } from "../components/PageShell";

export const Route = createFileRoute("/legal")({
    head: () => ({
    meta: [
      { title: "Legal Information — Usman Jatoi" },
      { name: "description", content: "Legal disclosures, operational terms, and policies." },
      { property: "og:title", content: "Legal Information — Usman Jatoi" },
      { property: "og:description", content: "Legal disclosures, operational terms, and policies." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/legal" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/legal" }],
  }),
  component: LegalLayout,
});

function LegalLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId !== "/legal" && m.routeId.startsWith("/legal/"));
  if (isChild) return <Outlet />;
  return (
    <PageShell
      eyebrow="Legal"
      title="Legal"
      description="The legal documents governing use of this site and its services."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Legal" }]}
    >
      <LinkGrid
        items={[
          { title: "Terms of Service", to: "/legal/our-terms", desc: "How you may use this site." },
          { title: "Privacy Policy", to: "/legal/privacy-policy", desc: "How we handle your data." },
        ]}
      />
    </PageShell>
  );
}
