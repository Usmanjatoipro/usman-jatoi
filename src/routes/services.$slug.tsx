import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Rocket,
  Target,
  ShieldCheck,
  Wrench,
  BrainCircuit,
  Palette,
  LineChart,
  Code2,
  Users2,
  Star,
  Trophy,
  Globe2,
  PlayCircle,
  Calendar,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Building2,
} from "lucide-react";
import ServiceCover from "@/components/ServiceCover";
import CalEmbed from "@/components/CalEmbed";
import FloatingDock from "@/components/FloatingDock";
import HeroLoopList from "@/components/HeroLoopList";
import ProcessSlider from "@/components/ProcessSlider";
import GlobalFlags from "@/components/GlobalFlags";
import servicesContent from "@/data/services-content.json";
import { getLocalServiceBySlug } from "@/lib/wp-content-stats.functions";
import heroLightbulb from "@/assets/hero-lightbulb.jpg.asset.json";
import usmanOfficial from "@/assets/Usman-Jatoi-Official.webp.asset.json";
import redsglow from "@/assets/Redsglow-Banner.jpg.asset.json";
import awardFoundations from "@/assets/award-foundations.webp.asset.json";
import awardLl343 from "@/assets/award-ll343.webp.asset.json";
import awardGemini from "@/assets/award-gemini.png.asset.json";
import awardBestDesign from "@/assets/award-best-design-2025.svg.asset.json";
import awardBadge from "@/assets/award-badge.webp.asset.json";
import awardDevspot from "@/assets/award-devspot.svg.asset.json";

type ServiceRecord = {
  slug: string;
  title: string;
  h1: string;
  paragraphs: string[];
  bullets: string[];
  content?: string | null;
};

const services = servicesContent as Record<string, ServiceRecord>;

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const local = await getLocalServiceBySlug({ data: { slug: params.slug } });
    if (!local && !services[params.slug]) throw notFound();
    return local;
  },
  head: ({ params, loaderData }) => {
    const s = loaderData?.service || services[params.slug];
    if (!s) return { meta: [{ title: "Service — Usman Jatoi" }] };
    const desc =
      s.paragraphs[0] ||
      `${s.title} — practical, hands-on service delivery by Usman Jatoi.`;
    return {
      meta: [
        { title: `${s.title} — Services | Usman Jatoi` },
        { name: "description", content: desc.slice(0, 158) },
        { property: "og:title", content: `${s.title} — Usman Jatoi` },
        { property: "og:description", content: desc.slice(0, 158) },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `https://usmanjatoi.lovable.app/services/${params.slug}`,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://usmanjatoi.lovable.app/services/${params.slug}`,
        },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Service not found</h1>
        <Link to="/services" className="text-primary underline">
          Back to Services
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="text-destructive">Error: {error.message}</p>
    </div>
  ),
});

