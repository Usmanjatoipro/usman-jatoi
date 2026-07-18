import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/about-me/personal-life")({
  head: () => ({
    meta: [
      { title: "Personal Life — Usman Jatoi" },
      { name: "description", content: "Family, faith, friendships and the routines that keep the work grounded." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="About"
      title="Personal Life"
      description="The people, places and quiet rituals behind the public work."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "About Me", to: "/about-me" }, { label: "Personal Life" }]}
    />
  ),
});
