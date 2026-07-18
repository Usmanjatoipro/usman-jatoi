import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { PageShell, LinkGrid } from "../components/PageShell";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal — Usman Jatoi" },
      { name: "description", content: "Terms of service and privacy policy." },
    ],
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
