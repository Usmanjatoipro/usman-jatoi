import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/skills-expertise/technical-skills")({
  head: () => ({
    meta: [
      { title: "Technical Skills — Skills & Expertise | Usman Jatoi" },
      {
        name: "description",
        content:
          "Custom coding, WordPress plugins, automation, Chrome extensions, e-commerce, booking systems, PWAs — the technical stack Usman Jatoi ships with.",
      },
      {
        property: "og:title",
        content: "Technical Skills — Skills & Expertise | Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Building and fixing the digital world — web dev, WordPress, automation, extensions, e-commerce, and custom software.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content:
          "https://usmanjatoi.lovable.app/skills-expertise/technical-skills",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/skills-expertise/technical-skills",
      },
    ],
  }),
  component: TechnicalSkillsPage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "Web Dev",
    icon: "💻",
    title: "Web development & custom coding",
    paragraphs: [
      "I build websites from the ground up in core web languages — HTML for structure, CSS for style, JavaScript for behavior. For more involved apps, I use React.",
      "I write and ship in modern AI-native coding environments: Cursor, Windsurf, Bolt.new, Trae, Lovable, and Replit. Whatever the toolchain, the goal is the same — code that's clean, fast, and does exactly what the project needs.",
      "The technology has to serve the goal directly. Simpler and more effective always beats clever.",
    ],
  },
  {
    tag: "WordPress",
    icon: "🧩",
    title: "WordPress builds & custom plugins",
    paragraphs: [
      "WordPress is powerful when you push it. I build with Elementor (and Elementor Pro), Divi, Oxygen, StoneConcrete, Breakdance, and Bricks — matching the builder to what the site actually needs.",
      "Beyond building, I write custom plugins in PHP — over 1,000 of them. Image converters (like imgconvertly.com), IP display tools, YouTube thumbnail downloaders, and a header/footer code inserter.",
      "Currently building a drag-and-drop landing page builder in the spirit of Elementor Pro.",
    ],
  },
  {
    tag: "E-commerce",
    icon: "🛒",
    title: "E-commerce & platform-specific work",
    paragraphs: [
      "For online stores I build on Shopify — themes, Liquid, and JSON — so the storefront actually converts, not just looks nice.",
      "I also work in Wix, Webflow, and Leadpages, adding custom code where the built-in editor stops. Great example: a Leadpages campaign built for a legal firm with extended custom code.",
    ],
  },
  {
    tag: "Automation",
    icon: "🤖",
    title: "Automation & bot creation",
    paragraphs: [
      "Repetitive work is a tax. I remove it with Python + Selenium, Make, and n8n.",
      "One custom Python automation published 700+ web pages. Another is a bot that runs Google searches for specific keywords multiple times a day.",
      "The goal is speed and accuracy — humans focused on the interesting parts, machines doing the rest.",
    ],
  },
  {
    tag: "Extensions & Software",
    icon: "🧠",
    title: "Chrome extensions & software tools",
    paragraphs: [
      "I've built multiple Chrome extensions: SEO Researcher Pro (headings, links, images, meta, broken-image detection), a Leads Scraping extension, a Volume Booster, a Notesaver, and a Design Consistency Analyzer that audits websites for visual issues.",
      "On the desktop side, I've built with Electron and \"vibe coding\" — including FxSound (a sound booster), a To-Do List Reminder, and RedsBrowser, a functional web browser using Google Search. The apps are still in progress but they prove out the stack.",
    ],
  },
  {
    tag: "Booking & PWAs",
    icon: "🚀",
    title: "Specialized development",
    paragraphs: [
      "A big current project: a full booking plugin (75% complete). It handles flight searches, pet info, add-on services, payment processing, admin panel, bookings, tickets, waitlists — with Mailchimp, Stripe, and DocuSign integrations.",
      "On the PWA side, \"My Tasko\" is a React PWA at 50%, and more PWA experiments are in the pipeline for upcoming startups. Fast, installable, app-feeling — with none of the app-store friction.",
    ],
  },
  {
    tag: "Visual & 3D",
    icon: "🎨",
    title: "Graphic design & 3D work",
    paragraphs: [
      "Technical skill extends into visual work. I've delivered 300+ graphic design projects in Adobe Photoshop for websites and creative assets.",
      "For 3D depth when a project calls for it, I work in Blender.",
    ],
  },
];

