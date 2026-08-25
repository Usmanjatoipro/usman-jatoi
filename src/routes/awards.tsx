import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/awards")({
    head: () => ({
    meta: [
      { title: "Awards & Honors — Usman Jatoi" },
      { name: "description", content: "Industry recognition, digital awards, and milestones achieved." },
      { property: "og:title", content: "Awards & Honors — Usman Jatoi" },
      { property: "og:description", content: "Industry recognition, digital awards, and milestones achieved." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/awards" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/awards" }],
  }),
  component: AwardsPage,
});

const awards = [
  ["Devpost", "Hackathon and builder recognition."],
  ["Design Recognition", "Visual design, creative systems and public portfolio work."],
  ["Client Proof", "Results and delivery across websites, automation and content."],
];

function AwardsPage() {
  return (
    <PageShell
      eyebrow="Trust and Proof"
      title="Awards"
      description="Recognition, proof points and public signals around the work."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Awards" }]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {awards.map(([title, body]) => (
          <article key={title} className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
