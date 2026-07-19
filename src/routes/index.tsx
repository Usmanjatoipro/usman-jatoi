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
  Check,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Github,
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

/* ============ Floating social rail (left edge) ============ */
function SocialRail() {
  const socials = [
    { icon: Instagram, href: "https://www.instagram.com/usmanjatoi/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/usmanjatoi/", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@UsmanJatoi", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/usmanjatoi", label: "Twitter" },
    { icon: Github, href: "https://github.com/usmanjatoi", label: "GitHub" },
  ];
  return (
    <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {socials.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="gradient-border group flex h-10 w-10 items-center justify-center rounded-full bg-background/50 backdrop-blur-md transition-transform hover:scale-110"
          >
            <Icon className="h-4 w-4 text-foreground/70 transition-colors group-hover:text-foreground" />
          </a>
        );
      })}
    </div>
  );
}

/* ============ Hero ============ */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-24">
      {/* Ambient gradient glow behind portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--gradient-brand-conic)" }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        {/* LEFT — copy */}
        <div className="relative z-10">
          <div className="gradient-border inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
            Your Digital Partner
          </div>

          <h1
            className="mt-8 font-bold uppercase leading-[0.95] tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 6.2vw, 5.5rem)" }}
          >
            Hi, I'm
            <br />
            Usman Jatoi
          </h1>

          <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.3em] text-gradient">
            19 Years Old · 7 Years in the Digital World
          </p>

          <div className="mt-6 max-w-xl space-y-3 text-[15px] leading-relaxed text-foreground/85">
            <p>
              Built 1,000+ plugins, 190+ websites, and 700+ pages using Python automation.
              Created 200+ AI videos, 300+ graphic designs, and led teams of 19+ members
              starting from the age of 16.
            </p>
            <p>
              Produced 5+ video ads, worked with Blender for over 2 years, developed 5+
              Chrome extensions & many more things.
            </p>
          </div>

          <ul className="mt-8 space-y-3.5">
            {[
              "Founder of Redsglow — helping startups launch online.",
              "Head of Web Design at UK-based agency.",
              "I code with vibe. I build with purpose.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-[15px] text-foreground/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="h-4 w-4 text-foreground" strokeWidth={2.5} />
                </span>
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Audio player with gradient border */}
            <div className="gradient-border overflow-hidden rounded-full">
              <audio
                controls
                preload="metadata"
                src="/site-assets/Usman-Jatoi-Introductional-Voicenote.mp3"
                className="h-12 min-w-[280px] bg-background"
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>

            <Link
              to="/contact-me"
              className="gradient-border group inline-flex items-center gap-2 rounded-full bg-background px-9 py-3.5 text-[13px] font-bold uppercase tracking-[0.25em] text-foreground transition-transform hover:scale-[1.02]"
            >
              Hire Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* RIGHT — portrait, full-bleed to the right edge */}
        <div className="relative h-[520px] w-full lg:h-[680px]">
          {/* soft flowing gradient strokes behind */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 600 700"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="hero-stroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff0080" />
                <stop offset=".33" stopColor="#ffd700" />
                <stop offset=".66" stopColor="#00bfff" />
                <stop offset="1" stopColor="#8a2be2" />
              </linearGradient>
            </defs>
            <path
              d="M-50,200 C150,100 300,400 550,180 M-20,320 C200,240 340,520 600,300 M0,440 C220,380 380,620 620,420"
              stroke="url(#hero-stroke)"
              strokeWidth="0.6"
              opacity="0.5"
            />
          </svg>

          <img
            src="/site-assets/Usman-Jatoi-Pro.webp"
            alt="Usman Jatoi"
            className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
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
      <SocialRail />
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
