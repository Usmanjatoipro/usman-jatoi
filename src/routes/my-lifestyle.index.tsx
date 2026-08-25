import { createFileRoute } from "@tanstack/react-router";
import { LinkGrid, PageShell } from "../components/PageShell";

export const Route = createFileRoute("/my-lifestyle/")({
    head: () => ({
    meta: [
      { title: "My Lifestyle — Usman Jatoi" },
      { name: "description", content: "Mindset, wellness routines, hobbies, and personal philosophy." },
      { property: "og:title", content: "My Lifestyle — Usman Jatoi" },
      { property: "og:description", content: "Mindset, wellness routines, hobbies, and personal philosophy." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/my-lifestyle" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/my-lifestyle" }],
  }),
  component: LifestylePage,
});

function LifestylePage() {
  return (
    <PageShell
      eyebrow="Lifestyle"
      title="My Lifestyle"
      description="Focused work, real health, hobbies, learning and the life around the projects."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "My Lifestyle" }]}
    >
      <LinkGrid
        items={[
          {
            title: "Gaming Life",
            to: "/my-lifestyle/gaming-life",
            desc: "Fun, friends and the way gaming connects back to creativity.",
          },
          {
            title: "Fitness & Health",
            to: "/my-lifestyle/fitness-health",
            desc: "An honest look at energy, body, routine and improvement.",
          },
          {
            title: "Hobbies",
            to: "/my-lifestyle/hobbies",
            desc: "Art, photography, storytelling, travel and experiments.",
          },
        ]}
      />
    </PageShell>
  );
}
