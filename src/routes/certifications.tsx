import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/certifications")({
    head: () => ({
    meta: [
      { title: "Certifications & Credentials — Usman Jatoi" },
      { name: "description", content: "Professional certifications across development, cloud platforms, and digital marketing." },
      { property: "og:title", content: "Certifications & Credentials — Usman Jatoi" },
      { property: "og:description", content: "Professional certifications across development, cloud platforms, and digital marketing." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/certifications" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/certifications" }],
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
