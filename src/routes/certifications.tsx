import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Bot,
  Briefcase,
  Code2,
  Globe,
  LineChart,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Usman Jatoi" },
      {
        name: "description",
        content:
          "Professional certifications earned by Usman Jatoi across marketing, design, development, automation, and AI.",
      },
      { property: "og:title", content: "Certifications — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Verified certifications across marketing, design, engineering, automation, and AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificationsPage,
});

type Cert = {
  year: string;
  title: string;
  issuer: string;
  category: string;
  desc: string;
  Icon: LucideIcon;
  credentialId?: string;
};

const certifications: Cert[] = [
  {
    year: "2026",
    title: "Advanced Prompt Engineering",
    issuer: "DeepLearning.AI",
    category: "AI",
    desc: "Advanced techniques for designing, evaluating, and shipping production-grade LLM prompts and agents.",
    Icon: Bot,
    credentialId: "DLAI-2026-PE",
  },
  {
    year: "2025",
    title: "Google Ads Search Certification",
    issuer: "Google",
    category: "Marketing",
    desc: "Certified in creating, managing, and optimizing Google Search advertising campaigns.",
    Icon: Search,
    credentialId: "GOOG-ADS-25",
  },
  {
    year: "2025",
    title: "Meta Certified Media Buying Professional",
    issuer: "Meta",
    category: "Marketing",
    desc: "Advanced ads buying and optimization across Facebook, Instagram, and Messenger.",
    Icon: Megaphone,
    credentialId: "META-MBP-25",
  },
  {
    year: "2025",
    title: "HubSpot Inbound Marketing",
    issuer: "HubSpot Academy",
    category: "Marketing",
    desc: "Full-funnel inbound strategy across content, SEO, email, and marketing automation.",
    Icon: LineChart,
  },
  {
    year: "2024",
    title: "Automation Pro",
    issuer: "Make (Integromat)",
    category: "Automation",
    desc: "Advanced no-code automation across APIs, webhooks, and multi-scenario workflows.",
    Icon: Workflow,
  },
  {
    year: "2024",
    title: "n8n Advanced Workflows",
    issuer: "n8n Academy",
    category: "Automation",
    desc: "Building self-hosted, complex automation flows with custom nodes and integrations.",
    Icon: Workflow,
  },
  {
    year: "2024",
    title: "React & Modern Frontend",
    issuer: "Meta / Coursera",
    category: "Development",
    desc: "Production-grade React, hooks, state management, and modern build tooling.",
    Icon: Code2,
  },
  {
    year: "2024",
    title: "UI/UX Design Specialization",
    issuer: "Google",
    category: "Design",
    desc: "End-to-end UX research, wireframing, prototyping, and usability testing.",
    Icon: Palette,
  },
  {
    year: "2023",
    title: "Shopify Partner Certified",
    issuer: "Shopify",
    category: "E-commerce",
    desc: "Store setup, theme customization, app integration, and merchant success workflows.",
    Icon: ShoppingBag,
  },
  {
    year: "2023",
    title: "SEO Fundamentals & Technical SEO",
    issuer: "SEMrush Academy",
    category: "SEO",
    desc: "On-page, off-page, and technical SEO — including audits, crawlability, and Core Web Vitals.",
    Icon: Globe,
  },
  {
    year: "2023",
    title: "WordPress Development",
    issuer: "Elementor Academy",
    category: "Development",
    desc: "Advanced WordPress theming, custom widgets, and page-builder-driven site delivery.",
    Icon: Code2,
  },
  {
    year: "2022",
    title: "Business & Entrepreneurship",
    issuer: "Wharton Online",
    category: "Business",
    desc: "Foundations of running a modern business — finance, operations, and go-to-market.",
    Icon: Briefcase,
  },
];

const stats = [
  { value: "12+", label: "Certifications earned" },
  { value: "8", label: "Global issuers" },
  { value: "6", label: "Disciplines covered" },
  { value: "100%", label: "Verified credentials" },
];

const categories = [
  { label: "AI", Icon: Bot },
  { label: "Marketing", Icon: Megaphone },
  { label: "Automation", Icon: Workflow },
  { label: "Development", Icon: Code2 },
  { label: "Design", Icon: Palette },
  { label: "E-commerce", Icon: ShoppingBag },
  { label: "SEO", Icon: Globe },
  { label: "Business", Icon: Briefcase },
];

function CertificationsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <PageHero
        eyebrow="Certifications"
        title="Verified skills. Real credentials."
        description="A curated list of professional certifications earned across marketing, design, engineering, automation, and AI — from issuers the industry actually trusts."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Certifications" },
        ]}
        size="md"
      />

      {/* Stats */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-16 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
                {s.value}
              </div>
              <div className="mt-2 text-xs font-medium text-neutral-500 uppercase tracking-[0.14em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto pb-16">
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 rounded-full px-3 py-1">
            Disciplines
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-800"
            >
              <Icon className="h-4 w-4 text-neutral-500" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 rounded-full px-3 py-1">
            Credentials
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
            Every certificate, verified
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((c, i) => {
            const Icon = c.Icon;
            return (
              <article
                key={i}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block text-[10px] font-semibold tracking-[0.14em] uppercase bg-neutral-900 text-white rounded-full px-2.5 py-0.5">
                        {c.category}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {c.year}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                        <BadgeCheck className="h-3 w-3" aria-hidden />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight leading-snug">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-neutral-600">
                      {c.issuer}
                    </p>
                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                      {c.desc}
                    </p>
                    {c.credentialId && (
                      <p className="mt-3 text-[11px] font-mono text-neutral-400">
                        Credential ID: {c.credentialId}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 bg-white rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Put it to work
          </span>
          <h3 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
            Skills on paper, proven in projects
          </h3>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Certifications are one thing. Shipping is another. Let's put every
            one of these to work on your next launch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact-me"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition"
            >
              Start a project
            </Link>
            <Link
              to="/awards"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white text-neutral-900 px-5 py-2.5 text-sm font-semibold hover:border-neutral-900 transition"
            >
              <Award className="h-4 w-4" aria-hidden />
              See awards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
