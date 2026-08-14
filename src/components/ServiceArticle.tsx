import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe2,
  Layers3,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CalEmbed from "@/components/CalEmbed";

type ServiceHero = {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
};

type ServiceAbout = {
  title?: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: Array<{
    heading?: string;
    description?: string;
    list?: string[];
  }>;
};

type ServiceSolutions = {
  section_title?: string;
  section_subtitle?: string;
  services?: Array<{
    icon?: string;
    title?: string;
    description?: string;
    tags?: string[];
    link?: string;
  }>;
};

type ServiceProcess = {
  steps?: Array<{
    step_number?: number;
    title?: string;
    description?: string;
  }>;
};

type ServiceFaqs = {
  faqs?: Array<{
    question?: string;
    answer?: string;
  }>;
};

export type ServiceStructuredData = {
  hero?: ServiceHero | null;
  about?: ServiceAbout | null;
  services?: ServiceSolutions | null;
  process?: ServiceProcess | null;
  faqs?: ServiceFaqs | null;
  promoVideo?: string | null;
};

export type ServiceArticleData = {
  id?: number;
  slug: string;
  title: string;
  h1?: string | null;
  paragraphs?: string[];
  bullets?: string[];
  content?: string | null;
  excerpt?: string | null;
  post_date?: string | null;
  path?: string | null;
  fifu_image_url?: string | null;
  structured?: ServiceStructuredData | null;
  sections?: Record<string, string> | null;
};

export type ServiceChild = {
  title: string;
  href: string;
  excerpt?: string | null;
  featured_image?: string | null;
};

const NETWORK_LOGOS = [
  ["Wix", "/site-assets/Wix-Logo-1024x398.webp"],
  ["Bricks Builder", "/site-assets/BrickBuilder-logo-1-e1752473525426.webp"],
  ["Shopify", "/site-assets/Shopify-Logo-1024x322.webp"],
  ["Windsurf", "/site-assets/windsurf-black-wordmark.webp"],
  ["Replit", "/site-assets/Replit_logo.webp"],
  ["Medium", "/site-assets/Medium-Logo-scaled-e1753187413358-1024x196.png"],
  ["Wikidata", "/site-assets/wikidatawiki-wordmark.svg"],
  ["TED", "/site-assets/TED_three_letter_logo.svg-1024x376.webp"],
] as const;

const TOOL_LOGOS = [
  ["Elementor", "/site-assets/elementor-logo-freelogovectors.net_-1024x202.webp"],
  ["Cursor", "/site-assets/cursor-logo-words-e1752653818550.jpg"],
  ["BuildShip", "/site-assets/BuildShip.png.webp"],
  ["Axiom", "/site-assets/axiom-e1752654626677.jpeg"],
  ["Anakin", "/site-assets/Anakin-Logo.png"],
] as const;

const PORTFOLIO = {
  "Creative work": [
    ["Packaging design", "/site-assets/NotePads-and-Shirts.jpg"],
    ["Stationery", "/site-assets/NotePad.jpg"],
    ["Product branding", "/site-assets/Bottles-1.jpg"],
    ["Apparel", "/site-assets/Shirt-Design.png"],
    ["Card design", "/site-assets/Card-Design.png"],
    ["Campaign creative", "/site-assets/Can1.png"],
  ],
  Websites: [
    ["Website interface", "/site-assets/2024-07-23-145529-desktop-1-4-e1738381991119.png"],
    ["Product website", "/site-assets/2024-07-23-145529-desktop-1-10.png"],
    ["Landing experience", "/site-assets/2024-07-23-145529-desktop-1-9.png"],
    ["Digital platform", "/site-assets/2024-07-23-145529-desktop-1-11.png"],
    ["Business website", "/site-assets/2024-07-23-145529-desktop-1-12.png"],
    ["Commerce website", "/site-assets/2024-07-23-145529-desktop-1-15.png"],
  ],
  Brands: [
    ["RabbitFlare", "/site-assets/RabbitFlare-Logo.png"],
    ["Usama 2.0", "/site-assets/Usama-2.0-Logo.png"],
    ["UJ Online", "/site-assets/UJonline-Minimal-Logo.png"],
    ["Redsglow", "/site-assets/Redsglow-Logo.png"],
    ["WeAdvice Hosting", "/site-assets/WeAdviceHosting.jpg"],
    ["Pearl Lemon", "/site-assets/pearl-lemon-logo.webp"],
  ],
  Products: [
    ["WP Bulk Publisher", "/site-assets/WpBulkPublisher.png"],
    ["My Tasko", "/site-assets/My-Tasko.png"],
    ["ImgConvertly", "/site-assets/ImgConvertly-1.png"],
    ["Fix My Speaker", "/site-assets/Fix-My-Speaker-1.png"],
    ["UJ Online", "/site-assets/Can_UJonline.png"],
    ["Redsglow tools", "/site-assets/Tools-Redsglow.png"],
  ],
} as const;

