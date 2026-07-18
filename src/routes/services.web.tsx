import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/services/web")({
  head: () => ({
    meta: [
      { title: "Web Design & Development — Services | Usman Jatoi" },
      {
        name: "description",
        content:
          "Custom web development, CMS builds (WordPress, Shopify, Wix, Squarespace, Drupal), and responsive design — built for real business outcomes.",
      },
      {
        property: "og:title",
        content: "Web Design & Development — Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Custom web dev, WordPress, Shopify, Wix, Squarespace, Drupal — functional, responsive, and built to convert.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/services/web",
      },
    ],
    links: [
      { rel: "canonical", href: "https://usmanjatoi.lovable.app/services/web" },
    ],
  }),
  component: WebServicesPage,
});

const promises = [
  "Custom web development that reflects your brand identity",
  "CMS options that make content management easy for you",
  "Responsive designs that feel great on every device",
  "Performance, SEO, and analytics baked in — not bolted on",
];

const stack = [
  "WordPress",
  "Elementor",
  "Divi",
  "Oxygen",
  "Breakdance",
  "Shopify",
  "Liquid",
  "Squarespace",
  "Wix",
  "Webflow",
  "Leadpages",
  "Drupal",
  "HTML/CSS/JS",
  "React",
  "TanStack",
  "Tailwind",
  "GitHub",
  "Copilot",
  "Lovable",
  "Replit",
];

const services = [
  {
    icon: "🅆",
    tag: "CMS · Web Development",
    title: "WordPress Development",
    body: "Stunning, easy-to-manage WordPress sites — Elementor, Divi, Oxygen, or Breakdance. Custom themes and plugins when the templates aren't enough.",
  },
  {
    icon: "🛍️",
    tag: "E-commerce · CMS",
    title: "Shopify Solutions",
    body: "Store setup, theme customization, Liquid/JSON edits, apps, and checkout tuning — for stores that actually convert.",
  },
  {
    icon: "🧩",
    tag: "CMS · Web Development",
    title: "Drupal Development",
    body: "Complex, scalable sites where flexibility and multi-editor workflows matter — Drupal built the right way.",
  },
  {
    icon: "🟧",
    tag: "CMS · Web Design",
    title: "Squarespace Websites",
    body: "Beautifully crafted Squarespace sites for creatives and small businesses — clean, quick to launch, easy to maintain.",
  },
  {
    icon: "⚙️",
    tag: "Custom · Web Development",
    title: "Custom Web Development",
    body: "Built from scratch when off-the-shelf can't cut it — React, TanStack, Node, and modern edge-hosted stacks.",
  },
  {
    icon: "🎯",
    tag: "CMS · Web Design",
    title: "Wix Website Creation",
    body: "Visually strong Wix sites with drag-and-drop flexibility — great for fast turnarounds and content-heavy pages.",
  },
];

const processSteps = [
  { n: "1", title: "Market research", body: "Analyze audience and competitors to uncover real user preferences." },
  { n: "2", title: "UX strategy", body: "Intuitive layouts and responsive designs that hold attention." },
  { n: "3", title: "Content", body: "Copy and visuals that resonate with the audience — not filler." },
  { n: "4", title: "SEO foundations", body: "On-page, meta, and schema baked in from day one." },
  { n: "5", title: "Analytics", body: "GA, Clarity, and Search Console wired for real feedback loops." },
  { n: "6", title: "Launch campaigns", body: "Targeted promotion to drive traffic and leads from launch day." },
  { n: "7", title: "Community", body: "Social engagement to build brand loyalty over time." },
  { n: "8", title: "Iterate", body: "Ongoing improvements based on user feedback and trends." },
];

const industries = [
  "SaaS",
  "E-commerce",
  "Agencies",
  "Creators",
  "Real Estate",
  "Health & Wellness",
  "Education",
  "Finance",
  "Local Services",
  "Hospitality",
  "Media",
  "Non-profits",
];

const countries = [
  "🇺🇸 US","🇬🇧 UK","🇨🇦 Canada","🇦🇺 Australia","🇩🇪 Germany","🇫🇷 France","🇮🇹 Italy","🇪🇸 Spain","🇳🇱 Netherlands","🇸🇪 Sweden","🇳🇴 Norway","🇨🇭 Switzerland","🇦🇪 UAE","🇸🇦 KSA","🇮🇳 India","🇸🇬 Singapore","🇯🇵 Japan","🇰🇷 South Korea","🇧🇷 Brazil","🇲🇽 Mexico","🇹🇷 Türkiye","🇵🇱 Poland","🇮🇪 Ireland","🇵🇰 Pakistan",
];

