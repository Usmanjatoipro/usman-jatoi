import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  ExternalLink,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  PackageCheck,
  Palette,
  RefreshCw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";

const PAGE_URL = "https://usmanjatoi.com/shop/NuvoxDigitalStudio";
const ETSY_SHOP_URL = "https://www.etsy.com/shop/NuvoxDigitalStudio";
const ETSY_CONTACT_URL =
  "https://www.etsy.com/messages/new?with_id=1249524161&referring_id=68019867&referring_type=shop&recipient_id=1249524161";

const BANNER_IMAGE = "/site-assets/nuvox-banner.jpg";
const AVATAR_IMAGE = "/site-assets/nuvox-avatar.jpg";

const PRODUCT_CATEGORIES = [
  {
    icon: Download,
    title: "Digital Downloads & Resources",
    description:
      "Instant-access creative assets, vector illustrations, design toolkits, and curated files designed to elevate personal and commercial projects.",
    badge: "Instant Delivery",
  },
  {
    icon: Palette,
    title: "Templates & Printable Designs",
    description:
      "Thoughtfully structured planners, business stationery, forms, and invitations. Crafted with meticulous typography and print-ready formatting.",
    badge: "Editable & Print-Ready",
  },
  {
    icon: Truck,
    title: "Print-on-Demand Physical Products",
    description:
      "Original physical merchandise manufactured and shipped directly to your door through trusted production partners like Printify.",
    badge: "Ships Worldwide",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Precision Art",
    description:
      "Modern creative assets crafted through custom workflows combining cutting-edge AI technology with rigorous human direction and editing.",
    badge: "Curated Workflows",
  },
];

const SHOP_POLICIES = [
  {
    icon: CreditCard,
    title: "Accepted Payment Methods",
    description:
      "Accepts Etsy Gift Cards, Etsy Credits, Visa, MasterCard, American Express, Discover, PayPal, Apple Pay, and Google Pay through Etsy's secure checkout.",
  },
  {
    icon: PackageCheck,
    title: "Instant Digital Downloads",
    description:
      "Your digital files are made available for immediate download the moment your payment is confirmed. No waiting for shipping.",
  },
  {
    icon: Truck,
    title: "Physical Order Fulfillment",
    description:
      "Physical goods are custom printed and fulfilled on demand by professional production partners including Printify, with full tracking provided.",
  },
  {
    icon: RefreshCw,
    title: "Returns, Exchanges & Support",
    description:
      "Digital downloads are non-returnable once downloaded. If you identify any defect or genuine error in a file, message us for a prompt corrected version.",
  },
];

const FAQS = [
  {
    q: "Are your products created by you?",
    a: "Yes. Our digital products are created by NuvoxDigitalStudio using our own specialized tools, workflows, creative processes, design systems, and AI-assisted technology.",
  },
  {
    q: "Do you use AI in your products?",
    a: "Yes. AI may be used as part of our creative, research, design, writing, or production workflow. We combine AI with our own tools, instructions, creative direction, and editing to create the final product.",
  },
  {
    q: "Can AI-generated or AI-assisted content contain mistakes?",
    a: "Yes. Like any creative or automated tool, AI can occasionally produce errors such as typos, unusual wording, small visual imperfections, incorrect details, or unexpected design elements. We review our products carefully, but minor errors may occasionally remain. If you notice an issue, please contact us so we can review it.",
  },
  {
    q: "Do you guarantee that digital products are completely error-free?",
    a: "We do our best to check every product before publishing, but we cannot guarantee that every file will be completely free from spelling errors, formatting issues, AI-related imperfections, software compatibility differences, or other minor mistakes.",
  },
  {
    q: "Should customers review editable files before using them?",
    a: "Yes. For editable templates, documents, planners, business materials, invitations, or similar products, we recommend reviewing all names, dates, wording, measurements, spelling, and other important information before printing, publishing, or using the final version.",
  },
  {
    q: "How are your physical products made?",
    a: "Our physical product designs are created and managed by NuvoxDigitalStudio. Printing, manufacturing, packaging, and shipping may be handled by professional third-party production partners such as Printify and other fulfillment providers.",
  },
  {
    q: "What if I find an error in a digital product?",
    a: "Please send us a message through Etsy and explain the issue. If there is a genuine error in one of our files, we will review it and, where appropriate, provide an updated or corrected version.",
  },
];

