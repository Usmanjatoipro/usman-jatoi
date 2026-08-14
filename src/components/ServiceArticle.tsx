import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bot,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Cog,
  Compass,
  Eye,
  FileText,
  Globe2,
  Info,
  LineChart,
  type LucideIcon,
  Megaphone,
  Palette,
  PenTool,
  Plus,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Wrench,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CalEmbed from "@/components/CalEmbed";
import HeroLoopList from "@/components/HeroLoopList";
import ProcessSlider from "@/components/ProcessSlider";
import GlobalFlags, { type FlagEntry } from "@/components/GlobalFlags";
import { coverImageUrl } from "@/components/PostCover";

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
  bullets?: Array<{ heading?: string; description?: string; list?: string[] }>;
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
  steps?: Array<{ step_number?: number; title?: string; description?: string }>;
};

type ServiceFaqs = { faqs?: Array<{ question?: string; answer?: string }> };

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

export type ServiceRelatedPost = {
  title: string;
  href: string;
  excerpt?: string | null;
  date?: string | null;
  slug: string;
};

/* ---------------------------------------------------------------- data --- */

const NETWORK_LOGOS: [string, string][] = [
  ["Wix", "/site-assets/Wix-Logo-1024x398.webp"],
  ["Bricks Builder", "/site-assets/BrickBuilder-logo-1-e1752473525426.webp"],
  ["Shopify", "/site-assets/Shopify-Logo-1024x322.webp"],
  ["Windsurf", "/site-assets/windsurf-black-wordmark.webp"],
  ["Replit", "/site-assets/Replit_logo.webp"],
  ["Medium", "/site-assets/Medium-Logo-scaled-e1753187413358-1024x196.png"],
  ["Wikidata", "/site-assets/wikidatawiki-wordmark.svg"],
  ["TED", "/site-assets/TED_three_letter_logo.svg-1024x376.webp"],
];

const TOOL_LOGOS: [string, string][] = [
  ["Elementor", "/site-assets/elementor-logo-freelogovectors.net_-1024x202.webp"],
  ["Cursor", "/site-assets/cursor-logo-words-e1752653818550.jpg"],
  ["BuildShip", "/site-assets/BuildShip.png.webp"],
  ["Axiom", "/site-assets/axiom-e1752654626677.jpeg"],
  ["Anakin", "/site-assets/Anakin-Logo.png"],
];

const PORTFOLIO: Record<string, [string, string][]> = {
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
};

const DELAYS: [string, string][] = [
  ["Family events", "Important family responsibilities can occasionally move a meeting or milestone."],
  ["Health issues", "Unexpected health conditions or medical appointments may temporarily affect availability."],
  ["Technical outages", "Platform, hosting, power, or connectivity incidents can interrupt work for a short period."],
  ["Client dependencies", "Missing access, content, approvals, or feedback can pause the next delivery step."],
  ["Scope changes", "New requirements are reviewed openly so the schedule and price stay realistic."],
  ["Public holidays", "Regional holidays and planned time away are communicated before work begins."],
];

const AWARDS: [string, string][] = [
  ["Foundations", "/site-assets/foundations-river-image__1_-1.webp"],
  ["Lapa Ninja", "/site-assets/ll343zssrpmwtvd2vdxit66e46ed-1.webp"],
  ["Gemini", "/site-assets/Gemini_Generated_Image_5ghg9q5ghg9q5ghg-1-e1752937634868.png"],
  ["Best Design", "/site-assets/best-design-awards-2025.svg"],
  ["Design recognition", "/site-assets/images-1.webp"],
  ["DevSpot", "/site-assets/Devspot.svg"],
];

