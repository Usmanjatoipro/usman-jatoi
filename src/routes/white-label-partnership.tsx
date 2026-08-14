import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/white-label-partnership")({
  head: () => ({
    meta: [
      { title: "White Label Partnership - Usman Jatoi" },
      {
        name: "description",
        content:
          "White-label design, development, SEO, content and automation support for agencies.",
      },
      { property: "og:title", content: "White Label Partnership - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhiteLabelPage,
});

const offers = [
  "Website design and development",
  "SEO and content support",
  "Automation and internal tools",
  "Creative production and brand assets",
];

function WhiteLabelPage() {
  return (
    <PageShell
      eyebrow="Trust and Proof"
      title="White Label Partnership"
      description="Behind-the-scenes delivery support for agencies that need reliable creative and technical execution."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "White Label Partnership" }]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => (
          <div key={offer} className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-medium">
            {offer}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
