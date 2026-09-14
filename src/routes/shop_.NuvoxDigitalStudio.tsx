import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Code2,
  Layers,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";

const PAGE_URL = "https://usmanjatoi.com/shop/NuvoxDigitalStudio";
const OG_IMAGE = "https://usmanjatoi.com/site-assets/Screenshot-2025-05-09-165038-1536x636.jpg";

const SHOWCASE_TABS = [
  {
    id: "desktop",
    title: "Desktop Experience",
    subtitle: "High-Converting Hero & Structure",
    image: "/site-assets/Screenshot-2025-05-09-165038-1536x636.jpg",
    alt: "Nuvox Digital Studio Desktop Layout",
  },
  {
    id: "mobile",
    title: "Mobile-First UX",
    subtitle: "Fluid Navigation on All Devices",
    image: "/site-assets/Phone-Mockup-1.jpg",
    alt: "Nuvox Mobile View Mockup",
  },
  {
    id: "performance",
    title: "Search & Speed Engine",
    subtitle: "Sub-Second Page Loads & Schemas",
    image: "/site-assets/Tools-Redsglow.png",
    alt: "Nuvox Speed and Performance Tools",
  },
  {
    id: "architecture",
    title: "Production Architecture",
    subtitle: "Tailored React, Vite & Edge Deploy",
    image: "/site-assets/2024-07-23-145529-desktop-1-10.png",
    alt: "Nuvox Production Architecture",
  },
];

const METRICS = [
  { value: "2–4 Weeks", label: "Turnkey Sprint Delivery" },
  { value: "100%", label: "Code & Asset Ownership" },
  { value: "Zero", label: "Technical Debt & Bloat" },
  { value: "End-to-End", label: "Design, Dev & SEO" },
];

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Engineered for Conversion",
    description:
      "Purpose-built visual hierarchy, psychological lead hooks, and friction-free inquiry flows that transform passive page visitors into high-intent enquiries.",
  },
  {
    icon: Search,
    title: "Programmatic & Technical SEO",
    description:
      "Built with valid Schema.org markup, semantic HTML5, automated XML sitemaps, and optimized crawl paths to earn and keep organic Google rankings.",
  },
  {
    icon: Zap,
    title: "Blazing Fast Edge Speed",
    description:
      "Sub-second page loads powered by modern edge delivery, zero bloated plugins, optimized modern image formats, and 95+ Core Web Vitals.",
  },
  {
    icon: Code2,
    title: "Modern Modular Stack",
    description:
      "Built with React, Vite, and Tailwind CSS. Clean, maintainable component code that scales effortlessly with your brand without vendor lock-in.",
  },
  {
    icon: BarChart3,
    title: "Integrated Lead & Event Tracking",
    description:
      "Database-backed form capture (Supabase), conversion event tracking, automated email alerts, and analytics wired and tested before launch.",
  },
  {
    icon: ShieldCheck,
    title: "Complete IP & Repo Handover",
    description:
      "You receive 100% ownership of design assets, repository code, DNS setup, and deployment access, along with thorough handover documentation.",
  },
];

const INCLUSIONS_GROUPS = [
  {
    category: "Design & User Experience",
    items: [
      "Bespoke brand-aligned UI/UX tailored to your niche",
      "Mobile-first responsive layouts across desktop, tablet, and mobile",
      "Interactive component states, subtle motion, and clear typography",
      "Social proof showcases, testimonials, and trust badges",
    ],
  },
  {
    category: "Engineering & Architecture",
    items: [
      "Custom React 19 + Vite frontend architecture with Tailwind styling",
      "Lightning-fast routing and sub-second asset bundling",
      "Cloudflare / Edge production hosting and SSL configuration",
      "Zero vulnerable third-party plugins or page-builder bloat",
    ],
  },
  {
    category: "Search & Discoverability",
    items: [
      "Comprehensive on-page SEO: custom metadata, OpenGraph, and canonicals",
      "Rich JSON-LD structured data (Organization, Service, FAQ, Breadcrumbs)",
      "Automated XML sitemaps, robots.txt, and Search Console configuration",
      "Semantic heading hierarchy and fast image lazy-loading",
    ],
  },
  {
    category: "Conversion & Measurement",
    items: [
      "Direct database lead-capture pipeline with email notifications",
      "Anti-spam protection and form input validation",
      "Analytics event tracking for buttons, links, and forms",
      "Full video walkthrough and deployment handover documentation",
    ],
  },
];