const FLAGS: FlagEntry[] = [
  { code: "us", flag: "🇺🇸", country: "United States", note: "Coast-to-coast delivery" },
  { code: "gb", flag: "🇬🇧", country: "United Kingdom", note: "London to Manchester" },
  { code: "ca", flag: "🇨🇦", country: "Canada", note: "Toronto and Vancouver" },
  { code: "au", flag: "🇦🇺", country: "Australia", note: "Sydney and Melbourne" },
  { code: "de", flag: "🇩🇪", country: "Germany", note: "Berlin and Munich" },
  { code: "fr", flag: "🇫🇷", country: "France", note: "Paris and Lyon" },
  { code: "ae", flag: "🇦🇪", country: "United Arab Emirates", note: "Dubai and Abu Dhabi" },
  { code: "sg", flag: "🇸🇬", country: "Singapore", note: "APAC operations" },
  { code: "in", flag: "🇮🇳", country: "India", note: "Bengaluru and Mumbai" },
  { code: "jp", flag: "🇯🇵", country: "Japan", note: "Tokyo and Osaka" },
];

const ICONS: [RegExp, LucideIcon][] = [
  [/robot|agent|bot/i, Bot],
  [/brain|ai|ml|machine/i, Brain],
  [/eye|vision|camera/i, Eye],
  [/chart|analytic|dashboard|graph/i, BarChart3],
  [/shield|secur|risk|lock/i, ShieldCheck],
  [/video|film|reel|play/i, Video],
  [/paint|palette|brush|design|creative/i, Palette],
  [/pen|write|content|blog|copy/i, PenTool],
  [/search|seo|magnif/i, Search],
  [/bullhorn|megaphone|market|pr|press/i, Megaphone],
  [/server|cloud|database|infra/i, Server],
  [/cog|gear|process|operation|automation/i, Cog],
  [/tool|wrench|build|develop/i, Wrench],
  [/users|team|people|support/i, Users],
  [/rocket|launch|startup|growth/i, Rocket],
  [/globe|world|web|site/i, Globe2],
  [/file|doc|report|sop/i, FileText],
  [/trend|line|invest|monet/i, LineChart],
  [/compass|strateg|consult/i, Compass],
  [/bolt|zap|fast|speed/i, Zap],
];

function iconFor(name?: string, fallbackSeed = ""): LucideIcon {
  const key = `${name || ""} ${fallbackSeed}`;
  for (const [pattern, Icon] of ICONS) if (pattern.test(key)) return Icon;
  return Sparkles;
}

const VIDEO_SLUGS = /video|dubbing|reel|creative|content|marketing|social/i;
const PORTFOLIO_FOR_SLUG: [RegExp, string][] = [
  [/creative|design|dubbing|game|brand/i, "Creative work"],
  [/web3|web|digital|technical|product/i, "Websites"],
  [/pr|marketing|social|lead|monet/i, "Brands"],
  [/ai|operations|startup|management|support|training|consulting/i, "Products"],
];

/* ------------------------------------------------------------- helpers --- */

