import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import Carousel from "@/components/Carousel";
import ServiceCover from "@/components/ServiceCover";
import serviceContent from "@/data/services-content.json";
import { getLocalImportOverview } from "@/lib/wp-content-stats.functions";

const SITE_ORIGIN = "https://usmanjatoi.com";

export const Route = createFileRoute("/services/")({
  loader: async () => getLocalImportOverview(),
  head: () => ({
    meta: [
      { title: "Services — AI, SEO, Web & Creative | Usman Jatoi" },
      {
        name: "description",
        content:
          "Hire Usman Jatoi for AI automation, bulk publishing, SEO & marketing, web design and development, creative, Web3 and more — 25+ specialist service lines, delivered end to end.",
      },
      { property: "og:title", content: "Services — AI, SEO, Web & Creative | Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Browse 25+ specialist service lines: AI automation, bulk publishing, SEO, web design & development, creative, Web3, consulting and more.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/services` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — AI, SEO, Web & Creative | Usman Jatoi" },
      {
        name: "twitter:description",
        content:
          "25+ specialist service lines: AI automation, bulk publishing, SEO, web, creative, Web3 and more.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/services` }],
  }),
  component: ServicesPage,
});

/* ------------------------------------------------------------------ data */

type RawService = {
  slug: string;
  title: string;
  h1?: string;
  paragraphs?: string[];
  bullets?: string[];
};

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Editorial overrides so every card reads like a real offer, not a slug. */
const META: Record<string, { name: string; group: string; promise: string }> = {
  ai: {
    name: "AI Automation & Agents",
    group: "AI & Automation",
    promise: "Custom AI workflows, agents and RAG systems that remove manual work.",
  },
  "bulk-publishing": {
    name: "Bulk & Programmatic Publishing",
    group: "Content",
    promise: "Publish hundreds of SEO-ready pages from structured data, with quality gates.",
  },
  consulting: {
    name: "Digital Consulting",
    group: "Strategy",
    promise: "A senior second opinion on strategy, stack, hiring and roadmap.",
  },
  content: {
    name: "Content Strategy & Writing",
    group: "Content",
    promise: "Research-led content that answers real search intent and converts.",
  },
  conversion: {
    name: "Conversion Optimization",
    group: "Growth",
    promise: "Landing page, funnel and copy work aimed at measurable lift.",
  },
  creative: {
    name: "Creative, Design & Video",
    group: "Creative",
    promise: "Brand systems, thumbnails, motion, video edits and 3D visuals.",
  },
  digital: {
    name: "Digital Transformation",
    group: "Strategy",
    promise: "Move offline processes into clean, automated digital workflows.",
  },
  dubbing: {
    name: "Dubbing & Localization",
    group: "Creative",
    promise: "Multi-language voice, subtitles and localized creative for global reach.",
  },
  game: {
    name: "Game & Interactive",
    group: "Creative",
    promise: "Game assets, community building and interactive experiences.",
  },
  investment: {
    name: "Investment Support",
    group: "Business",
    promise: "Decks, data rooms, research and outreach for raising or deploying capital.",
  },
  "lead-generaton": {
    name: "Lead Generation",
    group: "Growth",
    promise: "Scraped, verified lists plus multichannel outreach that books calls.",
  },
  legal: {
    name: "Legal & Compliance Support",
    group: "Business",
    promise: "Policies, contracts groundwork and compliance-safe content workflows.",
  },
  management: {
    name: "Project & Team Management",
    group: "Business",
    promise: "Ship complex projects with clear owners, sprints and reporting.",
  },
  marketing: {
    name: "SEO & Marketing",
    group: "Growth",
    promise: "Keyword maps, on-page SEO, digital PR and campaigns that compound.",
  },
  monetization: {
    name: "Monetization",
    group: "Growth",
    promise: "Ads, affiliates, products and offers turned into repeatable revenue.",
  },
  operations: {
    name: "Operations",
    group: "Business",
    promise: "SOPs, tooling and automation that make delivery predictable.",
  },
  pr: {
    name: "PR & Press Coverage",
    group: "Growth",
    promise: "Press releases, placements and founder positioning in real publications.",
  },
  product: {
    name: "Product Development",
    group: "Build",
    promise: "From idea to shipped MVP with a stack you can actually maintain.",
  },
  researching: {
    name: "Research & Analysis",
    group: "Strategy",
    promise: "Market, competitor and keyword research you can make decisions on.",
  },
  security: {
    name: "Security & Hardening",
    group: "Build",
    promise: "Site hardening, access hygiene and safer AI/data practices.",
  },
  "social-media": {
    name: "Social Media",
    group: "Growth",
    promise: "Channel strategy, content calendars and creative that keeps shipping.",
  },
  startup: {
    name: "Startup Support",
    group: "Business",
    promise: "Early-stage builders: brand, site, GTM and first growth loops.",
  },
  supports: {
    name: "Ongoing Support & Retainers",
    group: "Business",
    promise: "Maintenance, monitoring and a person who answers when things break.",
  },
  "technical-skills": {
    name: "Technical Skills & Engineering",
    group: "Build",
    promise: "Scripting, integrations, APIs and the glue between your tools.",
  },
  training: {
    name: "Training & Workshops",
    group: "Strategy",
    promise: "Hands-on team training on AI, SEO and modern content workflows.",
  },
  web: {
    name: "Website Design & Development",
    group: "Build",
    promise: "Fast, custom sites in WordPress, Shopify, Webflow or modern React.",
  },
  web3: {
    name: "Web3 & Blockchain",
    group: "Build",
    promise: "Token, NFT and community projects handled with a practical head.",
  },
};

const ALL: RawService[] = Object.values(serviceContent as Record<string, RawService>);

type Card = {
  slug: string;
  path: string;
  name: string;
  group: string;
  promise: string;
  intro: string;
  bullets: string[];
};

const CARDS: Card[] = ALL.map((s) => {
  const meta = META[s.slug];
  return {
    slug: s.slug,
    path: `/services/${s.slug}`,
    name: meta?.name ?? decodeHtml(s.title),
    group: meta?.group ?? "Services",
    promise: meta?.promise ?? decodeHtml(s.h1 ?? s.title),
    intro: decodeHtml(s.paragraphs?.[0] ?? meta?.promise ?? ""),
    bullets: (s.bullets ?? []).slice(0, 3).map(decodeHtml),
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const GROUPS = ["All", ...Array.from(new Set(CARDS.map((c) => c.group))).sort()];

const FEATURED = [
  "ai",
  "marketing",
  "web",
  "bulk-publishing",
  "creative",
  "content",
  "lead-generaton",
  "web3",
]
  .map((slug) => CARDS.find((c) => c.slug === slug))
  .filter(Boolean) as Card[];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We talk through the goal, the constraint and what's already been tried. No template intake forms.",
  },
  {
    step: "02",
    title: "Scope & plan",
    body: "Clear phases, honest timeline and real trade-offs — before anyone touches a keyboard.",
  },
  {
    step: "03",
    title: "Build",
    body: "Weekly progress, working demos and a shared workspace so you're never guessing.",
  },
  {
    step: "04",
    title: "Ship & support",
    body: "Handover with docs and a runbook, plus optional retainers when you want me to stay on.",
  },
];

const FAQS = [
  {
    q: "How do I hire you for one of these services?",
    a: "Send a short brief through the contact page — the goal, the deadline and what you've already tried. You'll get a real reply with scope and honest timing within 1–2 business days.",
  },
  {
    q: "Do you take small, one-off projects?",
    a: "Yes. Single automations, one landing page, a batch of thumbnails or a short campaign are all fine as long as the scope is clear.",
  },
  {
    q: "Can you work alongside our in-house team?",
    a: "Yes. I've led teams of 19+ and also drop into existing squads as an embedded specialist on a weekly cadence.",
  },
  {
    q: "Do you offer white-label delivery for agencies?",
    a: "Yes — agencies and studios resell these service lines under their own brand. See the white-label partnership page for how it works.",
  },
  {
    q: "Which services work best together?",
    a: "Most clients pair a build service (web, product) with a growth service (SEO & marketing, content, lead generation). Automation is usually added once the workflow is proven.",
  },
];

/* ------------------------------------------------------------- component */

function ServicesPage() {
  const overview = Route.useLoaderData();
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const line of overview.serviceLines ?? []) map[line.slug] = line.count;
    return map;
  }, [overview]);

  const [q, setQ] = useState("");
  const [group, setGroup] = useState("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CARDS.filter((c) => {
      if (group !== "All" && c.group !== group) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        c.slug.includes(needle) ||
        c.promise.toLowerCase().includes(needle)
      );
    });
  }, [q, group]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Services by Usman Jatoi",
        numberOfItems: CARDS.length,
        itemListElement: CARDS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          description: c.promise,
          url: `${SITE_ORIGIN}${c.path}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        eyebrow="Services · Full-stack digital"
        title="Ideas, built into working systems."
        description={`${CARDS.length} specialist service lines — AI automation, SEO and marketing, web, creative, Web3 and business support. Browse the catalog, pick a lane, and get a real scope back.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-14 flex flex-wrap gap-3">
          <Link
            to="/contact-me"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Start a project
          </Link>
          <Link
            to="/white-label-partnership"
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
          >
            White-label partnership
          </Link>
        </div>

        {/* Featured carousel */}
        <section aria-labelledby="featured-services">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
                Most requested
              </span>
              <h2 id="featured-services" className="mt-3 text-2xl font-semibold sm:text-3xl">
                Featured services
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                The eight lanes clients start with most often. Swipe through, or search the full
                catalog below.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Carousel ariaLabel="Featured services">
              {FEATURED.map((c, i) => (
                <ServiceCard key={c.slug} card={c} count={counts[c.slug] ?? 0} eager={i < 2} />
              ))}
            </Carousel>
          </div>
        </section>

        {/* Full catalog */}
        <section aria-labelledby="all-services" className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="all-services" className="text-2xl font-semibold sm:text-3xl">
                All {CARDS.length} services
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Every service line, with what's included and where it fits. Each card opens a full
                page with scope, deliverables and examples.
              </p>
            </div>
            <label className="relative w-full max-w-xs">
              <span className="sr-only">Search services</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services…"
                className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-neutral-900"
              />
            </label>
          </div>

          <div
            className="mt-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter services by category"
          >
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  group === g
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <ServiceCard key={c.slug} card={c} count={counts[c.slug] ?? 0} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
                No services match “{q}”. Try “SEO”, “AI” or “web”.
              </p>
            )}
          </div>
        </section>

        {/* Process */}
        <section aria-labelledby="how-it-works" className="mt-20">
          <h2 id="how-it-works" className="text-2xl font-semibold sm:text-3xl">
            How working together looks
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="font-mono text-xs text-[#ff6a00]">{p.step}</div>
                <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="services-faq" className="mt-20">
          <h2 id="services-faq" className="text-2xl font-semibold sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-neutral-900">
                  {f.q}
                  <span className="text-neutral-900 transition group-open:rotate-180" aria-hidden>
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-neutral-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Have something in mind? Let's talk.</h2>
          <p className="mt-2 text-neutral-700">
            Send a short brief — goal, timeline and what's been tried so far. You'll get a real
            reply, not a form response.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact me
            </Link>
            <Link
              to="/my-testimonials"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See testimonials
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function ServiceCard({ card, count, eager }: { card: Card; count: number; eager?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-xl">
      <a href={card.path} className="block" aria-label={`${card.name} — view service details`}>
        <ServiceCover title={card.name} kicker={card.group} slug={card.slug} eager={eager} />
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
            {card.group}
          </span>
          {count > 0 && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              {count} pages
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug">
          <a href={card.path} className="hover:underline">
            {card.name}
          </a>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{card.promise}</p>
        {card.bullets.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {card.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-neutral-600">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ff6a00]" aria-hidden />
                <span className="line-clamp-2">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
          <a
            href={card.path}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-[#ff6a00]"
          >
            View service <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <Link
            to="/contact-me"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