const PACKAGES = [
  {
    name: "Studio Standard Sprint",
    timeline: "2–3 Weeks Delivery",
    tagline:
      "Ideal for growing businesses, creators, and professionals needing a high-performance modern web presence.",
    features: [
      "Up to 8 custom core pages (Home, About, Services, Case Studies, Contact)",
      "High-converting visual design with responsive mobile optimization",
      "Technical SEO foundation + Schema markup for all pages",
      "Contact form with direct database logging and notifications",
      "Domain DNS connection, SSL setup, and production deployment",
      "14 days of post-launch tuning and walkthrough guide",
    ],
    highlight: false,
    cta: "Request Standard Scope",
  },
  {
    name: "Studio Growth & Scale",
    timeline: "3–4 Weeks Delivery",
    tagline:
      "Comprehensive end-to-end digital ecosystem for aggressive organic reach, multiple service pillars, and lead capture.",
    features: [
      "Everything in Studio Standard Sprint",
      "Full dynamic CMS integration for blogs, services, or resource libraries",
      "Programmatic SEO architecture & cluster hubs",
      "Advanced lead capture funnel with tailored qualification fields",
      "Custom micro-interactions and interactive widgets",
      "Priority sprint timeline + 30 days of post-launch support",
    ],
    highlight: true,
    cta: "Request Growth Scope",
  },
];

const FAQS = [
  {
    q: "What is Nuvox Digital Studio?",
    a: "Nuvox Digital Studio is a packaged, done-for-you digital studio engagement by Usman Jatoi. It combines conversion-focused UI/UX design, modern full-stack web engineering, and search engine groundwork into a unified sprint that turns organic and referral traffic into paying clients.",
  },
  {
    q: "How long does a typical build take?",
    a: "Most Nuvox builds are completed in 2 to 4 weeks depending on the scope of pages and how readily available your brand assets and initial copy are. We work in disciplined weekly sprints with clear milestone reviews.",
  },
  {
    q: "What tech stack powers Nuvox sites?",
    a: "We build on modern, edge-ready tech stacks including React, Vite, Tailwind CSS, TanStack Router, and Supabase. This guarantees instant sub-second page loads, complete security, and zero dependencies on sluggish WordPress themes or fragile page-builder plugins.",
  },
  {
    q: "Do I get full ownership of the code and design?",
    a: "Yes. You receive 100% intellectual property ownership. Upon project completion, full Git repository access, hosting environment credentials, and DNS records are completely transferred to you with zero ongoing agency retainers or lock-ins.",
  },
  {
    q: "Can you migrate an existing WordPress or legacy website?",
    a: "Yes. We specialize in seamless migrations that preserve your existing URL rankings, transfer historic content and media, and configure permanent 301 redirects so you never lose search visibility or organic traffic.",
  },
  {
    q: "How do we get started?",
    a: "You can send a brief message through the direct inquiry form on this page, or schedule a free 30-minute discovery call. We review your goals, clarify scope and timeline, and provide a transparent, fixed-price proposal within 24 hours.",
  },
];