type PortfolioTab = keyof typeof PORTFOLIO;

const DELAYS = [
  [
    "Family events",
    "Important family responsibilities can occasionally move a meeting or milestone.",
  ],
  [
    "Health issues",
    "Unexpected health conditions or medical appointments may temporarily affect availability.",
  ],
  [
    "Technical outages",
    "Platform, hosting, power, or connectivity incidents can interrupt work for a short period.",
  ],
  [
    "Client dependencies",
    "Missing access, content, approvals, or feedback can pause the next delivery step.",
  ],
  [
    "Scope changes",
    "New requirements are reviewed openly so the schedule and price stay realistic.",
  ],
  [
    "Public holidays",
    "Regional holidays and planned time away are communicated before work begins.",
  ],
] as const;

const AWARDS = [
  ["Foundations", "/site-assets/foundations-river-image__1_-1.webp"],
  ["Lapa Ninja", "/site-assets/ll343zssrpmwtvd2vdxit66e46ed-1.webp"],
  ["Gemini", "/site-assets/Gemini_Generated_Image_5ghg9q5ghg9q5ghg-1-e1752937634868.png"],
  ["Best Design", "/site-assets/best-design-awards-2025.svg"],
  ["Design recognition", "/site-assets/images-1.webp"],
  ["DevSpot", "/site-assets/Devspot.svg"],
] as const;

const COUNTRIES = [
  ["Australia", "au"],
  ["Canada", "ca"],
  ["France", "fr"],
  ["Germany", "de"],
  ["United Arab Emirates", "ae"],
  ["United Kingdom", "gb"],
  ["United States", "us"],
  ["India", "in"],
  ["Japan", "jp"],
  ["Singapore", "sg"],
] as const;

const RELATED_ARTICLES = [
  {
    title: "The Evolution from SEO to GEO: How AI Search Engines Changed Optimization Forever",
    href: "/marketing/geo/whats-trending/evolution-seo-geo-how-ai-search-engines-changed-optimization-forever",
    date: "October 27, 2025",
    image: "/site-assets/2024-07-23-145529-desktop-1-7.png",
  },
  {
    title: "Web3, Metaverse, And AI: Next Decade's Digital Shapes",
    href: "/web3/blockchain-outlook/metaverse-ai-future-decade",
    date: "September 17, 2025",
    image: "/site-assets/Tools-Redsglow.jpg",
  },
  {
    title: "DeFi 2024-2025: Regulation, Growth, And Next Moves",
    href: "/web3/blockchain-outlook/defi-2024-2025-regulation-growth-next-moves",
    date: "September 17, 2025",
    image: "/site-assets/Verves1100001.jpg",
  },
] as const;

