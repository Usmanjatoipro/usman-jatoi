import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/press-release")({
  head: () => ({
    meta: [
      { title: "Press Release - Usman Jatoi" },
      {
        name: "description",
        content:
          "Official press release page for news, launches and public updates from Usman Jatoi.",
      },
      { property: "og:title", content: "Press Release - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
