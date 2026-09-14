import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

const URL = "https://usmanjatoi.com/shop/NuvoxDigitalStudio";

const INCLUDES = [
  "Brand-ready website build with clean, fast pages",
  "Search-friendly structure, titles and descriptions",
  "Content layout that turns visits into enquiries",
  "Analytics and lead tracking wired from day one",
  "Handover notes so your team can keep shipping",
];

const FAQS = [
  {
    q: "What is Nuvox Digital Studio?",
    a: "A packaged studio engagement covering design, build and search visibility for a growing business site.",
  },
  {
    q: "How long does it take?",
    a: "Most builds run two to four weeks depending on page count and how ready your content is.",
  },
  {
    q: "How do I get started?",
    a: "Send a short brief through the contact page and you will get scope, timeline and pricing back.",
  },
];

export const Route = createFileRoute("/shop_/NuvoxDigitalStudio")({
  head: () => ({
    meta: [
      { title: "Nuvox Digital Studio — Usman Jatoi" },
      {
        name: "description",
        content:
          "Nuvox Digital Studio: a done-for-you website, content and search package built to bring in qualified enquiries.",
      },
      { property: "og:title", content: "Nuvox Digital Studio — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "A done-for-you website, content and search package built to bring in qualified enquiries.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: NuvoxPage,
});

function NuvoxPage() {
  return (
    <PageShell
      eyebrow="Store"
      title="Nuvox Digital Studio"
      description="A done-for-you website, content and search package built to bring in qualified enquiries."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Shop", to: "/shop" },
        { label: "Nuvox Digital Studio" },
      ]}
    >
      <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-6 text-white md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
          Studio Package
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Everything your site needs, shipped as one clean build
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          Strategy, design, build and search groundwork handled together, so your
          pages launch fast and start earning attention straight away.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/contact-me"
            className="inline-flex items-center rounded-full bg-[#FF6A00] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Request pricing
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black"
          >
            Back to shop
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          What&rsquo;s included
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {INCLUDES.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          Questions
        </h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            >
              <summary className="cursor-pointer text-sm font-semibold text-neutral-950">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-7 text-neutral-700">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </PageShell>
  );
}
