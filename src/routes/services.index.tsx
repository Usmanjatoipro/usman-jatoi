import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Usman Jatoi" },
      {
        name: "description",
        content:
          "AI automation, bulk publishing, creative projects, marketing, and website design & development — end-to-end digital services from Usman Jatoi.",
      },
      { property: "og:title", content: "Services — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "End-to-end digital services: AI automation, bulk publishing, creative, marketing, and web.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/services",
      },
    ],
    links: [
      { rel: "canonical", href: "https://usmanjatoi.lovable.app/services" },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  n: string;
  icon: string;
  title: string;
  tagline: string;
  body: string;
  bullets: string[];
  outcome: string;
};

const services: Service[] = [
  {
    n: "01",
    icon: "🤖",
    title: "AI Automation",
    tagline: "Cut the busywork. Keep the judgment.",
    body:
      "I design AI workflows that plug into how your team already works — no rip-and-replace. Data in, useful action out. From lead enrichment to reporting to content pipelines, we automate the boring parts and leave the decisions to you.",
    bullets: [
      "Custom workflows in Make, n8n, and Python",
      "LLM-powered document, email, and chat processing",
      "Local + cloud model setups depending on privacy needs",
      "Dashboards and human-in-the-loop checkpoints",
    ],
    outcome: "Hours back every week, fewer manual errors.",
  },
  {
    n: "02",
    icon: "🗂️",
    title: "Bulk Publishing",
    tagline: "Ship 100s of pages without cutting corners.",
    body:
      "I've built pipelines that publish thousands of articles, product pages, and location pages across WordPress, Shopify, and custom stacks. Structured content in, SEO-ready pages out — with quality gates so nothing generic slips through.",
    bullets: [
      "Programmatic SEO templates and schema",
      "Spreadsheet-driven content generation",
      "Auto image sourcing, alt text, and internal linking",
      "Batch scheduling, redirects, and clean-up scripts",
    ],
    outcome: "Scale content without scaling headcount.",
  },
  {
    n: "03",
    icon: "🎨",
    title: "Creative Projects",
    tagline: "Design, video, and 3D that actually lands.",
    body:
      "Brand systems, thumbnails, social posters, mascots, motion, video edits, and 3D. Built by someone who's shipped 500+ visuals across real client work — not a template library.",
    bullets: [
      "Brand identity — logo, motion, type, mockups",
      "Thumbnails, ads, and social poster campaigns",
      "Video editing — docs, reels, ads, promos",
      "3D modeling and product visuals in Blender",
    ],
    outcome: "Visuals that stop scrolls and stay memorable.",
  },
  {
    n: "04",
    icon: "📈",
    title: "Marketing",
    tagline: "SEO, content, and outreach that compound.",
    body:
      "Keyword research, content strategy, on-page SEO, backlinks, PR campaigns, and outreach across email, WhatsApp, IG, and LinkedIn. Growth built on measurable inputs, not vibes.",
    bullets: [
      "SEO audits, keyword maps, and content plans",
      "On-page optimization + technical fixes",
      "Backlinks, digital PR, and listicle placements",
      "Cold outreach + lead scraping at scale",
    ],
    outcome: "Traffic, leads, and rankings that stick.",
  },
  {
    n: "05",
    icon: "🌐",
    title: "Website Design & Development",
    tagline: "Fast, custom, and built to be maintained.",
    body:
      "Responsive websites in HTML/CSS/JS, WordPress (Elementor, Divi, Oxygen, Breakdance), Shopify (Liquid, JSON), Webflow, Wix, and Leadpages. From simple marketing sites to complex multi-language stacks.",
    bullets: [
      "Design systems, wireframes, and prototypes",
      "WordPress builds, plugins, and page speed tuning",
      "Shopify themes and headless commerce",
      "Custom apps built with modern stacks",
    ],
    outcome: "A site that ships fast and grows with you.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    body:
      "We talk through what you're actually trying to do — the goal, the constraint, and what's already tried. No template intake forms.",
  },
  {
    step: "02",
    title: "Scope & Plan",
    body:
      "Clear phases, honest timeline, real trade-offs. You see the plan before anyone touches a keyboard.",
  },
  {
    step: "03",
    title: "Build",
    body:
      "Weekly progress, working demos, and a shared workspace so you're never guessing what's happening.",
  },
  {
    step: "04",
    title: "Ship & Support",
    body:
      "Handover with docs and a runbook — plus optional retainers when you want the team to stay on.",
  },
];

const faqs = [
  {
    q: "How do we start?",
    a: "Send a message via the contact page with a short brief of what you're trying to do. I'll reply with next steps, honest timing, and a rough scope within 1–2 business days.",
  },
  {
    q: "Do you take small projects?",
    a: "Yes — one-off automations, single-page builds, and short campaigns are welcome as long as the scope is clear.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Absolutely. I've led teams of 19+ and also drop into existing squads as an embedded specialist. Both work.",
  },
  {
    q: "Do you offer white-label services?",
    a: "Yes — see the white-label partnership page for how agencies and studios resell my services under their own brand.",
  },
];

function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Services</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Services · Full-stack digital
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Ideas, built into working systems.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Five focused services — automation, publishing, creative, marketing,
            and web. Delivered end-to-end, without hype and without hand-off gaps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Start a project
            </Link>
            <Link
              to="/white-label-partnership"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              White-label partnership
            </Link>
          </div>
        </header>

        <div className="space-y-6">
          {services.map((s) => (
            <article
              key={s.n}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50 text-2xl">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-neutral-400">{s.n}</div>
                    <h2 className="text-xl font-semibold sm:text-2xl">{s.title}</h2>
                  </div>
                </div>
                <span className="hidden text-right text-sm text-neutral-500 sm:block">
                  {s.tagline}
                </span>
              </div>
              <p className="mt-4 text-neutral-700 leading-relaxed">{s.body}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
                  >
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[linear-gradient(90deg,#ff2d55,#af52de)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                <span className="text-sm text-neutral-500">
                  <span className="font-medium text-neutral-900">Outcome:</span> {s.outcome}
                </span>
                <Link
                  to="/contact-me"
                  className="text-sm font-medium text-neutral-900 hover:underline"
                >
                  Get a quote →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">How we work</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <div className="text-xs font-mono text-neutral-400">{p.step}</div>
                <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">FAQ</h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 sm:p-6">
                <h3 className="font-medium text-neutral-900">{f.q}</h3>
                <p className="mt-2 text-neutral-700">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Have something in mind? Let's talk.
          </h2>
          <p className="mt-2 text-neutral-700">
            Send a short brief — goal, timeline, and what's tried so far. You'll
            get a real reply, not a form response.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact me
            </Link>
            <Link
              to="/testimonials"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See testimonials
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
