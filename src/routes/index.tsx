import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Code2,
  LineChart,
  Rocket,
  Globe,
  Users,
  Star,
} from "lucide-react";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const SITE_URL = "https://usmanjatoi.com";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Usman Jatoi",
          url: SITE_URL,
          jobTitle: "Full-Stack Digital Expert & Entrepreneur",
          sameAs: [
            "https://www.youtube.com/@UsmanJatoi",
            "https://www.instagram.com/usmanjatoi/",
          ],
        }),
      },
    ],
  }),
});

/* ============ Hero ============ */
function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Ambient gradient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand-conic)" }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
        <div>
          <div className="gradient-border inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/80">
            <Sparkles className="h-3 w-3" />
            Top 0.1% Digital Expert
          </div>

          <h1 className="mt-8 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
            Building the
            <br />
            <span className="text-gradient">next-generation</span>
            <br />
            of digital brands.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            I'm Usman Jatoi — full-stack strategist, technologist and founder.
            I help ambitious companies design, build and scale extraordinary
            digital products, brands and businesses.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact-me"
              className="gradient-border inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground"
            >
              Let's Talk
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid max-w-lg grid-cols-3 gap-8 border-t border-white/10 pt-8">
            {[
              { k: "16K+", v: "Projects" },
              { k: "60+", v: "Countries" },
              { k: "10+", v: "Years" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl font-bold tracking-tight text-foreground">
                  {s.k}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait / abstract badge */}
        <div className="relative">
          <div className="gradient-border relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-card">
            <img
              src="/site-assets/usman-jatoi.jpg"
              alt="Usman Jatoi"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{ background: "var(--gradient-brand-conic)" }}
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="gradient-border rounded-2xl bg-background/70 px-5 py-3 backdrop-blur-md">
                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Currently
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  Building UJ Online, Redsglow & RabbitFlare
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Marquee ============ */
function Marquee() {
  const items = [
    "STRATEGY",
    "DESIGN",
    "ENGINEERING",
    "SEO",
    "AI",
    "AUTOMATION",
    "GROWTH",
    "BRAND",
    "CONTENT",
    "SYSTEMS",
  ];
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-8">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span
            key={i}
            className="text-2xl font-bold tracking-widest text-foreground/40"
          >
            {t}
            <span className="mx-8 text-foreground/20">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-33.333%); } }`}</style>
    </section>
  );
}

/* ============ Services grid ============ */
function ServicesGrid() {
  const items = [
    {
      icon: Code2,
      title: "Web & Product",
      desc: "Custom platforms, WordPress, Shopify, Webflow, headless builds.",
      to: "/services/web",
    },
    {
      icon: LineChart,
      title: "SEO & Marketing",
      desc: "Technical SEO, content, PR and full-funnel growth systems.",
      to: "/skills-expertise/seo-marketing",
    },
    {
      icon: Sparkles,
      title: "AI & Automation",
      desc: "Data pipelines, agents and workflow automation at scale.",
      to: "/skills-expertise/ai-research-and-innovation",
    },
    {
      icon: Layers,
      title: "Brand & Creative",
      desc: "Identity, design systems, motion, editorial and content.",
      to: "/skills-expertise/creative-skills",
    },
    {
      icon: Rocket,
      title: "Strategy & Advisory",
      desc: "Positioning, GTM, org design, fractional operator work.",
      to: "/services",
    },
    {
      icon: Globe,
      title: "White-Label Partners",
      desc: "Fulfillment for agencies. We ship — you take the credit.",
      to: "/white-label-partnership",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
      <SectionHeader
        eyebrow="Services"
        title={
          <>
            Full-stack <span className="text-gradient">execution</span>,
            <br /> from idea to scale.
          </>
        }
        cta={{ label: "All services", to: "/services" }}
      />

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.title}
              to={it.to as any}
              className="group relative bg-background p-8 transition-colors hover:bg-card"
            >
              <Icon className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-foreground" />
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">
                {it.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 transition-colors group-hover:text-foreground">
                Explore
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: "var(--gradient-brand)" }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ============ About/Manifesto ============ */
function Manifesto() {
  return (
    <section className="relative border-y border-white/10 py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.5fr_1fr] lg:px-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
          The Approach
        </div>
        <div>
          <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.2] tracking-tight text-foreground">
            I don't build for the average client. I build for the outliers —
            the founders and teams who want <span className="text-gradient">the top 0.1%</span> of
            execution across strategy, design, engineering and growth.
            <span className="text-muted-foreground">
              {" "}Every project is a system, every system a compounding asset.
            </span>
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { k: "Depth", v: "12+ disciplines" },
              { k: "Speed", v: "Weeks, not quarters" },
              { k: "Craft", v: "Pixel-perfect" },
              { k: "Systems", v: "Built to compound" },
            ].map((c) => (
              <div key={c.k} className="border-l border-white/15 pl-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {c.k}
                </div>
                <div className="mt-2 text-base font-semibold text-foreground">
                  {c.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Businesses ============ */
function Businesses() {
  const items = [
    { name: "Redsglow", desc: "Full-service digital agency.", to: "/businesses" },
    { name: "UJ Online", desc: "Courses & digital products.", to: "/businesses" },
    { name: "RabbitFlare", desc: "SaaS & automation studio.", to: "/businesses" },
    { name: "Usama 2.0", desc: "Personal ventures & bets.", to: "/businesses" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
      <SectionHeader
        eyebrow="Businesses"
        title={
          <>
            A portfolio of <span className="text-gradient">operating companies</span>.
          </>
        }
        cta={{ label: "See all", to: "/businesses" }}
      />
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <Link
            key={b.name}
            to={b.to as any}
            className="gradient-border group relative flex flex-col justify-between rounded-2xl bg-card p-8 transition-transform hover:-translate-y-1"
          >
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Company
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                {b.name}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{b.desc}</p>
            </div>
            <ArrowUpRight className="mt-10 h-5 w-5 text-foreground/70 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ============ Testimonials ============ */
function Testimonials() {
  const items = [
    {
      quote:
        "Usman rebuilt our entire digital footprint in eight weeks. Traffic 4×, revenue 2.7×.",
      author: "Founder, DTC brand",
    },
    {
      quote:
        "The best operator I've worked with. Strategic depth + shipping speed is rare.",
      author: "CEO, SaaS company",
    },
    {
      quote:
        "He treats every project like it's his own company. That's the difference.",
      author: "Marketing Director",
    },
  ];
  return (
    <section className="relative border-y border-white/10 bg-card py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="Proof"
          title={
            <>
              Words from the <span className="text-gradient">people we built with</span>.
            </>
          }
          cta={{ label: "All testimonials", to: "/testimonials" }}
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-background p-8"
            >
              <div className="flex gap-1 text-foreground">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 text-lg font-medium leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ background: "var(--gradient-brand-conic)" }}
                />
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t.author}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTA() {
  return (
    <section className="relative py-40">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand-conic)" }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
          <Users className="mr-2 inline h-3 w-3" />
          Selective engagements
        </div>
        <h2 className="mt-8 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight text-foreground">
          Let's build something
          <br />
          <span className="text-gradient">extraordinary.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          I take on a limited number of clients each quarter. If you're serious
          about building something exceptional, let's talk.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact-me"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Start a conversation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/media-kit"
            className="gradient-border inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground"
          >
            Media Kit
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ Reusable section header ============ */
function SectionHeader({
  eyebrow,
  title,
  cta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
          {eyebrow}
        </div>
        <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1] tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          to={cta.to as any}
          className="gradient-underline inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground/80 hover:text-foreground"
        >
          {cta.label}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Home() {
  const chatRef = useRef(false);
  useEffect(() => {
    if (chatRef.current) return;
    chatRef.current = true;
    // Chatway widget
    const s = document.createElement("script");
    s.id = "chatway";
    s.async = true;
    s.src = "https://cdn.chatway.app/widget.js?id=L0xfLqShglJm";
    document.body.appendChild(s);
  }, []);

  return (
    <main className="relative bg-background text-foreground">
      <Hero />
      <Marquee />
      <ServicesGrid />
      <Manifesto />
      <Businesses />
      <Testimonials />
      <CTA />
    </main>
  );
}
