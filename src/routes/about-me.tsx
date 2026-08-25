import { createFileRoute } from "@tanstack/react-router";
import { PageShell, LinkGrid } from "../components/PageShell";

export const Route = createFileRoute("/about-me")({
    head: () => ({
    meta: [
      { title: "About Me — Usman Jatoi" },
      { name: "description", content: "Get to know Usman Jatoi — journey, personal life, vision, values and social presence." },
      { property: "og:title", content: "About Me — Usman Jatoi" },
      { property: "og:description", content: "Get to know Usman Jatoi — journey, personal life, vision, values and social presence." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/about-me" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/about-me" }],
  }),
  component: () => (
    <PageShell
      eyebrow="About"
      title="About Me"
      description="Educator, entrepreneur and full-stack digital strategist. Explore the story, values and the network behind the work."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "About Me" }]}
    >
      <LinkGrid
        items={[
          { title: "My Journey", desc: "Career milestones and turning points.", to: "/about-me/my-journey" },
          { title: "Personal Life", desc: "Life outside of the screen.", to: "/about-me/personal-life" },
          { title: "Vision & Values", desc: "The principles that guide the work.", to: "/about-me/vision-values" },
          { title: "Social Media", desc: "60+ authoritative digital hubs.", to: "/about-me/social-media" },
        ]}
      />
    </PageShell>
  ),
});