const ECOSYSTEM_LINKS = [
  {
    title: "NuvoxDigitalStudio on Etsy",
    desc: "Official Etsy storefront for direct downloads and physical merchandise orders.",
    url: ETSY_SHOP_URL,
    isExternal: true,
  },
  {
    title: "BuildOnVibe.site",
    desc: "Vibe coding showcase, AI development experiments, and rapid micro-apps.",
    url: "https://buildonvibe.site/",
    isExternal: true,
  },
  {
    title: "WpBulkPublishing.com",
    desc: "Enterprise WordPress programmatic publishing and ecosystem automation engine.",
    url: "https://wpbulkpublishing.com/",
    isExternal: true,
  },
  {
    title: "Usman Jatoi Home & Portfolio",
    desc: "Personal hub for consulting, web engineering, articles, and full project archives.",
    url: "/",
    isExternal: false,
  },
];

export const Route = createFileRoute("/shop_/NuvoxDigitalStudio")({
  head: () => ({
    meta: [
      { title: "Nuvox Digital Studio — Creative Digital & Physical Products | Usman Jatoi" },
      {
        name: "description",
        content:
          "Welcome to NuvoxDigitalStudio: A creative shop offering premium digital downloads, templates, printable designs, and print-on-demand physical products.",
      },
      {
        property: "og:title",
        content: "Nuvox Digital Studio — Creative Digital & Physical Products",
      },
      {
        property: "og:description",
        content:
          "Creative digital downloads, templates, printable designs, and print-on-demand physical products made to be useful, unique, and beautiful.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: "https://usmanjatoi.com" + BANNER_IMAGE },
      { property: "og:site_name", content: "Usman Jatoi" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Nuvox Digital Studio — Creative Digital & Physical Products",
      },
      {
        name: "twitter:description",
        content:
          "Creative digital downloads, templates, printable designs, and print-on-demand physical products made to be useful, unique, and beautiful.",
      },
      { name: "twitter:image", content: "https://usmanjatoi.com" + BANNER_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: NuvoxEtsyProductPage,
});

function NuvoxEtsyProductPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Custom Design / Template Request",
    message: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setSubmitState("submitting");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: null,
        looking_for: `NuvoxDigitalStudio: ${form.topic}`,
        message: form.message.trim(),
        source_path: "/shop/NuvoxDigitalStudio",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });

      if (error) {
        throw error;
      }

      setSubmitState("success");
      setStatusMessage(
        "Thank you! Your message has been received. We will get back to you shortly.",
      );
      setForm({
        name: "",
        email: "",
        topic: "Custom Design / Template Request",
        message: "",
      });
    } catch {
      const mailtoSubject = encodeURIComponent(`Nuvox Digital Studio Inquiry: ${form.topic}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`,
      );
      window.location.href = `mailto:contact@usmanjatoi.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      setSubmitState("success");
      setStatusMessage("Opening your email client to send your inquiry directly.");
    }
  }

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "NuvoxDigitalStudio",
    description:
      "A creative shop offering a mix of premium digital products and thoughtfully designed physical items.",
    image: "https://usmanjatoi.com" + BANNER_IMAGE,
    url: PAGE_URL,
    sameAs: [ETSY_SHOP_URL, "https://buildonvibe.site/", "https://wpbulkpublishing.com/"],
    areaServed: "United States, Worldwide",
    founder: {
      "@type": "Person",
      name: "Usman Jatoi",
      url: "https://usmanjatoi.com",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Global Hero with Breadcrumbs */}
      <PageHero
        eyebrow="Etsy Creative Shop"
        title="Nuvox Digital Studio"
        description="Creative digital & physical products made to be useful, unique, and beautiful."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Nuvox Digital Studio" },
        ]}
      />

      {/* Shop Profile & Banner Section */}
      <section className="border-b border-neutral-200 bg-neutral-950 text-white">
        {/* Banner Graphic */}
        <div className="relative mx-auto max-w-6xl overflow-hidden border-x border-white/10">
          <div className="aspect-[4/1] w-full overflow-hidden bg-neutral-900">
            <img
              src={BANNER_IMAGE}
              alt="Nuvox Digital Studio Official Banner"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>

          {/* Floating Shop Header Bar */}
          <div className="relative border-t border-white/10 bg-neutral-950/95 px-6 py-6 backdrop-blur-md md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Avatar + Shop Info */}
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#FF6A00] bg-neutral-900 shadow-xl">
                  <img
                    src={AVATAR_IMAGE}
                    alt="NuvoxDigitalStudio Avatar"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-neutral-950 bg-emerald-400" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                      NuvoxDigitalStudio
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Etsy Shop
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#FF6A00]" />
                      United States
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span>On Etsy since 2026</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-300">Digital Downloads & Physical Goods</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={ETSY_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6A00]/25 transition hover:bg-[#e55f00] hover:scale-[1.02]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop on Etsy
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>

                <a
                  href={ETSY_CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                >
                  <Mail className="h-4 w-4 text-[#FF6A00]" />
                  Contact on Etsy
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline & Core Mission Banner */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-10">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
            Get Premium, Useful, and Creative Products
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
            Creative Digital & Physical Products Made to Be Useful, Unique, and Beautiful
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Welcome to NuvoxDigitalStudio, a creative shop offering a mix of premium digital
            products and thoughtfully designed physical items. Our goal is simple: to create
            products that are useful, visually appealing, and made to add value to your everyday
            life, work, business, or special moments.
          </p>
        </div>
      </section>

      {/* About the Studio Section */}
      <section className="bg-white py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Story Text */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
                Our Creative Journey
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
                About NuvoxDigitalStudio
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-700 md:text-base">
                <p>
                  Our shop includes digital downloads, creative resources, templates, printable
                  designs, and print-on-demand physical products. Each design is created with
                  attention to detail, usability, quality, and modern style.
                </p>
                <p>
                  For our physical products, we work with trusted production partners who help us
                  professionally print, prepare, and ship our original designs directly to you.
                </p>
                <p>
                  Whether you&rsquo;re downloading a digital product instantly or ordering something
                  physical for yourself or as a gift, we want every purchase from NuvoxDigitalStudio
                  to feel creative, useful, and worth having.
                </p>
                <p className="font-medium text-neutral-950">
                  We are always exploring new ideas, improving our designs, and adding fresh
                  products to the shop. Thank you for visiting NuvoxDigitalStudio and supporting our
                  creative journey.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={ETSY_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#FF6A00]"
                >
                  Explore All Items on Etsy
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#inquiry"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-black hover:text-black"
                >
                  Custom Design Request
                </a>
              </div>
            </div>

            {/* Visual Box with Local Assets */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <ShoppingBag className="h-3.5 w-3.5 text-[#FF6A00]" />
                    <span className="font-medium text-white">Etsy Storefront</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    etsy.com/shop/NuvoxDigitalStudio
                  </span>
                </div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={BANNER_IMAGE}
                    alt="Nuvox Banner artwork"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xl font-bold text-neutral-950">Instant</div>
                  <div className="text-xs text-neutral-500">Digital file access post-purchase</div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xl font-bold text-neutral-950">Printify</div>
                  <div className="text-xs text-neutral-500">Professional fulfillment partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="border-t border-neutral-200 bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
              Shop Offerings
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              What You&rsquo;ll Find at NuvoxDigitalStudio
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              A curated blend of instant digital design resources and premium print-on-demand goods
              for creators, professionals, and design enthusiasts.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-[#FF6A00] hover:bg-neutral-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 text-[#FF6A00] transition group-hover:bg-[#FF6A00] group-hover:text-white">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-300">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">{cat.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-400">{cat.description}</p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <a
                    href={ETSY_SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6A00] transition hover:underline"
                  >
                    Browse Items
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Policies & Ordering Guidelines */}
      <section className="border-t border-neutral-200 bg-white py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Customer Confidence
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              Shop Policies & Guarantees
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              Clear, transparent operating terms so you can purchase digital downloads and physical
              merchandise with peace of mind.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SHOP_POLICIES.map((pol) => (
              <div
                key={pol.title}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <pol.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-neutral-950">{pol.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{pol.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-xs text-neutral-500">
            Policies last updated on 14 Sept, 2026. Protected under standard Etsy buyer protection.
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Exact from Etsy) */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
              Official FAQ
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
              Clear answers regarding our creative process, AI usage, file reviews, and physical
              production standards.
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
                    <span className="text-sm md:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#FF6A00]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-100 px-5 pb-6 pt-4 text-xs leading-relaxed text-neutral-700 md:text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connected Websites & Ecosystem Links */}
      <section className="border-t border-neutral-200 bg-white py-16 text-neutral-950 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6A00]">
              Network
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              The Nuvox & Usman Jatoi Ecosystem
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs text-neutral-600 md:text-sm">
              Discover connected platforms, software automation tools, and creative project hubs.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM_LINKS.map((eco) =>
              eco.isExternal ? (
                <a
                  key={eco.title}
                  href={eco.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-black hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Globe className="h-5 w-5 text-[#FF6A00]" />
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-black" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-neutral-950">{eco.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">{eco.desc}</p>
                </a>
              ) : (
                <Link
                  key={eco.title}
                  to={eco.url as never}
                  className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-black hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Globe className="h-5 w-5 text-[#FF6A00]" />
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-black" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-neutral-950">{eco.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">{eco.desc}</p>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Custom Inquiry / Contact Form */}
      <section
        id="inquiry"
        className="border-t border-neutral-200 bg-neutral-950 py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl md:p-12">
            <div className="text-center">
              <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
                Direct Contact
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Have a Question or Custom Request?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-neutral-400 md:text-sm">
                Need a tailored digital template, bulk printable bundle, or custom physical design?
                Send us a message and we will respond within 24 hours.
              </p>
            </div>

            {submitState === "success" ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center text-emerald-200">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                <h4 className="mt-3 text-base font-semibold text-white">Message Sent</h4>
                <p className="mt-2 text-xs leading-relaxed text-emerald-300">{statusMessage}</p>
                <button
                  onClick={() => setSubmitState("idle")}
                  className="mt-6 rounded-full border border-emerald-400/40 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-400/20"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Topic / Subject
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                  >
                    <option value="Custom Design / Template Request">
                      Custom Design / Template Request
                    </option>
                    <option value="Question about an Etsy Order">
                      Question about an Etsy Order
                    </option>
                    <option value="Digital Download Error / Correction">
                      Digital Download Error / Correction
                    </option>
                    <option value="Wholesale / Print-on-Demand Partnership">
                      Wholesale / Print-on-Demand Partnership
                    </option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you are looking for, file specifications, or details about your question..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6A00] py-4 text-sm font-semibold text-white shadow-lg shadow-[#FF6A00]/25 transition hover:bg-[#e55f00] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submitState === "submitting" ? "Sending Details..." : "Send Message"}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-400">
                  <span>Prefer Etsy messaging?</span>
                  <a
                    href={ETSY_CONTACT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6A00] underline hover:text-white"
                  >
                    Send message directly on Etsy
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="border-t border-neutral-800 bg-black px-5 py-8 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-[#FF6A00]" />
            <span>NuvoxDigitalStudio • On Etsy since 2026 • United States</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF6A00]"
            >
              Visit Etsy Storefront
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-neutral-700">|</span>
            <Link to="/shop" className="text-xs text-neutral-400 hover:text-white">
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
