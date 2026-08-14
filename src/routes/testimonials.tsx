import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials - Usman Jatoi" },
      {
        name: "description",
        content:
          "Testimonials and feedback from clients, partners and collaborators who worked with Usman Jatoi.",
      },
      { property: "og:title", content: "Testimonials - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
