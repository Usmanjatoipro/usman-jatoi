import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/press-release")({
    head: () => ({
    meta: [
      { title: "Press Releases & Media — Usman Jatoi" },
      { name: "description", content: "Official press announcements, company news, and public updates." },
      { property: "og:title", content: "Press Releases & Media — Usman Jatoi" },
      { property: "og:description", content: "Official press announcements, company news, and public updates." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/press-release" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/press-release" }],
  }),
  component: PressReleasePage,
});

function PressReleasePage() {
  return (
    <PageShell
      eyebrow="Trust and Proof"
      title="Press Release"
      description="Official news, launch notes and media-ready updates from Usman Jatoi."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Press Release" }]}
    />
  );
}
