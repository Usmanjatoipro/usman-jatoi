import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/white-label-partnership")({
  head: () => ({
    meta: [
      { title: "White Label Partnership — Usman Jatoi" },
      {
        name: "description",
        content:
          "Partner with Redsglow and Usman Jatoi's studio on a white-label basis — deliver world-class branding, web, automation, and AI services under your own brand.",
      },
      { property: "og:title", content: "White Label Partnership — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "White-label branding, web, automation & AI — delivered under your brand, on your timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhiteLabelPage,
});

type Service = { title: string; desc: string; icon: string };
type Step = { n: string; title: string; desc: string };
type Benefit = { title: string; desc: string };

const services: Service[] = [
  {
    icon: "",
    title: "Branding & Identity",
    desc: "Logos, brand systems, guidelines, and visual identity — production-ready under your name.",
  },
  {
    icon: "",
    title: "Web Design & Development",
    desc: "Marketing sites, landing pages, e-commerce, custom apps — WordPress, Shopify, React, and modern stacks.",
  },
  {
    icon: "",
    title: "Automation & Workflows",
    desc: "Make, n8n, Zapier, and custom automations that plug into your clients' operations.",
  },
  {
    icon: "",
    title: "AI Solutions",
    desc: "Chatbots, agents, custom GPTs, and AI-powered workflows tailored to your client base.",
  },
  {
    icon: "",
    title: "SEO & Content",
    desc: "On-page SEO, technical audits, and long-form content — invisible to your client, credited to your agency.",
  },
  {
    icon: "",
    title: "Video & Motion",
    desc: "Short-form edits, motion graphics, product videos, and social content on repeat.",
  },
];

const steps: Step[] = [
  {
    n: "01",
    title: "Discovery Call",
    desc: "We learn about your agency, your clients, and the gaps you're trying to fill.",
  },
  {
    n: "02",
    title: "Partnership Agreement",
    desc: "NDA, white-label terms, and pricing sheet — clear, simple, and made to protect your brand.",
  },
  {
    n: "03",
    title: "Client Handoff",
    desc: "You pitch and close. We deliver silently under your brand — no logos, no watermarks, no leaks.",
  },
  {
    n: "04",
    title: "Delivery & Support",
    desc: "On-time delivery, revisions handled through you, and ongoing support as you scale.",
  },
];

const benefits: Benefit[] = [
  {
    title: "Fully white-labeled",
    desc: "Zero visibility. Every asset, email, and file is delivered as if your team built it.",
  },
  {
    title: "Fixed-price packages",
    desc: "Transparent pricing so you can quote clients confidently and protect your margins.",
  },
  {
    title: "Senior team, on demand",
    desc: "Skip hiring. Get design, dev, automation, and AI talent whenever a project lands.",
  },
  {
    title: "Fast turnaround",
    desc: "Most projects ship in days, not weeks. Sprint-based workflows keep momentum.",
  },
  {
    title: "Global-quality output",
    desc: "The same standard we deliver to our own clients — no shortcuts, no outsourcing gambles.",
  },
  {
    title: "Scale without overhead",
    desc: "Take on more clients, bigger scopes, and new verticals — without expanding your team.",
  },
];

function WhiteLabelPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wlGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .wl-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wlGradient 8s ease infinite;
        }
        .wl-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 999px;
          background: #fff;
          color: #111;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }
        .wl-pill.dark { background:#111; color:#fff; }
        .wl-pill.dark::before { display:none; }
        .wl-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: wlGradient 8s ease infinite;
          pointer-events:none;
        }
        .wl-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 28px;
          height: 100%;
          transition: transform .3s ease;
        }
        .wl-card:hover { transform: translateY(-4px); }
        .wl-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: wlGradient 10s ease infinite;
          pointer-events:none;
        }
        .wl-tag {
          display:inline-block;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-weight: 600;
        }
        .wl-step-num {
          font-size: 48px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wlGradient 8s ease infinite;
        }
        .wl-check {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:28px; height:28px;
          border-radius:999px;
          background: linear-gradient(135deg,#47e0a0,#4facfe);
          color:#fff; font-weight:900;
          flex-shrink:0;
        }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="wl-tag mb-6">For Agencies & Studios</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Your clients.
          <br />
          Our <span className="wl-gradient-text">delivery engine</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          A discreet white-label partnership for agencies, freelancers, and
          consultancies. Sell branding, web, automation, and AI — we build it
          silently under your brand.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <a href="/contact-me" className="wl-pill dark">
            Start a partnership →
          </a>
          <a href="/media-kit" className="wl-pill">
            View our work
          </a>
        </div>
      </section>

      {/* What we do */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20">
        <div className="text-center mb-12">
          <span className="wl-tag mb-4">What we deliver</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Services you can <span className="wl-gradient-text">resell</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="wl-card">
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20">
        <div className="text-center mb-12">
          <span className="wl-tag mb-4">How it works</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Four steps to <span className="wl-gradient-text">scale silently</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="wl-card">
              <div className="wl-step-num">{s.n}</div>
              <h3 className="mt-4 text-xl font-bold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20">
        <div className="text-center mb-12">
          <span className="wl-tag mb-4">Why partner with us</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Built to make <span className="wl-gradient-text">your brand</span> win
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="wl-card flex gap-4 items-start">
              <span className="wl-check">✓</span>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-neutral-600 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-20">
        <div className="wl-card">
          <span className="wl-tag mb-4">Who it's for</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            You're a good fit if…
          </h2>
          <ul className="mt-6 space-y-3 text-neutral-700 leading-relaxed">
            <li className="flex gap-3 items-start">
              <span className="wl-check">✓</span>
              <span>You run an agency, studio, or freelance business with real clients.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="wl-check">✓</span>
              <span>You're constantly turning down work because you can't scale delivery.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="wl-check">✓</span>
              <span>You want senior-level output without the cost of a full-time team.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="wl-check">✓</span>
              <span>You value discretion, quality, and long-term partnerships over one-offs.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="wl-card text-center">
          <span className="wl-tag mb-4">Let's talk</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Ready to grow without hiring?
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Book a private discovery call. We'll review your service mix,
            identify gaps, and share our white-label pricing sheet within 48
            hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="wl-pill dark">
              Apply to partner →
            </a>
            <a href="/businesses" className="wl-pill">
              See our ventures
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
            ← Back to home
          </a>
        </div>
      </section>
    </div>
  );
}
