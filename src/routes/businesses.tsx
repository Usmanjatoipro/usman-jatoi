import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/businesses")({
    head: () => ({
    meta: [
      { title: "Businesses & Ventures — Usman Jatoi" },
      { name: "description", content: "Portfolio of commercial operations, digital platforms, and ventures." },
      { property: "og:title", content: "Businesses & Ventures — Usman Jatoi" },
      { property: "og:description", content: "Portfolio of commercial operations, digital platforms, and ventures." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/businesses" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/businesses" }],
  }),
  component: BusinessesPage,
});

const businesses = [
  {
    name: "Redsglow",
    label: "Creative agency",
    logo: "/site-assets/Redsglow-Logo.png",
    href: "https://redsglow.com",
    body: "The flagship creative and technology agency for websites, branding, automation and digital launches.",
  },
  {
    name: "UJ Online",
    label: "Digital products",
    logo: "/site-assets/UJonline-Minimal-Logo.png",
    body: "A home for practical creator tools, templates, experiments and small products.",
  },
  {
    name: "RabbitFlare",
    label: "Automation",
    logo: "/site-assets/RabbitFlare-Logo.png",
    body: "Automation and AI workflow systems for lean teams that want faster operations.",
  },
  {
    name: "Usama 2.0",
    label: "Content lab",
    logo: "/site-assets/Usama-2.0-Logo.png",
    body: "A personal content and storytelling brand for creative experiments and public learning.",
  },
];

function BusinessesPage() {
  return (
    <PageShell
      eyebrow="Others"
      title="Business I Own"
      description="A practical map of the brands, ventures and product experiments I operate."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Business I Own" }]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {businesses.map((business) => (
          <article
            key={business.name}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <img
                  src={business.logo}
                  alt={`${business.name} logo`}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {business.label}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{business.name}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{business.body}</p>
              </div>
            </div>
            {business.href && (
              <a
                href={business.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Visit {business.name}
              </a>
            )}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