export const Route = createFileRoute("/shop_/NuvoxDigitalStudio")({
  head: () => ({
    meta: [
      { title: "Nuvox Digital Studio — Usman Jatoi" },
      {
        name: "description",
        content:
          "Nuvox Digital Studio: A done-for-you website, content architecture, and search engineering package built to convert visitors into qualified enquiries.",
      },
      { property: "og:title", content: "Nuvox Digital Studio — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "A done-for-you website, content architecture, and search engineering package built to convert visitors into qualified enquiries.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "Usman Jatoi" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nuvox Digital Studio — Usman Jatoi" },
      {
        name: "twitter:description",
        content:
          "A done-for-you website, content architecture, and search engineering package built to convert visitors into qualified enquiries.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: NuvoxProductPage,
});

function NuvoxProductPage() {
  const [activeTab, setActiveTab] = useState(SHOWCASE_TABS[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    packageChoice: "Studio Standard Sprint",
    message: "",
    website: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const currentShowcase = SHOWCASE_TABS.find((t) => t.id === activeTab) || SHOWCASE_TABS[0];

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setSubmitState("submitting");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: null,
        looking_for: `Nuvox Digital Studio: ${form.packageChoice}`,
        message: `Current website: ${form.website || "N/A"}\n\nProject details:\n${form.message.trim()}`,
        source_path: "/shop/NuvoxDigitalStudio",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });

      if (error) {
        throw error;
      }

      setSubmitState("success");
      setStatusMessage(
        "Thank you! Your inquiry has been received. Usman will reply within 24 hours.",
      );
      setForm({
        name: "",
        email: "",
        packageChoice: "Studio Standard Sprint",
        message: "",
        website: "",
      });
    } catch {
      // Graceful fallback to mailto
      const mailtoSubject = encodeURIComponent(
        `Inquiry: Nuvox Digital Studio (${form.packageChoice})`,
      );
      const mailtoBody = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPackage: ${form.packageChoice}\nWebsite: ${form.website || "N/A"}\n\nMessage:\n${form.message}`,
      );
      window.location.href = `mailto:contact@usmanjatoi.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      setSubmitState("success");
      setStatusMessage(
        "Your email client has been opened. Looking forward to discussing your project!",
      );
    }
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Nuvox Digital Studio",
    description:
      "A done-for-you website, content architecture, and search engineering package built to convert visitors into qualified enquiries.",
    image: OG_IMAGE,
    brand: {
      "@type": "Brand",
      name: "Usman Jatoi",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: "Usman Jatoi",
        url: "https://usmanjatoi.com",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Global Hero with Breadcrumbs */}
      <PageHero
        eyebrow="Studio Package"
        title="Nuvox Digital Studio"
        description="A full-stack, done-for-you website, content architecture, and search engineering sprint built to turn visits into qualified commercial enquiries."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Nuvox Digital Studio" },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6A00]/25 transition hover:bg-[#e55f00] hover:scale-[1.02]"
          >
            Request Project Scope
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/call"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15"
          >
            <Calendar className="h-4 w-4 text-[#FF6A00]" />
            Book 30-Min Call
          </Link>
        </div>
      </PageHero>

      {/* Key Metrics Bar */}
      <section className="border-b border-neutral-200 bg-neutral-950 py-8 text-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="border-l-2 border-[#FF6A00] pl-4">
                <div className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {m.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product-Focused Image & Interactive Showcase */}
      <section className="bg-neutral-900 py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
              Product Showcase
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Precision Engineering, Shipped as One Clean Build
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              Explore how every layer of the Nuvox Digital Studio package is crafted — from
              high-impact desktop layouts to sub-second edge performance and responsive touch
              experiences.
            </p>
          </div>

          {/* Interactive Switcher Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
            {SHOWCASE_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition md:px-5 md:py-2.5 md:text-sm ${
                    active
                      ? "bg-[#FF6A00] text-white shadow-md shadow-[#FF6A00]/20"
                      : "border border-white/10 bg-neutral-800 text-neutral-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          {/* Browser Mockup Device Container */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/80">
            {/* Window Topbar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/90 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950 px-4 py-1 text-xs text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono">usmanjatoi.com/shop/NuvoxDigitalStudio</span>
              </div>
              <div className="text-xs font-medium text-neutral-400">{currentShowcase.subtitle}</div>
            </div>

            {/* Showcase Image Area */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
              <img
                src={currentShowcase.image}
                alt={currentShowcase.alt}
                className="h-full w-full object-cover object-top transition-opacity duration-300"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white md:text-xl">
                      {currentShowcase.title}
                    </h3>
                    <p className="text-xs text-neutral-300 md:text-sm">
                      {currentShowcase.subtitle}
                    </p>
                  </div>
                  <span className="rounded-md border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF6A00] backdrop-blur-sm">
                    Verified Local Asset
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Badges below mockup */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">95+ Core Web Vitals</div>
                <div className="text-xs text-neutral-400">Near-zero latency edge delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Search Console Ready</div>
                <div className="text-xs text-neutral-400">Structured data & canonical hygiene</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Zero Vendor Lock-In</div>
                <div className="text-xs text-neutral-400">Full source code & DNS ownership</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="bg-white py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
              Strategic Advantages
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              Why Choose Nuvox Digital Studio?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              Most agency websites look pretty but load sluggishly and generate zero commercial
              leads. Nuvox is engineered from day one as a lead generation asset.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition duration-200 hover:-translate-y-1 hover:border-black hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-white transition group-hover:bg-[#FF6A00]">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-950">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions & Deliverables */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Detailed Scope
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              What&rsquo;s Included in Every Nuvox Build
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              Nothing is left to chance. Every deliverable is structured to eliminate friction
              between your business and high-ticket clients.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {INCLUSIONS_GROUPS.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                  <h3 className="text-lg font-bold text-neutral-950">{group.category}</h3>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6A00]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Packages & Pricing */}
      <section className="bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
              Engagement Options
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Transparent, Sprint-Based Studio Engagements
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              Fixed scopes, clear deliverables, and predictable timelines. Choose the package that
              matches your operational roadmap.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition md:p-10 ${
                  pkg.highlight
                    ? "border-2 border-[#FF6A00] bg-neutral-900 shadow-2xl shadow-[#FF6A00]/10"
                    : "border border-white/15 bg-neutral-900/60"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-3.5 right-8 rounded-full bg-[#FF6A00] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                      {pkg.timeline}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-300">{pkg.tagline}</p>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      Package Inclusions:
                    </div>
                    <ul className="mt-4 space-y-3">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3 text-sm text-neutral-200">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6A00]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6">
                  <a
                    href="#inquiry"
                    onClick={() => setForm((prev) => ({ ...prev, packageChoice: pkg.name }))}
                    className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition ${
                      pkg.highlight
                        ? "bg-[#FF6A00] text-white shadow-lg shadow-[#FF6A00]/25 hover:bg-[#e55f00]"
                        : "border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-neutral-400">
              Need a custom multi-brand or enterprise build?{" "}
              <Link to="/contact-me" className="text-[#FF6A00] underline hover:text-[#ff8533]">
                Contact Usman directly for bespoke scoping
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Direct Inquiry Form Section */}
      <section id="inquiry" className="border-t border-neutral-200 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
                Direct Booking
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
                Start Your Nuvox Studio Sprint
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                Tell us about your project, target audience, and launch timeline. We will review
                your requirements and send back exact scope, milestone dates, and fixed pricing.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <CheckCircle2 className="h-5 w-5 text-[#FF6A00]" />
                  <span>24-hour turnaround on scope & quote</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <CheckCircle2 className="h-5 w-5 text-[#FF6A00]" />
                  <span>No pushy sales calls — transparent technical feedback</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <CheckCircle2 className="h-5 w-5 text-[#FF6A00]" />
                  <span>NDA signed before reviewing sensitive assets if requested</span>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#FF6A00]" />
                  <h3 className="font-semibold text-neutral-950">Prefer a live conversation?</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  Book a free 30-minute discovery call directly on Usman&rsquo;s calendar to discuss
                  your web architecture and business goals.
                </p>
                <Link
                  to="/call"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#FF6A00] hover:underline"
                >
                  Schedule call now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-8 text-white shadow-xl md:p-10">
              <h3 className="text-xl font-bold text-white md:text-2xl">
                Request Scope & Availability
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Fill in the details below and we will get back to you with timeline and next steps.
              </p>

              {submitState === "success" ? (
                <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center text-emerald-200">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                  <h4 className="mt-3 text-lg font-semibold text-white">Inquiry Received</h4>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-300">{statusMessage}</p>
                  <button
                    onClick={() => setSubmitState("idle")}
                    className="mt-6 rounded-full border border-emerald-400/40 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-400/20"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Selected Package
                    </label>
                    <select
                      value={form.packageChoice}
                      onChange={(e) => setForm({ ...form, packageChoice: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    >
                      <option value="Studio Standard Sprint">
                        Studio Standard Sprint (2–3 Weeks)
                      </option>
                      <option value="Studio Growth & Scale">
                        Studio Growth & Scale (3–4 Weeks)
                      </option>
                      <option value="Custom Bespoke Scope">Custom Bespoke Scope</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Current Website / Domain (if any)
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://example.com"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Project Notes & Goals
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about what you want to build, target launch date, and key features..."
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6A00] py-4 text-sm font-semibold text-white shadow-lg shadow-[#FF6A00]/25 transition hover:bg-[#e55f00] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitState === "submitting" ? "Sending Details..." : "Submit Inquiry"}
                  </button>

                  <p className="text-center text-[11px] text-neutral-500">
                    Your details are strictly confidential. We never share or sell contact data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Clear Answers
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
              Everything you need to know about our sprint timeline, tech stack, deliverables, and
              code ownership.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-neutral-950 transition hover:bg-neutral-50 md:p-6"
                  >
                    <span className="text-base md:text-lg">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#FF6A00]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-100 px-5 pb-6 pt-4 text-sm leading-relaxed text-neutral-600 md:px-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Final CTA Strip */}
      <section className="bg-neutral-950 px-5 py-12 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
              Ready to Launch?
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Let&rsquo;s Build Your High-Performance Digital Studio Asset
            </h2>
            <p className="mt-1 max-w-xl text-xs text-neutral-400 md:text-sm">
              Sprints book out fast. Reach out now to secure your build window for the upcoming
              month.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#FF6A00]/30 transition hover:bg-[#e55f00]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