const techStack = [
  "HTML", "CSS", "JavaScript", "React", "PHP", "Python", "Selenium",
  "WordPress", "Elementor", "Divi", "Oxygen", "Breakdance", "Bricks",
  "Shopify", "Liquid", "Wix", "Webflow", "Leadpages",
  "Make", "n8n", "Electron", "Chrome Extensions", "PWAs",
  "Blender", "Photoshop", "Cursor", "Windsurf", "Bolt.new", "Lovable", "Replit",
];

const stats = [
  { value: "5,000+", label: "Projects contributed" },
  { value: "1,000+", label: "Custom plugins" },
  { value: "190+", label: "Websites built" },
  { value: "19+", label: "Team members led" },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "What kind of custom coding do you do for websites?",
    a: "HTML for structure, CSS for styling, JavaScript for interactivity, and React for modern web applications. Everything is coded to the project's specific needs — no forced templates.",
  },
  {
    q: "What WordPress builders do you use, and do you create custom plugins?",
    a: "Elementor (and Pro), Divi, Oxygen, StoneConcrete, Breakdance, and Bricks. Yes — I've written 1,000+ custom PHP plugins, from image converters to header/footer code inserters, plus an in-progress drag-and-drop landing page builder.",
  },
  {
    q: "Can you help with automation or building bots?",
    a: "Yes. Python + Selenium, Make, and n8n. Real projects include a 700+ page publishing automation and a keyword-searching Google bot that runs on a schedule.",
  },
  {
    q: "What types of Chrome Extensions have you built?",
    a: "SEO Researcher Pro, a Leads Scraping extension, Volume Booster, Notesaver, and a Design Consistency Analyzer that audits sites for visual issues.",
  },
  {
    q: "Do you work on specific software or PWA development?",
    a: "Yes. Electron-based apps (FxSound, To-Do List Reminder, RedsBrowser) and React PWAs like My Tasko — with more PWAs planned for upcoming startups.",
  },
  {
    q: "What is your experience with e-commerce platforms?",
    a: "Shopify (themes, Liquid, JSON), Wix and Webflow via their editors plus custom code, and Leadpages for campaign landing pages.",
  },
  {
    q: "What have you learned from handling many different projects?",
    a: "Clear communication matters as much as clean code. Early on, I once resolved a browser display issue by recording a full video explanation — and it stuck as a habit for seeing jobs through to the end.",
  },
  {
    q: "Have you worked on complex systems like booking platforms?",
    a: "Yes — a booking plugin that's currently 75% complete. It covers flight search, pet info, add-ons, payments, admin panel, tickets, waitlists, and integrations with Mailchimp, Stripe, and DocuSign.",
  },
  {
    q: "What types of big projects have you handled, and what did you learn?",
    a: "5,000+ contributed projects, 190+ websites, custom plugin/extension/software work, and leading a team of 19+. The through-line: real-world constraints teach more than tutorials ever do.",
  },
];

function TechnicalSkillsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-neutral-900">Skills &amp; Expertise</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Technical Skills</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Skills &amp; Expertise · Technical Skills
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Building and fixing the digital world.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Ideas stall when technical skill runs out. I turn concepts into
            working systems — websites, plugins, automation, extensions,
            e-commerce, custom software.
          </p>
        </header>

        <section className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 text-center"
            >
              <div className="text-2xl font-semibold sm:text-3xl">
                <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
                  {s.value}
                </span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold sm:text-2xl">Tech stack</h2>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Work that speaks
            </span>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {techStack.map((t) => (
              <li
                key={t}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-8">
          {sections.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                  {s.icon}
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  {s.tag}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-700 leading-relaxed">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpen(open === i ? null : i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <span className="pr-4 font-medium text-neutral-900">
                    {f.q}
                  </span>
                  <span
                    className={`text-2xl text-neutral-400 transition-transform ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                {open === i && (
                  <div className="px-5 pb-6 pt-0 text-neutral-700 sm:px-6">
                    {f.a}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Ready to solve your technical challenges?
          </h2>
          <p className="mt-2 text-neutral-700">
            If you're ready to build a digital tool, create a custom web
            solution, or tackle complex technical work — let's talk.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Hire me
            </Link>
            <Link
              to="/skills-expertise/seo-marketing"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See SEO &amp; Marketing
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