function displayDate(value?: string | null) {
  if (!value) return "Imported from WordPress";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Imported from WordPress";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function youtubeEmbed(value?: string | null) {
  if (!value) return null;
  const id = value.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/,
  )?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function SectionTitle({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverse?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-xs font-semibold uppercase ${inverse ? "text-white/55" : "text-neutral-500"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-semibold leading-tight md:text-5xl ${inverse ? "text-white" : "text-neutral-950"}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-7 ${inverse ? "text-white/65" : "text-neutral-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function ServiceArticle({
  service,
  children,
  childCount,
}: {
  service: ServiceArticleData;
  children: ServiceChild[];
  childCount: number;
}) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("Creative work");
  const [processPage, setProcessPage] = useState(0);
  const [activeDelay, setActiveDelay] = useState(0);
  const [contactState, setContactState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const title = service.h1 || service.structured?.hero?.title || service.title;
  const intro =
    service.structured?.hero?.subtitle || service.paragraphs?.[0] || service.excerpt || "";
  const structured = service.structured || {};
  const highlights = (
    structured.hero?.features?.length ? structured.hero.features : service.bullets || []
  )
    .filter(Boolean)
    .slice(0, 6);
  const solutions = structured.services?.services?.filter((item) => item.title) || [];
  const processSteps = structured.process?.steps?.filter((item) => item.title) || [];
  const expertise = structured.about?.bullets?.filter((item) => item.heading) || [];
  const faqs = structured.faqs?.faqs?.filter((item) => item.question && item.answer) || [];
  const videoUrl = youtubeEmbed(structured.promoVideo);
  const sections = service.sections || {};
  const transformationImage =
    service.fifu_image_url ||
    "/site-assets/Businessman-with-Rainbow-Lightbulb-Head-e1752653622894-745x1024.jpg";
  const processItems = processSteps.length
    ? processSteps
    : [
        {
          step_number: 1,
          title: "Discovery and needs assessment",
          description: "Clarify the problem, audience, constraints, and definition of success.",
        },
        {
          step_number: 2,
          title: "Research and strategy",
          description: "Choose the right scope, tools, sequence, and measurable milestones.",
        },
        {
          step_number: 3,
          title: "Delivery and handover",
          description: "Build, review, improve, document, and hand over the finished work.",
        },
      ];
  const maxProcessPage = Math.max(0, processItems.length - 3);

  const filteredChildren = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return children;
    return children.filter((child) =>
      `${child.title} ${child.excerpt || ""}`.toLowerCase().includes(needle),
    );
  }, [children, query]);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setContactState("sending");
    const { error } = await supabase.from("contact_submissions").insert({
      name: String(data.get("name") || "").trim() || "Anonymous",
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      looking_for: service.title,
      message: String(data.get("message") || "").trim(),
      source_path: typeof window !== "undefined" ? window.location.pathname : service.path,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    if (error) setContactState("error");
    else {
      setContactState("done");
      form.reset();
    }
  }

  return (
    <main className="bg-white text-neutral-950">
      <section className="bg-neutral-950 px-6 pb-16 pt-32 text-center text-white md:pb-20 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase text-white/70">
            Service page
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">{service.title}</h1>
          <nav
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/60"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/services" className="hover:text-white">
              My services
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{service.title}</span>
          </nav>
        </div>
      </section>

      <nav
        className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur"
        aria-label="Service sections"
      >
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-4 text-sm font-medium lg:px-10">
          {[
            ["Overview", "#overview"],
            ["Solutions", "#solutions"],
            ["Process", "#process"],
            ["Portfolio", "#portfolio"],
            ["Directory", "#directory"],
            ["FAQs", "#faqs"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap text-neutral-600 hover:text-neutral-950"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className="scroll-mt-20 border-b border-neutral-200 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
            {intro && <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">{intro}</p>}
            <ul className="mt-7 space-y-3">
              {(highlights.length
                ? highlights
                : [
                    "Clear scope before work begins",
                    "Direct communication and ownership",
                    "Responsive delivery and handover",
                    "Built for measurable outcomes",
                  ]
              )
                .slice(0, 5)
                .map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-neutral-700"
                  >
                    <Check className="mt-1 h-4 w-4 flex-none text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
            {structured.hero?.description && (
              <p className="mt-7 max-w-xl leading-7 text-neutral-600">
                {structured.hero.description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#book-call"
                className="inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 p-[2px] font-semibold"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm text-white">
                  Book a call <Sparkles className="h-4 w-4" />
                </span>
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:border-neutral-950"
              >
                Our work
              </a>
            </div>
            <p className="mt-5 text-xs text-neutral-600">
              <span className="text-amber-500">★★★★★</span> 4.9/5 client rating
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
            <img
              src={transformationImage}
              alt={`${service.title} service`}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl border-t border-neutral-200 px-6 pt-10 lg:px-10">
          <p className="text-center text-lg font-semibold">
            Trusted by 20+ brands for premium digital services
          </p>
          <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {NETWORK_LOGOS.slice(0, 6).map(([name, src]) => (
              <img
                key={name}
                src={src}
                alt={name}
                loading="lazy"
                className="mx-auto h-7 max-w-[118px] object-contain grayscale"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-10">
          <div className="relative min-h-[480px] overflow-hidden rounded-lg bg-neutral-200">
            <img
              src="/site-assets/Usman-Jatoi-Official.webp"
              alt="Usman Jatoi"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              {structured.about?.title || `About my expertise in ${service.title}`}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
              {structured.about?.intro ||
                service.paragraphs?.[1] ||
                `Hands-on ${service.title.toLowerCase()} support shaped around your goals, systems, and audience.`}
            </p>
            <div className="mt-7">
              {(expertise.length
                ? expertise
                : [
                    {
                      heading: "My expertise",
                      description:
                        "Practical systems, clear decisions, and implementation support.",
                      list: service.bullets?.slice(0, 3),
                    },
                    {
                      heading: `How I help with ${service.title}`,
                      description: "A focused engagement designed around the result you need.",
                      list: service.bullets?.slice(3, 6),
                    },
                  ]
              ).map((group) => (
                <details
                  key={group.heading}
                  className="group mb-3 rounded-lg border border-neutral-300 bg-white px-5 py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    <span>{group.heading}</span>
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  {group.description && (
                    <p className="pt-5 leading-7 text-neutral-600">{group.description}</p>
                  )}
                  {group.list && (
                    <ul className="mt-4 space-y-2">
                      {group.list.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700">
                          <Check className="mt-1 h-4 w-4 flex-none" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              ))}
            </div>
            {structured.about?.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-3xl leading-7 text-neutral-600">
                {paragraph}
              </p>
            ))}
            <a
              href="#contact"
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 p-[2px] font-semibold"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm">
                Visit now <Sparkles className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-20 border-y border-neutral-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white">
              {service.title} services
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
              {structured.services?.section_title ||
                `Explore our diverse ${service.title} solutions tailored for your needs.`}
            </h2>
            {structured.services?.section_subtitle && (
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-600">
                {structured.services.section_subtitle}
              </p>
            )}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(solutions.length
              ? solutions
              : highlights.map((item) => ({
                  title: item,
                  description: `A tailored ${service.title.toLowerCase()} engagement built around this outcome.`,
                  tags: [] as string[],
                }))
            ).map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={
                  index === 0
                    ? "rounded-lg bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 p-[2px]"
                    : ""
                }
              >
                <article
                  className={`flex min-h-64 flex-col rounded-lg border border-neutral-200 bg-white p-7 ${index === 0 ? "h-full border-0" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <Layers3 className="h-5 w-5 text-neutral-400" />
                    <span className="text-xs text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-4 flex-1 leading-7 text-neutral-600">{item.description}</p>
                  )}
                  {item.tags && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-10">
          <SectionTitle
            eyebrow="Tools and platforms"
            title="A modern stack selected for the work, not forced onto it"
            description="I choose tools around your requirements, existing systems, security needs, and ability to maintain the result."
          />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
            {TOOL_LOGOS.map(([name, src]) => (
              <div key={name} className="grid min-h-36 place-items-center bg-white p-7">
                <img
                  src={src}
                  alt={name}
                  loading="lazy"
                  className="max-h-12 max-w-[150px] object-contain"
                />
              </div>
            ))}
            <div className="grid min-h-36 place-items-center bg-neutral-950 p-7 text-center text-sm font-semibold text-white">
              Plus the specialist stack your project requires
            </div>
          </div>
        </div>
      </section>

      {videoUrl && (
        <section className="border-y border-neutral-200 bg-neutral-50 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
            <div>
              <Play className="h-8 w-8" />
              <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
                See the thinking and work behind the service
              </h2>
              <p className="mt-5 leading-7 text-neutral-600">
                A short look at the process, experiments, and practical approach used across client
                work.
              </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={videoUrl}
                title={`${service.title} service video`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      <section id="process" className="scroll-mt-20 bg-neutral-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-neutral-950 px-4 py-2 text-xs font-semibold uppercase">
                Step-by-step process
              </span>
              <h2 className="mt-6 text-3xl font-semibold md:text-5xl">Our process</h2>
            </div>
            <div>
              <p className="max-w-2xl leading-7 text-neutral-600">
                Our process is designed for one thing: results. Proven strategy and careful
                execution keep every decision and delivery step visible.
              </p>
              <a
                href="#book-call"
                className="mt-7 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 p-[2px] font-semibold"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-8 py-3 text-sm text-white">
                  Visit now <Sparkles className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
          <div className="relative mt-12">
            <div className="grid gap-5 md:grid-cols-3">
              {processItems.slice(processPage, processPage + 3).map((step, index) => (
                <article
                  key={`${step.title}-${index}`}
                  className="flex min-h-80 flex-col items-center rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                    {step.step_number || processPage + index + 1}
                  </span>
                  <h3 className="mt-8 text-xl font-semibold leading-8">{step.title}</h3>
                  {step.description && (
                    <p className="mt-4 leading-7 text-neutral-600">{step.description}</p>
                  )}
                </article>
              ))}
            </div>
            {processItems.length > 3 && (
              <>
                <button
                  type="button"
                  aria-label="Previous process steps"
                  onClick={() => setProcessPage((page) => Math.max(0, page - 1))}
                  disabled={processPage === 0}
                  className="absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neutral-300 bg-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next process steps"
                  onClick={() => setProcessPage((page) => Math.min(maxProcessPage, page + 1))}
                  disabled={processPage === maxProcessPage}
                  className="absolute right-0 top-1/2 grid h-11 w-11 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neutral-300 bg-white disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="mt-7 flex justify-center gap-2">
                  {Array.from({ length: maxProcessPage + 1 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show process group ${index + 1}`}
                      onClick={() => setProcessPage(index)}
                      className={`h-2 w-2 rounded-full ${index === processPage ? "bg-neutral-950" : "bg-neutral-300"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {sections._cached_industries_block && (
        <section className="border-y border-neutral-200 bg-neutral-50 py-20">
          <div
            className="service-rich-html mx-auto max-w-7xl px-6 lg:px-10"
            dangerouslySetInnerHTML={{ __html: sections._cached_industries_block }}
          />
        </section>
      )}

      <section id="portfolio" className="scroll-mt-20 bg-neutral-950 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionTitle
            eyebrow="Selected work"
            inverse
            title="Explore my portfolio"
            description="Brand, product, website, and creative work drawn from the original service-page portfolio."
          />
          <div
            role="tablist"
            aria-label="Portfolio categories"
            className="mt-9 flex gap-2 overflow-x-auto border-b border-white/20 pb-4"
          >
            {(Object.keys(PORTFOLIO) as PortfolioTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={portfolioTab === tab}
                onClick={() => setPortfolioTab(tab)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${portfolioTab === tab ? "bg-white text-neutral-950" : "border border-white/25 text-white/70 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO[portfolioTab].map(([name, src]) => (
              <figure key={name} className="group overflow-hidden rounded-lg bg-white">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={src}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-4 text-sm font-semibold text-neutral-950">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Understanding potential service delays
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-7 text-neutral-600">
              These are uncommon situations that may cause short service delays. They are shared
              openly for full transparency.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Potential service delays"
            className="mt-10 grid overflow-hidden rounded-[28px] border border-neutral-950 sm:grid-cols-2 lg:grid-cols-6"
          >
            {DELAYS.map(([heading], index) => (
              <button
                key={heading}
                type="button"
                role="tab"
                aria-selected={activeDelay === index}
                onClick={() => setActiveDelay(index)}
                className={`min-h-14 border-neutral-300 px-4 text-sm transition sm:border-r ${activeDelay === index ? "bg-neutral-950 text-white" : "bg-white hover:bg-neutral-100"}`}
              >
                {heading}
              </button>
            ))}
          </div>
          <p
            role="tabpanel"
            className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-neutral-600"
          >
            {DELAYS[activeDelay][1]}
          </p>
        </div>
      </section>

      <section id="book-call" className="scroll-mt-20 bg-neutral-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <h2 className="text-center text-3xl font-semibold md:text-5xl">
            Book a call with me to discuss your project in detail
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-white/65">
            Get expert advice and customized solutions for your project. No pressure, just useful
            next steps.
          </p>
          <CalEmbed className="mt-10 min-h-[720px] overflow-hidden rounded-lg border border-white/15 bg-neutral-950" />
        </div>
      </section>

      {children.length > 0 && (
        <section
          id="directory"
          className="scroll-mt-20 border-y border-neutral-200 bg-neutral-50 py-20 md:py-28"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <SectionTitle
                eyebrow="Full service directory"
                title={`Explore every ${service.title} service`}
                description={`${childCount.toLocaleString()} imported child and specialist service pages. Search by the exact outcome or discipline you need.`}
              />
              <label className="flex w-full max-w-sm items-center gap-2 border-b border-neutral-500 py-3 text-sm focus-within:border-neutral-950">
                <Search className="h-4 w-4 text-neutral-500" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(18);
                  }}
                  placeholder="Search services"
                  className="w-full bg-transparent outline-none placeholder:text-neutral-400"
                />
              </label>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChildren.slice(0, visibleCount).map((child, index) => (
                <a
                  key={child.href}
                  href={child.href}
                  className="group block border-b border-neutral-300 pb-6"
                >
                  <div className="aspect-[16/9] overflow-hidden rounded-lg bg-neutral-200">
                    {child.featured_image ? (
                      <img
                        src={child.featured_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-neutral-950 text-sm text-white/55">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase text-neutral-500">
                    {service.title}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug group-hover:underline">
                    {child.title}
                  </h3>
                  {child.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                      {child.excerpt}
                    </p>
                  )}
                </a>
              ))}
            </div>
            {filteredChildren.length === 0 && (
              <p className="py-16 text-center text-neutral-500">
                No services match &quot;{query}&quot;.
              </p>
            )}
            {visibleCount < filteredChildren.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 18)}
                  className="rounded-full border border-neutral-950 px-6 py-3 text-sm font-semibold transition hover:bg-neutral-950 hover:text-white"
                >
                  Show more services ({(filteredChildren.length - visibleCount).toLocaleString()}{" "}
                  remaining)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-lg bg-neutral-950 p-7 text-white md:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl">Awards and recognition</h2>
                <p className="mt-3 text-sm text-white/60">Achievements that tell the real story.</p>
              </div>
              <Link
                to="/awards"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white px-5 py-2.5 text-xs font-semibold uppercase"
              >
                Explore all awards <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {AWARDS.map(([name, src]) => (
                <div
                  key={name}
                  className="grid min-h-28 place-items-center rounded-md bg-white/5 p-5"
                >
                  <img
                    src={src}
                    alt={name}
                    loading="lazy"
                    className="max-h-16 max-w-full object-contain brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <Globe2 className="mx-auto h-7 w-7" />
            <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
              We are global to empower you
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-600">
              Delivering projects worldwide with clients across top countries. Geography is never a
              barrier.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {COUNTRIES.map(([name, code]) => (
              <div
                key={code}
                className="flex min-h-16 items-center justify-center gap-3 rounded-md bg-neutral-100 p-4"
              >
                <img
                  src={`/site-assets/${code}.svg`}
                  alt=""
                  loading="lazy"
                  className="h-5 w-7 object-cover"
                />
                <span className="text-xs font-medium text-neutral-700">{name}</span>
              </div>
            ))}
          </div>
          <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-center">
            <div>
              <dt className="text-xl font-semibold">450+</dt>
              <dd className="mt-2 text-xs text-neutral-500">Projects delivered</dd>
            </div>
            <div>
              <dt className="text-xl font-semibold">100+</dt>
              <dd className="mt-2 text-xs text-neutral-500">Countries served</dd>
            </div>
            <div>
              <dt className="text-xl font-semibold">Worldwide</dt>
              <dd className="mt-2 text-xs text-neutral-500">Global clients</dd>
            </div>
          </dl>
          <div className="mt-8 text-center">
            <a
              href="/locations"
              className="inline-flex rounded-full bg-neutral-950 px-7 py-3 text-sm font-semibold text-white"
            >
              View all locations
            </a>
          </div>
          {sections._cached_locations_block_v4 && (
            <details className="service-location-details mt-12 border-t border-neutral-200 pt-7">
              <summary className="cursor-pointer font-semibold">
                View the complete imported location coverage
              </summary>
              <div
                className="service-rich-html mt-8"
                dangerouslySetInnerHTML={{ __html: sections._cached_locations_block_v4 }}
              />
            </details>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-neutral-200"
          style={{
            backgroundImage: "url('/site-assets/Redsglow-Banner.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative max-w-2xl p-8 md:p-14">
            <p className="text-xs font-semibold uppercase">Want to hire an agency?</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
              One team for strategy, creative, technology, and growth
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-neutral-800">
              From marketing to automation, technical development to management, creative design to
              operations, Redsglow delivers it under one roof.
            </p>
            <a
              href="https://redsglow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Visit Redsglow <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">Read our blogs</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.7fr_.9fr]">
            <a
              href={RELATED_ARTICLES[0].href}
              className="group relative min-h-[420px] overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              <img
                src={RELATED_ARTICLES[0].image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent p-7 pt-28 md:p-10">
                <time className="text-xs text-neutral-500">{RELATED_ARTICLES[0].date}</time>
                <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-snug group-hover:underline md:text-3xl">
                  {RELATED_ARTICLES[0].title}
                </h3>
              </div>
            </a>
            <div className="grid gap-5">
              {RELATED_ARTICLES.slice(1).map((article) => (
                <a
                  key={article.href}
                  href={article.href}
                  className="group relative min-h-48 overflow-hidden rounded-lg bg-neutral-950 p-6 text-white"
                >
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-25 transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="relative flex h-full flex-col justify-end">
                    <time className="text-xs text-white/60">{article.date}</time>
                    <h3 className="mt-3 text-lg font-semibold leading-7 group-hover:underline">
                      {article.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            {faqs.length ? (
              faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-neutral-950 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold uppercase">
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="h-5 w-5 flex-none transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="max-w-4xl pb-2 pt-5 leading-7 text-neutral-600">{faq.answer}</p>
                </details>
              ))
            ) : sections.faqs ? (
              <div
                className="service-rich-html"
                dangerouslySetInnerHTML={{ __html: sections.faqs }}
              />
            ) : (
              <p className="text-neutral-600">
                Bring your questions to the booking call and I will answer them directly.
              </p>
            )}
          </div>
        </div>
      </section>

      {!service.structured && service.content && (
        <section className="border-y border-neutral-200 bg-neutral-50 py-20">
          <div
            className="service-rich-html mx-auto max-w-6xl px-6 lg:px-10"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        </section>
      )}

      <section id="contact" className="scroll-mt-20 mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="overflow-hidden rounded-lg bg-neutral-950 text-white md:grid md:grid-cols-2">
          <form onSubmit={submitContact} className="space-y-4 p-7 md:p-10">
            <p className="text-xs font-semibold uppercase text-white/55">Contact</p>
            <h2 className="text-3xl font-semibold">Tell me what you want to build</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
            />
            <textarea
              name="message"
              required
              rows={6}
              placeholder={`Tell me about your ${service.title} project`}
              className="w-full resize-y bg-white px-4 py-3 text-neutral-950 outline-none"
            />
            <button
              disabled={contactState === "sending"}
              className="w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {contactState === "sending"
                ? "Sending..."
                : contactState === "done"
                  ? "Message sent"
                  : "Send enquiry"}
            </button>
            <p role="status" className="text-sm text-white/65">
              {contactState === "error"
                ? "The form could not submit. Email contact@usmanjatoi.com instead."
                : contactState === "done"
                  ? "Thanks. I will get back to you shortly."
                  : "Prefer email? contact@usmanjatoi.com"}
            </p>
          </form>
          <div className="relative min-h-[520px]">
            <img
              src="/site-assets/Usman-Jatoi-Contact-Us-image.webp"
              alt="Usman Jatoi"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/65" />
            <div className="absolute bottom-0 p-8 md:p-10">
              <p className="max-w-md text-sm leading-7">
                I believe in collaborating with smart, diverse, and creative people, then giving
                them the clarity and room to do excellent work.
              </p>
              <p className="mt-4 font-semibold">Usman Jatoi</p>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .service-process-row { scroll-snap-type:x mandatory; scrollbar-width:thin; }
        .service-rich-html { color:#262626; font-size:16px; line-height:1.75; }
        .service-rich-html h2,.service-rich-html h3,.service-rich-html h4 { color:#0a0a0a; line-height:1.15; }
        .service-rich-html h2 { margin:0 0 18px; font-size:clamp(28px,4vw,46px); font-weight:650; }
        .service-rich-html h3 { margin:0 0 12px; font-size:clamp(20px,2vw,26px); font-weight:650; }
        .service-rich-html p { margin:0 0 16px; color:#525252; }
        .service-rich-html a { color:#111; text-decoration:underline; text-underline-offset:3px; }
        .service-rich-html ul,.service-rich-html ol { margin:16px 0; padding-left:22px; }
        .service-rich-html li { margin:8px 0; }
        .service-rich-html .migrated-grid,.service-rich-html .wbb-flag-grid,.service-rich-html .locations-grid,.service-rich-html .industry-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin-top:28px; }
        .service-rich-html .migrated-grid article,.service-rich-html .wbb-flag-card-link,.service-rich-html .industry-card { display:block; border:1px solid #d4d4d4; background:#fff; padding:18px; border-radius:8px; text-decoration:none; }
        .service-rich-html details { border-bottom:1px solid #262626; padding:18px 0; }
        .service-rich-html summary { cursor:pointer; list-style:none; display:flex; justify-content:space-between; gap:20px; color:#111; font-weight:650; }
        .service-rich-html summary::-webkit-details-marker { display:none; }
        .service-rich-html summary::after { content:"+"; font-size:22px; font-weight:400; }
        .service-rich-html details[open] summary::after { content:"-"; }
        .service-rich-html table { min-width:680px; width:100%; border-collapse:collapse; }
        .service-rich-html th,.service-rich-html td { border:1px solid #d4d4d4; padding:12px; text-align:left; vertical-align:top; }
        .service-rich-html th { background:#111; color:#fff; }
        .service-rich-html img { max-width:100%; height:auto; }
        .service-rich-html-dark,.service-rich-html-dark h2,.service-rich-html-dark h3,.service-rich-html-dark h4,.service-rich-html-dark p,.service-rich-html-dark a { color:#fff; }
        .service-rich-html-dark .wbb-flag-card-link,.service-rich-html-dark .industry-card { background:#171717; border-color:#404040; }
        .service-location-details summary::-webkit-details-marker { display:none; }
        @media (max-width:700px) {
          .service-rich-html .migrated-grid,.service-rich-html .wbb-flag-grid,.service-rich-html .locations-grid,.service-rich-html .industry-grid { grid-template-columns:1fr; }
        }
      `,
        }}
      />
    </main>
  );
}
