import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers - Usman Jatoi" },
      {
        name: "description",
        content:
          "Remote-first roles and collaboration opportunities across design, development, content and automation.",
      },
      { property: "og:title", content: "Careers - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

const roles = [
  ["Product Designer", "Design systems, pages, brand visuals and UI details."],
  ["Full-Stack Developer", "React, WordPress, Shopify, tools, automations and site systems."],
  ["Content Producer", "Short-form video, social posts, case studies and documentation."],
  ["Automation Specialist", "n8n, Make, APIs, data cleanup and internal workflows."],
];

function CareersPage() {
  return (
    <PageShell
      eyebrow="Others"
      title="Careers"
      description="Remote-first work with a small, practical team that ships websites, content, tools and automation."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Careers" }]}
    >
      <section className="grid gap-4 md:grid-cols-2">
        {roles.map(([title, body]) => (
          <article key={title} className="rounded-lg border border-neutral-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Open path
            </p>
            <h2 className="mt-3 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
            <a
              href={`mailto:careers@usmanjatoi.com?subject=${encodeURIComponent(title)}`}
              className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Apply by email
            </a>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