function stripTags(value?: string | null) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function displayDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function youtubeEmbed(value?: string | null) {
  if (!value) return null;
  const id = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function localHref(href: string) {
  try {
    const url = href.startsWith("http") ? new URL(href) : null;
    return url ? url.pathname : href;
  } catch {
    return href;
  }
}

/* ---------------------------------------------------------- UI helpers --- */

function SectionHead({
  eyebrow,
  title,
  description,
  inverse = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverse?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
          inverse ? "border-white/20 text-white/70" : "border-neutral-200 text-neutral-500"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-bold leading-[1.08] tracking-tight md:text-[44px] ${
          inverse ? "text-white" : "text-neutral-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[17px] leading-8 ${inverse ? "text-white/65" : "text-neutral-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Card with subtle 3D pointer tilt + a thin gradient hairline on hover. */
function TiltCard({
  children,
  className = "",
  inverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--uj-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`group relative overflow-hidden transition-transform duration-200 will-change-transform ${
        inverse ? "bg-neutral-950" : "bg-white"
      } ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, #FF6A00 20%, #ffb27a 50%, #FF6A00 80%, transparent)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--uj-x,50%) 0%, rgba(255,106,0,.10), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

function Accordion({
  items,
  tone = "light",
}: {
  items: { heading: string; description?: string; list?: string[] }[];
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(0);
  const dark = tone === "dark";
  return (
    <div className={`divide-y ${dark ? "divide-white/12" : "divide-neutral-200"}`}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.heading} className="py-4">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 text-left"
            >
              <span
                className={`text-lg font-bold ${dark ? "text-white" : "text-neutral-950"} ${
                  isOpen ? "text-[#FF6A00]" : ""
                }`}
              >
                {item.heading}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-none transition-transform ${isOpen ? "rotate-180 text-[#FF6A00]" : dark ? "text-white/50" : "text-neutral-400"}`}
              />
            </button>
            {isOpen && (
              <div className="pt-3">
                {item.description && (
                  <p className={`leading-7 ${dark ? "text-white/70" : "text-neutral-600"}`}>
                    {item.description}
                  </p>
                )}
                {item.list && item.list.length > 0 && (
                  <HeroLoopList
                    items={item.list}
                    visible={Math.min(3, item.list.length)}
                    tone={dark ? "dark" : "light"}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- layout --- */

export default function ServiceArticle({
  service,
  children,
  childCount,
  related = [],
  industries = [],
  locations = [],
}: {
  service: ServiceArticleData;
  children: ServiceChild[];
  childCount: number;
  related?: ServiceRelatedPost[];
  industries?: ServiceChild[];
  locations?: ServiceChild[];
}) {
  const structured = service.structured || {};
  const sections = service.sections || {};
  const title = stripTags(service.h1 || structured.hero?.title || service.title);
  const subtitle = stripTags(structured.hero?.subtitle || service.paragraphs?.[0] || service.excerpt);
  const heroDescription = stripTags(structured.hero?.description || service.paragraphs?.[1] || "");
  const features = (structured.hero?.features || service.bullets || []).filter(Boolean).map(stripTags);
  const solutions = (structured.services?.services || []).filter((item) => item.title);
  const processSteps = (structured.process?.steps || []).filter((item) => item.title);
  const expertise = (structured.about?.bullets || [])
    .filter((item) => item.heading)
    .map((item) => ({
      heading: stripTags(item.heading),
      description: stripTags(item.description),
      list: (item.list || []).map(stripTags).filter(Boolean),
    }));
  const faqs = (structured.faqs?.faqs || []).filter((item) => item.question && item.answer);
  const videoUrl = youtubeEmbed(structured.promoVideo);
  const showVideo = Boolean(videoUrl) && VIDEO_SLUGS.test(`${service.slug} ${service.title}`);
  const portfolioTabName =
    PORTFOLIO_FOR_SLUG.find(([pattern]) => pattern.test(`${service.slug} ${service.title}`))?.[1] ||
    null;
  const portfolioItems = portfolioTabName ? PORTFOLIO[portfolioTabName] : null;
  const heroImage = service.fifu_image_url || coverImageUrl(service.slug);

  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [agencyTab, setAgencyTab] = useState<"industries" | "locations">("industries");
  const [openFaq, setOpenFaq] = useState(0);
  const [contactState, setContactState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const filteredChildren = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return children;
    return children.filter((child) =>
      `${child.title} ${child.excerpt || ""}`.toLowerCase().includes(needle),
    );
  }, [children, query]);

  const toc = useMemo(
    () =>
      [
        ["About my expertise", "#overview"],
        solutions.length ? [`${service.title} services`, "#solutions"] : null,
        processSteps.length ? ["My process", "#process"] : null,
        portfolioItems ? ["Portfolio", "#portfolio"] : null,
        childCount ? ["Full service directory", "#directory"] : null,
        ["Global coverage", "#global"],
        related.length ? ["Related reading", "#blogs"] : null,
        faqs.length ? ["FAQs", "#faqs"] : null,
        ["Contact", "#contact"],
      ].filter(Boolean) as [string, string][],
    [solutions.length, processSteps.length, portfolioItems, childCount, related.length, faqs.length, service.title],
  );

  useEffect(() => setVisibleCount(12), [query]);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setContactState("sending");
    const interest = String(data.get("interest") || "").trim();
    const { error } = await supabase.from("contact_submissions").insert({
      name: String(data.get("name") || "").trim() || "Anonymous",
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      looking_for: interest ? `${service.title} — ${interest}` : service.title,
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
      {/* ------------------------------------------------- breadcrumb band */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 8% 0%, rgba(255,106,0,.22), transparent 60%), radial-gradient(50% 50% at 90% 20%, rgba(255,106,0,.12), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
            {service.title} services
          </p>
          <p className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">{service.title}</p>
          <nav
            className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/60"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/services" className="hover:text-white">
              Services
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* ------------------------------------------------------------ hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-neutral-950 md:text-6xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">{subtitle}</p>
            )}

            {features.length > 0 && <HeroLoopList items={features} visible={3} tone="light" />}

            {heroDescription && (
              <p className="mt-6 max-w-2xl leading-7 text-neutral-500">{heroDescription}</p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-7 py-3.5 font-bold text-white transition hover:bg-[#ff8124]"
              >
                Book a free call <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-7 py-3.5 font-bold text-neutral-900 transition hover:bg-neutral-950 hover:text-white"
              >
                Explore {service.title.toLowerCase()} solutions
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <span className="flex" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FF6A00] text-[#FF6A00]" />
                  ))}
                </span>
                4.9/5 from 127 client reviews
              </span>
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-[#FF6A00]" /> Award-winning delivery
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#FF6A00]" /> 450+ projects, 50+ countries
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200">
              <img
                src={heroImage}
                alt={`${service.title} services by Usman Jatoi`}
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 pt-20 text-white">
                <p className="text-lg font-bold">Usman Jatoi</p>
                <p className="mt-1 text-sm text-white/70">
                  Independent {service.title.toLowerCase()} practitioner — strategy, build, handover.
                </p>
              </div>
            </div>
            {childCount > 0 && (
              <div className="absolute -left-5 bottom-10 hidden rounded-2xl border border-white/15 bg-neutral-950/90 px-5 py-4 text-white backdrop-blur lg:block">
                <p className="text-3xl font-bold text-[#FF6A00]">{childCount}</p>
                <p className="text-xs uppercase tracking-widest text-white/60">
                  specialist pages
                </p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* -------------------------------------------------------- trusted by */}
      <section className="border-b border-neutral-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
            Trusted by 20+ brands for premium {service.title.toLowerCase()} work
          </p>
          <div className="mt-8 grid grid-cols-3 items-center gap-x-8 gap-y-8 sm:grid-cols-5 lg:grid-cols-9">
            {NETWORK_LOGOS.map(([name, src]) => (
              <img
                key={name}
                src={src}
                alt={name}
                loading="lazy"
                className="mx-auto h-8 max-w-[120px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ))}
            <a
              href="#contact"
              className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-500 transition hover:border-[#FF6A00] hover:text-[#FF6A00]"
              title="Add your logo — become a client"
              aria-label="Add your logo — become a client"
            >
              <Plus className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- overview */}
      <section id="overview" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src="/site-assets/Usman-Jatoi-Official.webp"
              alt="Usman Jatoi"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
              <p className="font-bold">Hands-on, not hands-off</p>
              <p className="mt-1 text-sm text-white/75">
                You work directly with me — no account-manager relay.
              </p>
            </div>
          </div>
          <div>
            <SectionHead
              eyebrow="About my expertise"
              title={stripTags(structured.about?.title) || `About my expertise in ${service.title}`}
              description={
                stripTags(structured.about?.intro) ||
                `Practical ${service.title.toLowerCase()} support shaped around your goals, systems, and audience.`
              }
            />
            {(structured.about?.paragraphs || []).map((paragraph) => (
              <p key={paragraph} className="mt-5 leading-7 text-neutral-600">
                {stripTags(paragraph)}
              </p>
            ))}
            <div className="mt-8">
              <Accordion
                items={
                  expertise.length
                    ? expertise
                    : [
                        {
                          heading: "My expertise",
                          description: "Practical systems, clear decisions, and implementation support.",
                          list: features.slice(0, 4),
                        },
                        {
                          heading: `How I help with ${service.title}`,
                          description: "A focused engagement designed around the result you need.",
                          list: features.slice(4, 8),
                        },
                      ]
                }
              />
            </div>
            <p className="mt-8 leading-7 text-neutral-600">
              Every {service.title.toLowerCase()} engagement is scoped around your systems, your
              team, and the outcome you are measured on — then handed over with documentation so
              nothing depends on me forever.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-7 py-3.5 font-bold text-white transition hover:bg-[#ff8124]"
              >
                Visit now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#directory"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-7 py-3.5 font-bold text-neutral-900 transition hover:bg-neutral-950 hover:text-white"
              >
                Browse all {service.title.toLowerCase()} pages
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------- presence + networks */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead
            eyebrow="Online presence & networks"
            title="Experience across the tools and ecosystems your work depends on"
          />
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-3 lg:grid-cols-5">
            {[...NETWORK_LOGOS.slice(0, 5), ...TOOL_LOGOS].map(([name, src]) => (
              <div key={`${name}-${src}`} className="grid min-h-28 place-items-center bg-white p-6">
                <img
                  src={src}
                  alt={name}
                  loading="lazy"
                  className="max-h-10 max-w-[145px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- solutions */}
      {solutions.length > 0 && (
        <section id="solutions" className="scroll-mt-24 bg-neutral-950 py-20 text-white md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="Explore my services"
              inverse
              title={
                stripTags(structured.services?.section_title) ||
                `Explore my ${service.title.toLowerCase()} solutions`
              }
              description={
                stripTags(structured.services?.section_subtitle) ||
                `A focused set of ${service.title.toLowerCase()} solutions — with a full specialist directory below.`
              }
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {solutions.map((item) => {
                const Icon = iconFor(item.icon, item.title);
                const href = localHref(item.link || "");
                const inner = (
                  <TiltCard
                    inverse
                    className="h-full rounded-2xl border border-white/12 p-7 hover:border-white/25"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6A00]/12 text-[#FF6A00]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold leading-snug">{stripTags(item.title)}</h3>
                    {item.description && (
                      <p className="mt-3 text-sm leading-7 text-white/65">
                        {stripTags(item.description)}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider text-white/60"
                          >
                            {stripTags(tag)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {href && (
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF6A00]">
                        View service <ArrowUpRight className="h-4 w-4" />
                      </span>
                    )}
                  </TiltCard>
                );
                return href ? (
                  <a key={item.title} href={href} className="block h-full">
                    {inner}
                  </a>
                ) : (
                  <div key={item.title}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- tools */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead
            eyebrow="Stack"
            title={`Tools, platforms, and technologies I work with for ${service.title.toLowerCase()}`}
          />
          <div className="mt-10 grid grid-cols-3 items-center gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4 lg:grid-cols-7">
            {[...TOOL_LOGOS, ...NETWORK_LOGOS].map(([name, src]) => (
              <div key={`${name}-chip`} className="grid min-h-24 place-items-center bg-white p-5">
                <img
                  src={src}
                  alt={name}
                  title={name}
                  loading="lazy"
                  className="max-h-9 max-w-[120px] object-contain opacity-70 transition hover:opacity-100"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------------- process */}
      {processSteps.length > 0 && (
        <section id="process" className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="My process"
              title="From discovery to a result your team can actually use"
              description="Each engagement follows the same transparent path — you always know the current step and what comes next."
            />
            <div className="mt-12">
              <ProcessSlider
                steps={processSteps.map((step, index) => ({
                  n: String(step.step_number || index + 1).padStart(2, "0"),
                  t: stripTags(step.title),
                  d: stripTags(step.description),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- video */}
      {showVideo && videoUrl && (
        <section className="bg-neutral-950 py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead eyebrow="Highlight" inverse title={`${service.title} in motion`} />
            <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-white/12">
              <iframe
                src={videoUrl}
                title={`${service.title} highlight video`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- portfolio */}
      {portfolioItems && (
        <section id="portfolio" className="scroll-mt-24 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="Portfolio"
              title={`${portfolioTabName} relevant to ${service.title.toLowerCase()}`}
              description="A snapshot of shipped work in the same discipline as this service."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map(([name, src]) => (
                <TiltCard
                  key={name}
                  className="overflow-hidden rounded-2xl border border-neutral-200"
                >
                  <img src={src} alt={name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <p className="px-5 py-4 font-semibold">{name}</p>
                </TiltCard>
              ))}
            </div>
            <Link
              to="/portfolio"
              className="mt-8 inline-flex items-center gap-2 font-bold text-[#FF6A00]"
            >
              See the full portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- delays */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead
            eyebrow="Transparency"
            title="Understanding potential service delays"
            description="Rare, but honest: these are the only reasons a milestone ever moves. Hover any badge for detail."
          />
          <ul className="mt-8 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DELAYS.map(([label, detail]) => (
              <li key={label} className="group relative flex-none snap-start">
                <span className="inline-flex cursor-help items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition group-hover:border-[#FF6A00]">
                  <Info className="h-4 w-4 flex-none text-[#FF6A00]" />
                  {label}
                </span>
                <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 whitespace-normal rounded-xl bg-neutral-950 p-4 text-sm leading-6 text-white/85 shadow-xl group-hover:block">
                  {detail}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </section>

      {/* --------------------------------------------------------- directory */}
      {children.length > 0 && (
        <section id="directory" className="scroll-mt-24 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="Directory"
              title={`All ${childCount} ${service.title.toLowerCase()} pages`}
              description="Every specialist page under this service — searchable."
            />
            <label className="mt-8 flex max-w-md items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3">
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${service.title.toLowerCase()} services`}
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Search services"
              />
            </label>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredChildren.slice(0, visibleCount).map((child) => (
                <a key={child.href} href={child.href} className="block h-full">
                  <TiltCard className="h-full rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300">
                    <h3 className="text-base font-bold leading-snug">{child.title}</h3>
                    {child.excerpt && (
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{child.excerpt}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF6A00]">
                      Open <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </TiltCard>
                </a>
              ))}
            </div>
            {filteredChildren.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((value) => value + 18)}
                className="mt-8 rounded-full border border-neutral-300 px-6 py-3 font-bold transition hover:bg-neutral-950 hover:text-white"
              >
                Show more ({filteredChildren.length - visibleCount} left)
              </button>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- book call */}
      <section id="book-call" className="scroll-mt-24 bg-neutral-950 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead
            eyebrow="Booking"
            inverse
            center
            title={`Book a call about ${service.title.toLowerCase()}`}
            description="Pick a slot that works for you — we will scope the work together, no pressure."
          />
          <CalEmbed className="mt-10 min-h-[680px] overflow-hidden rounded-2xl border border-white/12 bg-neutral-950" />
        </div>
      </section>

      {/* ------------------------------------------------------------ awards */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead eyebrow="Recognition" title="Awards and recognition" />
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {AWARDS.map(([name, src]) => (
              <div
                key={name}
                className="grid min-h-32 place-items-center rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <img src={src} alt={name} loading="lazy" className="max-h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ global */}
      <section id="global" className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionHead
                eyebrow="Global"
                title="We are global to empower you"
                description={`Location-specific ${service.title.toLowerCase()} delivery, with local context and worldwide standards.`}
              />
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  ["450+", "Projects"],
                  ["50+", "Countries"],
                  ["24/7", "Comms"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-bold text-[#FF6A00]">{value}</p>
                    <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <GlobalFlags entries={FLAGS} slug={service.slug} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ hire agency */}
      {(industries.length > 0 ||
        locations.length > 0 ||
        sections._cached_industries_block ||
        sections._cached_locations_block_v4) && (
        <section className="relative isolate overflow-hidden bg-neutral-950 py-20 text-white md:py-28">
          <img
            src="/site-assets/Redsglow-Banner.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="Scale up"
              inverse
              title="Want to hire an agency instead?"
              description="Bigger scope? My team covers industry-specific programmes and location-specific delivery for this service."
            />
            <div className="mt-8 flex gap-2 rounded-full border border-white/15 p-1 text-sm font-bold sm:w-fit">
              {(
                [
                  ["industries", `Industries we serve${industries.length ? ` (${industries.length})` : ""}`],
                  ["locations", `Locations we serve${locations.length ? ` (${locations.length})` : ""}`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAgencyTab(key)}
                  className={`rounded-full px-5 py-2.5 transition ${
                    agencyTab === key ? "bg-[#FF6A00] text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {(agencyTab === "industries" ? industries : locations).length > 0 ? (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(agencyTab === "industries" ? industries : locations).slice(0, 60).map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex h-full items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/[.04] px-5 py-4 text-sm font-semibold transition hover:border-[#FF6A00] hover:bg-white/[.08]"
                    >
                      <span className="leading-6">{item.title}</span>
                      <ArrowUpRight className="h-4 w-4 flex-none text-[#FF6A00]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="uj-service-block mt-8 rounded-2xl border border-white/12 bg-white/[.04] p-6 md:p-9"
                dangerouslySetInnerHTML={{
                  __html:
                    (agencyTab === "industries"
                      ? sections._cached_industries_block
                      : sections._cached_locations_block_v4) ||
                    sections._cached_industries_block ||
                    sections._cached_locations_block_v4 ||
                    "",
                }}
              />
            )}
          </div>

        </section>
      )}

      {/* -------------------------------------------------------------- toc */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              On this page
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {toc.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-neutral-700 hover:text-[#FF6A00]"
                  >
                    <ChevronRight className="h-4 w-4 text-[#FF6A00]" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- blogs */}
      {related.length > 0 && (
        <section id="blogs" className="scroll-mt-24 pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHead
              eyebrow="Read my blogs"
              title={`Latest ${service.title.toLowerCase()} writing`}
              description="Research-backed articles from the same topic cluster as this service."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <a href={related[0].href} className="block">
                <TiltCard className="h-full overflow-hidden rounded-2xl border border-neutral-200">
                  <img
                    src={coverImageUrl(related[0].slug)}
                    alt={related[0].title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      {displayDate(related[0].date)}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold leading-snug">{related[0].title}</h3>
                    {related[0].excerpt && (
                      <p className="mt-3 leading-7 text-neutral-600">{related[0].excerpt}</p>
                    )}
                  </div>
                </TiltCard>
              </a>
              <div className="grid gap-5">
                {related.slice(1, 3).map((post) => (
                  <a key={post.href} href={post.href} className="block">
                    <TiltCard className="grid h-full gap-5 rounded-2xl border border-neutral-200 sm:grid-cols-[.45fr_.55fr]">
                      <img
                        src={coverImageUrl(post.slug)}
                        alt={post.title}
                        loading="lazy"
                        className="h-full min-h-40 w-full object-cover"
                      />
                      <div className="p-6 pl-0 sm:pl-0">
                        <p className="text-xs uppercase tracking-widest text-neutral-500">
                          {displayDate(post.date)}
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-snug">{post.title}</h3>
                      </div>
                    </TiltCard>
                  </a>
                ))}
              </div>
            </div>
            {related.length > 3 && (
              <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {related.slice(3, 7).map((post) => (
                  <li key={post.href}>
                    <a
                      href={post.href}
                      className="block h-full rounded-xl border border-neutral-200 p-5 text-sm font-semibold leading-6 transition hover:border-[#FF6A00]"
                    >
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------- faq */}
      {faqs.length > 0 && (
        <section id="faqs" className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <SectionHead eyebrow="FAQ" center title="Frequently asked questions" />
            <div className="mt-10 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 p-6 text-left"
                    >
                      <span className="font-bold">{stripTags(faq.question)}</span>
                      <ChevronDown
                        className={`h-5 w-5 flex-none transition-transform ${isOpen ? "rotate-180 text-[#FF6A00]" : "text-neutral-400"}`}
                      />
                    </button>
                    {isOpen && (
                      <p className="px-6 pb-6 leading-7 text-neutral-600">
                        {stripTags(faq.answer)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- contact */}
      <section id="contact" className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 text-white lg:grid-cols-[1.05fr_.95fr]">
            <form onSubmit={submitContact} className="p-8 md:p-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6A00]">
                Contact
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Tell me about your {service.title.toLowerCase()} project
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-white/65">
                Send the brief and I reply personally, usually within one business day.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className="rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#FF6A00]"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#FF6A00]"
                />
                <input
                  name="phone"
                  placeholder="Phone (optional)"
                  className="rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#FF6A00]"
                />
                <select
                  name="interest"
                  defaultValue=""
                  className="rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm text-white outline-none focus:border-[#FF6A00] [&>option]:text-neutral-900"
                  aria-label={`Which ${service.title} service do you need?`}
                >
                  <option value="">{`Any ${service.title.toLowerCase()} service`}</option>
                  {(solutions.length
                    ? solutions.map((item) => stripTags(item.title))
                    : children.slice(0, 25).map((child) => child.title)
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={`What do you need help with in ${service.title.toLowerCase()}?`}
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#FF6A00]"
              />
              <input type="hidden" name="service" value={service.title} />
              <button
                type="submit"
                disabled={contactState === "sending"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-8 py-3.5 font-bold text-white transition hover:bg-[#ff8124] disabled:opacity-60"
              >
                {contactState === "sending" ? "Sending…" : "Send"}
                <ArrowRight className="h-4 w-4" />
              </button>
              {contactState === "done" && (
                <p className="mt-4 text-sm font-semibold text-emerald-400">
                  Thank you — your {service.title.toLowerCase()} brief is with me.
                </p>
              )}
              {contactState === "error" && (
                <p className="mt-4 text-sm font-semibold text-red-400">
                  Something went wrong. Please email hello@usmanjatoi.com instead.
                </p>
              )}
            </form>

            <div className="relative isolate min-h-[420px] overflow-hidden">
              <img
                src="/site-assets/Usman-Jatoi-Contact-Us-image.webp"
                alt="Usman Jatoi"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
                <p className="text-xl font-bold leading-relaxed md:text-2xl">
                  “You talk to me directly — scope, build, and handover, with no account-manager
                  relay in between.”
                </p>
                <p className="mt-5 text-lg font-bold">Usman Jatoi</p>
                <p className="text-sm text-white/60">
                  Independent {service.title.toLowerCase()} practitioner
                </p>
                <ul className="mt-7 space-y-3 border-t border-white/12 pt-6 text-sm text-white/70">
                  {[
                    "Direct reply from me — not a sales team",
                    "Clear scope, timeline, and price before work starts",
                    "NDA-friendly and confidential by default",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 flex-none text-[#FF6A00]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      <style>{`
        .uj-service-block h2{font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:.5rem}
        .uj-service-block h3{font-size:1.1rem;font-weight:700;color:#fff;margin:1.2rem 0 .4rem}
        .uj-service-block p{color:rgba(255,255,255,.68);line-height:1.75;margin-bottom:.75rem}
        .uj-service-block ul{display:grid;gap:.5rem;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin:.75rem 0}
        .uj-service-block li{list-style:none;color:rgba(255,255,255,.8);font-size:.9rem;border:1px solid rgba(255,255,255,.12);border-radius:.75rem;padding:.6rem .9rem}
        .uj-service-block a{color:#FF6A00;text-decoration:none}
        .uj-service-block a:hover{text-decoration:underline}
        .uj-service-block table{width:100%;border-collapse:collapse;font-size:.9rem;color:rgba(255,255,255,.8)}
        .uj-service-block td,.uj-service-block th{border:1px solid rgba(255,255,255,.12);padding:.6rem}
        .uj-service-block meta{display:none}
      `}</style>
    </main>
  );
}
