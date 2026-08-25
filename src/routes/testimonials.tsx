import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/testimonials")({
    head: () => ({
    meta: [
      { title: "Testimonials & Reviews — Usman Jatoi" },
      { name: "description", content: "What clients, founders, and partners say about working with Usman Jatoi." },
      { property: "og:title", content: "Testimonials & Reviews — Usman Jatoi" },
      { property: "og:description", content: "What clients, founders, and partners say about working with Usman Jatoi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/testimonials" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/testimonials" }],
  }),
  component: TestimonialsPage,
});

const testimonials = [
  "Reliable delivery across website, content and automation work.",
  "Clear communication and practical problem solving.",
  "Strong creative taste with hands-on technical execution.",
];

function TestimonialsPage() {
  return (
    <PageShell
      eyebrow="Trust and Proof"
      title="Testimonials"
      description="Feedback and working proof from clients, collaborators and teams."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Testimonials" }]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((quote) => (
          <blockquote key={quote} className="rounded-lg border border-neutral-200 bg-white p-5 text-sm leading-6 text-neutral-700">
            "{quote}"
          </blockquote>
        ))}
      </div>
    </PageShell>
  );
}