/* ---------------- Reveal on scroll ---------------- */
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- 3D Tilt Card ---------------- */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(
      2
    )}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 250ms ease-out",
        background:
          "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.15), transparent 40%), linear-gradient(180deg,#0b0b12,#111121)",
      }}
      className={`relative rounded-2xl p-[2px] ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-[conic-gradient(from_140deg,#8b5cf6,#06b6d4,#f59e0b,#ec4899,#8b5cf6)] opacity-40 blur-[6px]" />
      <div className="relative h-full rounded-2xl bg-neutral-950/90 p-6 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)]">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Static content shared across all services ---------------- */
const trustedBrands = [
  "Redsglow",
  "UJ Online",
  "RabbitFlare",
  "Elementor Pros",
  "WP Agency Co.",
  "Digital Guild",
  "Startup Hub",
  "Creator Lab",
];

const expertise = [
  {
    icon: BrainCircuit,
    title: "My Expertise",
    body:
      "10+ years shipping real client work across web, AI, content, and creative — hands-on, not just advisory.",
  },
  {
    icon: Rocket,
    title: "How I Help",
    body:
      "Clear scope, transparent process, weekly async updates, and delivery that actually ships to production.",
  },
  {
    icon: Trophy,
    title: "Why Me",
    body:
      "Self-taught, self-driven, and proven — 500+ projects, 4.9/5 rating, and honest communication above all.",
  },
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/usmanjatoi", color: "#0A66C2" },
  { name: "Instagram", url: "https://instagram.com/usmanjatoi", color: "#E1306C" },
  { name: "X / Twitter", url: "https://twitter.com/usmanjatoi", color: "#111" },
  { name: "YouTube", url: "https://youtube.com/@usmanjatoi", color: "#FF0000" },
  { name: "GitHub", url: "https://github.com/usmanjatoi", color: "#181717" },
  { name: "Behance", url: "https://behance.net/usmanjatoi", color: "#1769FF" },
];

const tools = [
  "WordPress",
  "Shopify",
  "Elementor",
  "Webflow",
  "React / Next",
  "TanStack",
  "Node.js",
  "Python",
  "Make.com",
  "n8n",
  "OpenAI",
  "Anthropic",
  "Figma",
  "Photoshop",
  "Premiere Pro",
  "Blender",
  "Ahrefs",
  "Semrush",
  "GA4",
  "Cloudflare",
];

const process = [
  { n: "01", t: "Discovery", d: "Understand your goals, audience, and constraints." },
  { n: "02", t: "Strategy", d: "Blueprint scope, milestones, and success metrics." },
  { n: "03", t: "Design", d: "Wireframes and design directions aligned to brand." },
  { n: "04", t: "Build", d: "Ship in iterations with weekly async check-ins." },
  { n: "05", t: "Launch", d: "QA, migration, redirects, and go-live." },
  { n: "06", t: "Grow", d: "Post-launch analytics, tuning, and expansion." },
];

const delays = [
  {
    icon: Users2,
    t: "Family events",
    d: "Weddings, births, or a family emergency.",
    tip: "If a family event comes up I tell you the same day and give a revised delivery date in writing — no silent slipping.",
  },
  {
    icon: ShieldCheck,
    t: "Health issues",
    d: "Personal or immediate-family health matters.",
    tip: "Health issues are the only reason I pause work without notice. You get the remaining scope re-planned, or a pro-rata refund if you'd rather stop.",
  },
  {
    icon: Globe2,
    t: "Public holidays",
    d: "Regional and international observances.",
    tip: "Eid, Christmas and local public holidays are shared up front in your project plan so nothing is a surprise.",
  },
  {
    icon: Wrench,
    t: "Technical issues",
    d: "Hosting, connectivity, or third-party outages.",
    tip: "Outages at your host, a plugin vendor or an API provider can block delivery. I document the blocker and work around it wherever possible.",
  },
];

const awards = [
  {
    img: awardFoundations.url,
    t: "Foundations River Recognition",
    d: "Recognised for community-first digital work.",
  },
  {
    img: awardLl343.url,
    t: "Top Rated Delivery Badge",
    d: "Consistent 5-star delivery on client platforms.",
  },
  {
    img: awardGemini.url,
    t: "Innovation in AI Workflows",
    d: "For practical AI automation shipped to production.",
  },
  {
    img: awardBestDesign.url,
    t: "Best Design Awards 2025",
    d: "Shortlisted for web design craft and usability.",
  },
  {
    img: awardBadge.url,
    t: "Featured Web Designer",
    d: "Highlighted in industry showcases and round-ups.",
  },
  {
    img: awardDevspot.url,
    t: "Devspot Verified Builder",
    d: "Verified for shipped, maintained production builds.",
  },
];

const globalTeams = [
  { code: "pk", flag: "🇵🇰", country: "Pakistan", note: "HQ — strategy & delivery" },
  { code: "us", flag: "🇺🇸", country: "USA", note: "Client success" },
  { code: "gb", flag: "🇬🇧", country: "UK", note: "Partnerships" },
  { code: "ae", flag: "🇦🇪", country: "UAE", note: "Growth & sales" },
  { code: "in", flag: "🇮🇳", country: "India", note: "Engineering" },
  { code: "ph", flag: "🇵🇭", country: "Philippines", note: "Content operations" },
  { code: "ca", flag: "🇨🇦", country: "Canada", note: "Accounts & support" },
  { code: "au", flag: "🇦🇺", country: "Australia", note: "APAC coverage" },
];

const faqs = [
  {
    q: "How do you scope a project?",
    a: "We start with a discovery call, define outcomes and constraints, then produce a written scope with milestones before any work begins.",
  },
  {
    q: "What's your typical turnaround?",
    a: "Small engagements: 1–2 weeks. Mid-size: 3–6 weeks. Complex builds: 2–4 months. Every plan comes with a clear timeline.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. Mutual NDAs are standard for client work and available on request before any details are shared.",
  },
  {
    q: "How do we communicate?",
    a: "Async by default — Loom, Slack, or email — with a weekly written status and calls when needed.",
  },
  {
    q: "Do you offer post-launch support?",
    a: "Yes. Retainer options are available for ongoing maintenance, iteration, and growth work.",
  },
];

const blogTeasers = [
  { t: "Publishing 1,000 SEO pages without hurting quality", tag: "Bulk Publishing" },
  { t: "Practical AI automations that actually save time", tag: "AI" },
  { t: "Web performance wins you can ship in an afternoon", tag: "Web" },
];

/* ---------------- Accordion ---------------- */
function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white backdrop-blur">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-neutral-50 transition"
          >
            <span className="font-medium text-neutral-950">{it.q}</span>
            <ChevronDown
              className={`h-5 w-5 text-neutral-900 transition-transform ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-500 ease-out ${
              open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-neutral-600 leading-relaxed">{it.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Main component ---------------- */
function ServiceDetail() {
  const { slug } = Route.useParams();
  const local = Route.useLoaderData();
  const s = (local?.service || services[slug]) as ServiceRecord;
  const childServices = local?.children || [];
  const [tab, setTab] = useState<"web" | "brand" | "content">("web");

  // Icons per service card in the "sub-services" grid — reused generically
  const subCards = [
    { icon: Sparkles, t: "Strategy & Planning", d: "Blueprint before we build.", tag: "Discovery" },
    { icon: Palette, t: "Design & Systems", d: "On-brand, on-purpose.", tag: "Design" },
    { icon: Code2, t: "Development", d: "Fast, accessible, maintainable.", tag: "Build" },
    { icon: LineChart, t: "Growth & SEO", d: "Made to be found.", tag: "Growth" },
    { icon: ShieldCheck, t: "Quality & Compliance", d: "Ship confidently.", tag: "QA" },
    { icon: Zap, t: "Automation", d: "Cut the busywork.", tag: "Automate" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_-10%,rgba(255,255,255,0.10),transparent),radial-gradient(700px_380px_at_85%_0%,rgba(255,106,0,0.14),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
          <Reveal delay={100}>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-white/10 border border-white/15 text-white/80 mb-6">
              Service
            </span>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              {s.h1}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-2xl mx-auto text-white/70 text-lg">
              {s.paragraphs[0]}
            </p>
          </Reveal>
          <Reveal>
            <nav className="mt-8 text-sm text-white/60" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="mx-2">&gt;</span>
              <Link to="/services" className="hover:text-white">My Services</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-white">{s.title}</span>
            </nav>
          </Reveal>
        </div>
        <style>{`
          @keyframes shine{to{background-position:200% 0}}
          .service-migrated-body{color:#1f2937;font-size:17px;line-height:1.75}
          .service-migrated-body .migrated-field{margin:0 0 22px;border:1px solid #e5e7eb;border-radius:18px;background:#fff;padding:clamp(18px,3vw,30px);box-shadow:0 18px 55px rgba(15,23,42,.06)}
          .service-migrated-body .migrated-field>h2{margin:0 0 14px;color:#111827;font-size:clamp(24px,3vw,36px);line-height:1.12}
          .service-migrated-body h3{margin:18px 0 8px;color:#111827;font-size:21px;line-height:1.25}
          .service-migrated-body p{margin:0 0 14px}
          .service-migrated-body ul{margin:12px 0 0;padding-left:20px}
          .service-migrated-body li{margin:8px 0}
          .service-migrated-body .migrated-grid,.service-migrated-body .migrated-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:16px}
          .service-migrated-body .migrated-grid article,.service-migrated-body .migrated-steps article{border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;padding:16px}
          .service-migrated-body .migrated-steps article span{display:inline-flex;margin-bottom:10px;border-radius:999px;background:#111827;color:white;padding:3px 9px;font-size:12px;font-weight:700}
          .service-migrated-body .migrated-table{overflow-x:auto;margin-top:14px}
          .service-migrated-body table{width:100%;border-collapse:collapse;font-size:15px}
          .service-migrated-body th,.service-migrated-body td{border-bottom:1px solid #e5e7eb;padding:10px;text-align:left;vertical-align:top}
          .service-migrated-body th{background:#f9fafb;color:#111827}
          .service-migrated-body details{border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;padding:12px 14px;margin:10px 0}
          .service-migrated-body summary{cursor:pointer;color:#111827;font-weight:700}
          .service-migrated-body pre{overflow:auto;border-radius:14px;background:#111827;color:white;padding:16px;font-size:13px;line-height:1.55}
        `}</style>
      </header>

      {/* ---------- Zigzag intro ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200">
            <ServiceCover title={s.title} kicker="Service" slug={slug} eager />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What you get with{" "}
              <span className="text-[#FF6A00]">
                {s.title}
              </span>
            </h2>
          </Reveal>
          {s.paragraphs.slice(1, 4).map((p, i) => (
            <Reveal key={i} delay={100 + i * 100}>
              <p className="text-neutral-600 mb-3 leading-relaxed">{p}</p>
            </Reveal>
          ))}
          <ul className="mt-4 space-y-2">
            {s.bullets.slice(0, 6).map((b, i) => (
              <Reveal key={i} delay={200 + i * 80}>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="h-5 w-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">{b}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact-me"
                className="px-6 py-3 rounded-full bg-[#FF6A00] text-white font-semibold hover:opacity-90 transition"
              >
                Book a Call
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
              >
                All Services
              </Link>
            </div>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-6 flex items-center gap-3 text-sm text-neutral-600">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <span>4.9/5 (127 Reviews)</span>
              <span className="mx-1">•</span>
              <span> Featured Best Web Designer</span>
            </div>
          </Reveal>
        </div>
      </section>

      {s.content ? (
        <section className="bg-neutral-50 text-neutral-950">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <span className="inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                What this service covers
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                Everything included in this service
              </h2>
              <p className="mt-4 max-w-3xl text-neutral-600">
                A full breakdown of the work: service blocks, process, industries, locations, glossary and frequently asked questions.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div
                className="service-migrated-body mt-10"
                dangerouslySetInnerHTML={{ __html: s.content }}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {childServices.length ? (
        <section className="bg-white text-neutral-950">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Child Services
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                {local?.childCount.toLocaleString()} related service pages
              </h2>
              <p className="mt-4 max-w-3xl text-neutral-600">
                Browse the imported child pages under this exact WordPress
                parent service path.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {childServices.slice(0, 120).map((child: { href: string; title: string; excerpt?: string }, index: number) => (
                <Reveal key={child.href} delay={(index % 9) * 35}>
                  <a
                    href={child.href}
                    className="block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-xl hover:shadow-neutral-900/10"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-neutral-950">
                      {child.title}
                    </h3>
                    {child.excerpt ? (
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {child.excerpt}
                      </p>
                    ) : null}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- Trusted by ---------- */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Reveal>
            <p className="text-center text-sm uppercase tracking-widest text-neutral-400 mb-6">
              Trusted by 50+ brands and creators
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustedBrands.map((b, i) => (
              <Reveal key={b} delay={i * 60}>
                <span className="text-neutral-500 hover:text-neutral-950 font-medium transition">
                  {b}
                </span>
              </Reveal>
            ))}
            <Reveal delay={trustedBrands.length * 60}>
              <Link
                to="/contact-me"
                className="text-[#FF6A00] hover:text-[#cc5500] font-medium"
              >
                + Your logo here →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- About zigzag with accordion ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About this service
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {s.paragraphs[s.paragraphs.length - 1] || s.paragraphs[0]}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Accordion
              items={[
                {
                  q: "What is included?",
                  a: s.bullets.slice(0, 4).join(" • ") || "A tailored delivery plan for your goals.",
                },
                {
                  q: "How is the process?",
                  a: "Discovery → strategy → design → build → launch → grow. Weekly async updates and a live shared doc.",
                },
                {
                  q: "How do we start?",
                  a: "Book a 30-min call and we'll map scope and pricing together.",
                },
              ]}
            />
          </Reveal>
        </div>
        <Reveal className="order-1 md:order-2">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200">
            <ServiceCover title={`About ${s.title}`} kicker="Expertise" slug={`${slug}-about`} />
          </div>
        </Reveal>
      </section>

      {/* ---------- Three cards: Expertise / Help / Why me ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            My expertise, how I help, and why me
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {expertise.map((e, i) => (
            <Reveal key={e.title} delay={i * 120}>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-full hover:bg-neutral-100 transition">
                <e.icon className="h-8 w-8 text-[#FF6A00] mb-4" />
                <h3 className="text-xl font-bold mb-2">{e.title}</h3>
                <p className="text-neutral-600">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Online presence ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            My online presence & network
          </h2>
          <p className="text-center text-neutral-500 mb-10">
            Connect across 60+ authoritative digital hubs.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {socials.map((soc, i) => (
            <Reveal key={soc.name} delay={i * 80}>
              <a
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 p-4 text-center transition"
                style={{ borderTopColor: soc.color }}
              >
                <div
                  className="mx-auto mb-2 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: soc.color }}
                >
                  {soc.name[0]}
                </div>
                <div className="text-sm text-neutral-700">{soc.name}</div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Sub-services grid with 3D tilt ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-[#FF6A00]/10 text-[#FF6A00] mb-4">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Everything included under {s.title.toLowerCase()}
          </h2>
          <p className="text-neutral-500 mb-10 max-w-2xl">
            Hover a card — it tilts with a subtle 3D shadow and cursor-tracked
            gradient. Click to enquire about that specific scope.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCards.map((c, i) => (
            <Reveal key={c.t} delay={i * 100}>
              <TiltCard>
                <c.icon className="h-10 w-10 text-[#FF6A00] mb-4" />
                <h3 className="text-xl font-bold mb-1">{c.t}</h3>
                <p className="text-neutral-600 mb-4">{c.d}</p>
                <span className="inline-block text-xs uppercase tracking-widest px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                  {c.tag}
                </span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Tools & Platforms ---------- */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              Tools, platforms, and tech I use
            </h2>
            <p className="text-center text-neutral-500 mb-10">
              The stack behind every {s.title.toLowerCase()} engagement.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((t, i) => (
              <Reveal key={t} delay={i * 40}>
                <span className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm text-neutral-700 hover:border-[#FF6A00] hover:text-neutral-950 transition">
                  {t}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Step-by-step process
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-full">
                <div className="text-5xl font-black text-[#FF6A00] mb-3">
                  {p.n}
                </div>
                <h3 className="text-xl font-bold mb-1">{p.t}</h3>
                <p className="text-neutral-600">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Video highlight ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 aspect-video flex items-center justify-center">
            <PlayCircle className="h-24 w-24 text-neutral-700" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl md:text-3xl font-bold">My creative reels & work</h3>
              <p className="text-neutral-600">Watch process breakdowns, client walkthroughs, and case studies.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Portfolio tabs ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Explore my portfolio
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {(["web", "brand", "content"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  tab === k
                    ? "bg-[#FF6A00] text-white"
                    : "border border-neutral-300 hover:bg-neutral-100"
                }`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <Reveal key={`${tab}-${n}`} delay={i * 80}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 hover:scale-[1.02] transition">
                <div className="h-full flex items-center justify-center text-4xl">
                  {tab === "web" ? "" : tab === "brand" ? "" : ""}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Delivery transparency ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Understanding potential service delivery
          </h2>
          <p className="text-neutral-600 mb-8 max-w-2xl">
            These are common situations that may cause short delays in service
            delivery. We share them openly for full transparency.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {delays.map((d, i) => (
            <Reveal key={d.t} delay={i * 100}>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 h-full">
                <div className="text-3xl mb-2">{d.icon}</div>
                <h3 className="font-bold mb-1">{d.t}</h3>
                <p className="text-neutral-500 text-sm">{d.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Book a Call ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <Reveal>
          <div className="rounded-3xl border border-neutral-200 bg-neutral-950 text-white p-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-[#FF6A00]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Book a call with me to discuss your project in detail
            </h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              30 minutes on Cal.com — free, no obligation. We map scope and
              next steps together.
            </p>
            <a
              href="https://cal.com/usmanjatoi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6A00] text-white font-semibold hover:opacity-90 transition"
            >
              Open Cal.com <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ---------- Awards ---------- */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="mb-3 text-center text-3xl font-bold md:text-4xl">
              Awards &amp; recognition
            </h2>
            <p className="mb-10 text-center text-neutral-500">
              A real story — not vanity metrics.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a, i) => (
              <Reveal key={a.t} delay={i * 80}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
                  <img
                    src={a.img}
                    alt={`${a.t} — award received by Usman Jatoi`}
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-16 shrink-0 rounded-xl object-contain"
                  />
                  <div>
                    <h3 className="font-bold leading-snug">{a.t}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{a.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/awards" className="text-[#FF6A00] hover:text-[#cc5500]">
              Explore all awards →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Global reach ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="mb-3 text-center text-3xl font-bold md:text-4xl">
            We're global — {s.title.toLowerCase()} wherever you are
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-neutral-500">
            Distributed operators across time zones, so someone is always moving
            your project forward. Tap a country to see the local version of this
            service.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <GlobalFlags entries={globalTeams} slug={slug} />
        </Reveal>
      </section>

      {/* ---------- Hire the agency banner ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              backgroundImage: `url(${redsglow.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative px-8 py-16 text-center md:px-16 md:py-24">
              <h2 className="text-3xl font-black leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-5xl">
                Want to hire the agency instead?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                Redsglow is my full-service team — bigger scopes, more hands,
                same standards and the same person accountable for delivery.
              </p>
              <a
                href="https://redsglow.com"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Visit Redsglow <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Risk & responsibility ---------- */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <Building2 className="mb-3 h-8 w-8 text-[#FF6A00]" />
            <h3 className="mb-2 text-xl font-bold">Your one-two agency</h3>
            <p className="text-neutral-600">
              A boutique-agency feel with a lean, senior team — no bloat, no
              account juggling.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <ShieldCheck className="mb-3 h-8 w-8 text-[#FF6A00]" />
            <h3 className="mb-2 text-xl font-bold">Risk &amp; responsibility</h3>
            <p className="text-neutral-600">
              Clear contracts, transparent updates, and honest communication
              when things go sideways. That's the deal.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------- Table of contents recap ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">On this page</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-neutral-600">
          {[
            "Hero & intro",
            "About this service",
            "Expertise & why me",
            "Online presence",
            "Sub-services",
            "Tools & platforms",
            "Process",
            "Video & portfolio",
            "Delivery transparency",
            "Book a call",
            "Awards",
            "Global team",
            "FAQ",
            "Read the blog",
            "Contact",
          ].map((x, i) => (
            <Reveal key={x} delay={i * 30}>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 hover:bg-neutral-100 transition">
                {String(i + 1).padStart(2, "0")} — {x}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Blog ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Read our blog
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {blogTeasers.map((b, i) => (
            <Reveal key={b.t} delay={i * 100}>
              <Link
                to="/blog"
                className="block rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 p-6 h-full transition"
              >
                <span className="text-xs uppercase tracking-widest text-[#FF6A00]">
                  {b.tag}
                </span>
                <h3 className="mt-2 font-bold text-lg">{b.t}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[#FF6A00] text-sm">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={faqs} />
        </Reveal>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="rounded-3xl border border-neutral-200 bg-neutral-950 text-white p-10 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-[#FF6A00] mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Let's build something together
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto mb-6">
              Tell me about your project. I usually reply within one business
              day.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                to="/contact-me"
                className="px-6 py-3 rounded-full bg-[#FF6A00] text-white font-semibold hover:opacity-90 transition"
              >
                Contact Me
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
              >
                Back to Services
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <FloatingDock />
    </div>
  );
}
