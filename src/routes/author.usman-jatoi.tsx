import { createFileRoute, Link } from "@tanstack/react-router";

const SAME_AS = [
  "https://www.instagram.com/usmanjatoipro/",
  "https://www.facebook.com/Muhd.Usman418/",
  "https://www.linkedin.com/in/usman-jatoi-pro/",
  "https://twitter.com/UsmanJatoiPro",
  "https://www.youtube.com/@UsmanJatoi",
];

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://usmanjatoi.com/#person",
  name: "Usman Jatoi",
  url: "https://usmanjatoi.com/author/usman-jatoi",
  jobTitle: "SEO Consultant, WordPress Engineer & Digital Growth Strategist",
  description:
    "Usman Jatoi is a digital growth strategist specialising in SEO, WordPress engineering, AI-assisted content operations and marketplace-scale publishing.",
  knowsAbout: [
    "Search engine optimisation",
    "Technical SEO",
    "WordPress development",
    "Content strategy",
    "AI research and innovation",
    "Programmatic SEO",
  ],
  sameAs: SAME_AS,
  worksFor: {
    "@type": "Organization",
    "@id": "https://usmanjatoi.com/#organization",
    name: "Usman Jatoi",
    url: "https://usmanjatoi.com/",
  },
};

const CREDENTIALS = [
  {
    title: "Experience",
    body: "A decade of hands-on work shipping SEO programs, WordPress platforms and content systems for founders, agencies and product teams across 20+ countries.",
  },
  {
    title: "Expertise",
    body: "Technical SEO audits, information architecture at 20k+ URL scale, entity and topical authority modelling, and AI-assisted editorial workflows.",
  },
  {
    title: "Authoritativeness",
    body: "Published guides, award recognitions and client case studies referenced across the services and portfolio sections of this site.",
  },
  {
    title: "Trust",
    body: "Every article states who wrote it, when it was last reviewed, and which sources were consulted. Corrections are welcome via the contact form.",
  },
];

export const Route = createFileRoute("/author/usman-jatoi")({
  head: () => ({
    meta: [
      { title: "Usman Jatoi — Author, SEO Consultant & WordPress Engineer" },
      {
        name: "description",
        content:
          "About Usman Jatoi: experience, expertise, credentials and contact details behind every article and service page on usmanjatoi.com.",
      },
      { property: "og:title", content: "Usman Jatoi — Author & SEO Consultant" },
      {
        property: "og:description",
        content:
          "Experience, expertise, authoritativeness and trust signals for the author behind usmanjatoi.com.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { rel: "canonical", href: "/author/usman-jatoi" },
    ],
    links: [{ rel: "canonical", href: "/author/usman-jatoi" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(PERSON) }],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  return (
    <main className="bg-white text-black">
      <section className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <nav className="text-xs uppercase tracking-[0.2em] text-white/60">
            <Link to="/">Home</Link> <span className="mx-2">/</span> Author
          </nav>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Usman Jatoi</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            SEO consultant, WordPress engineer and digital growth strategist. I write and review
            every guide published on this site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              to="/call"
              className="rounded-full px-5 py-2 font-medium text-black"
              style={{ background: "#FF6A00", color: "#fff" }}
            >
              Book a call
            </Link>
            <Link to="/contact-me" className="rounded-full border border-white/30 px-5 py-2">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">Why you can trust this content</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {CREDENTIALS.map((c) => (
            <article key={c.title} className="rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{c.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Elsewhere</h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {SAME_AS.map((href) => (
            <li key={href}>
              <a
                className="rounded-full border border-neutral-300 px-4 py-2 hover:border-neutral-900"
                href={href}
                target="_blank"
                rel="me noreferrer"
              >
                {new URL(href).hostname.replace("www.", "")}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