const delays = [
  { icon: "👨‍👩‍👧", label: "Family events" },
  { icon: "🩺", label: "Health issues" },
  { icon: "🚨", label: "Personal emergencies" },
  { icon: "🎉", label: "Public holidays" },
  { icon: "⚡", label: "Technical outages" },
];

const faqs = [
  {
    q: "How long does a typical website take?",
    a: "A focused marketing site lands in 2–4 weeks. Larger CMS builds and custom apps run 6–12 weeks depending on scope. You get a real timeline before we start.",
  },
  {
    q: "Do you handle both design and development?",
    a: "Yes — design, build, launch, and post-launch support. One point of contact, no hand-off gaps.",
  },
  {
    q: "Can you rescue or fix an existing site?",
    a: "Absolutely. Audits, speed fixes, SEO cleanup, redesigns, and migrations across WordPress, Shopify, Squarespace, and custom stacks.",
  },
  {
    q: "Will the site be easy for my team to edit?",
    a: "Yes. Every build ships with a short walkthrough and Loom docs so non-technical teammates can update content confidently.",
  },
  {
    q: "Do you handle hosting and domain setup?",
    a: "I can — or I can hand off clean instructions to your existing team. Whichever is easier for you.",
  },
  {
    q: "What about SEO and analytics?",
    a: "On-page SEO, schema, sitemaps, GA, and Clarity are standard. Deeper SEO campaigns are available as an add-on.",
  },
];

function WebServicesPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="hover:text-neutral-900">My Services</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Web – Design & Dev</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Services · Web Design & Development
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Comprehensive web solutions, tailored to your goals.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Functional, user-friendly websites built around your specific goals
            and constraints — not a template pack. Your site should work for
            you, not the other way around.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-neutral-800">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[linear-gradient(90deg,#ff2d55,#af52de)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact-me" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
              Book a call
            </Link>
            <Link to="/portfolio" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
              Our work
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <span>⭐⭐⭐⭐⭐ 4.9/5 · 127 reviews</span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span>🏆 Featured web designer</span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span>Trusted by 20+ brands</span>
          </div>
        </header>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            About my expertise
          </span>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Self-taught, battle-tested, and still shipping.
          </h2>
          <p className="mt-4 text-neutral-700 leading-relaxed">
            I'm a self-taught digital practitioner with hands-on experience
            across the full web stack. Building a website is often
            frustrating — my job is to make it easier and turn your vision
            into a working online presence.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            I've seen what works and what quietly breaks. I'll walk you
            through the process end-to-end, so the launch is smooth and the
            site keeps earning after go-live.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">Web services</h2>
          <p className="mt-2 text-neutral-600">Helping you build an impactful online presence.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <article key={s.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                    {s.icon}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">{s.tag}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Tools, platforms & technologies</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {stack.map((t) => (
              <li key={t} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Step-by-step process
          </span>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">How we deliver, every time</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Proven strategy plus flawless execution — the same process across every project.
          </p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {processSteps.map((p) => (
              <li key={p.n} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(90deg,#ff2d55,#af52de)] text-sm font-semibold text-white">
                    {p.n}
                  </div>
                  <h3 className="font-semibold">{p.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Industries I serve</h2>
          <p className="mt-2 text-neutral-600">Websites that work across sectors — B2B, B2C, and everything between.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700">
                {i}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Global by default</h2>
              <p className="mt-2 text-neutral-600">Delivering projects worldwide — geography is never a barrier.</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-semibold">450+</div>
                <div className="text-xs uppercase tracking-widest text-neutral-500">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">50+</div>
                <div className="text-xs uppercase tracking-widest text-neutral-500">Countries</div>
              </div>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {countries.map((c) => (
              <li key={c} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700">
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Understanding potential service delays</h2>
          <p className="mt-2 text-neutral-600">
            Uncommon situations that may cause short delays — shared openly for full transparency.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {delays.map((d) => (
              <li key={d.label} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
                <span className="text-lg">{d.icon}</span>
                <span>{d.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">FAQ</h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpen(open === i ? null : i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <span className="pr-4 font-medium text-neutral-900">{f.q}</span>
                  <span className={`text-2xl text-neutral-400 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                </div>
                {open === i && (
                  <div className="px-5 pb-6 pt-0 text-neutral-700 sm:px-6">{f.a}</div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Book a call to discuss your project
          </h2>
          <p className="mt-2 text-neutral-700">
            Get expert advice and custom-fit solutions — no pressure, just results.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact-me" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
              Book a call
            </Link>
            <Link to="/testimonials" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
              Testimonials
            </Link>
            <Link to="/awards" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
              Awards
            </Link>
          </div>
        </section>
      </section>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </main>
  );
}
