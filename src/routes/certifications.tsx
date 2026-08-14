import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications - Usman Jatoi" },
      {
        name: "description",
        content:
          "Certifications and learning proof across AI, marketing, web, creative and technical work.",
      },
      { property: "og:title", content: "Certifications - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificationsPage,
});

const certificates = [
  "Google learning and platform credentials",
  "HubSpot inbound and marketing systems",
  "Design, development and product-learning certificates",
  "AI, automation and research-based training",
];

function CertificationsPage() {
  return (
    <PageShell
      eyebrow="Trust and Proof"
      title="Certifications"
      description="A clean archive of learning proof, practical credentials and platform certificates."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Certifications" }]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {certificates.map((item) => (
          <div key={item} className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-medium">
            {item}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
