import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { PageShell, LinkGrid } from "../components/PageShell";

export const Route = createFileRoute("/portfolio")({
    head: () => ({
    meta: [
      { title: "Portfolio & Case Studies — Usman Jatoi" },
      { name: "description", content: "Explore websites, creative projects, digital brands, and high-scale systems built by Usman Jatoi." },
      { property: "og:title", content: "Portfolio & Case Studies — Usman Jatoi" },
      { property: "og:description", content: "Explore websites, creative projects, digital brands, and high-scale systems built by Usman Jatoi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/portfolio" }],
  }),
  component: PortfolioLayout,
});

function PortfolioLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId !== "/portfolio" && m.routeId.startsWith("/portfolio/"));
  if (isChild) return <Outlet />;
  return (
    <PageShell
      eyebrow="Work"
      title="Portfolio"
      description="Selected work across brands, websites, creative projects and gaming."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Portfolio" }]}
    >
      <LinkGrid
        items={[
          { title: "Brands & Businesses", to: "/portfolio/brands-businesses", desc: "Ventures I've founded or led." },
          { title: "Websites", to: "/portfolio/websites", desc: "Design and development work." },
          { title: "Creative Projects", to: "/portfolio/creative-projects", desc: "Visuals, films and campaigns." },
          { title: "Gaming Life", to: "/portfolio/gaming-life", desc: "From social gaming to creation." },
        ]}
      />
    </PageShell>
  );
}
