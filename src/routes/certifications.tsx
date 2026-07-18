import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Usman Jatoi" },
      {
        name: "description",
        content:
          "Professional certifications earned by Usman Jatoi across marketing, design, development, automation, and AI.",
      },
      { property: "og:title", content: "Certifications — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Verified certifications across marketing, design, engineering, automation, and AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificationsPage,
});

type Cert = {
  year: string;
  title: string;
  issuer: string;
  category: string;
  desc: string;
  icon: string;
  credentialId?: string;
};

const certifications: Cert[] = [
  {
    year: "2026",
    title: "Advanced Prompt Engineering",
    issuer: "DeepLearning.AI",
    category: "AI",
    desc: "Advanced techniques for designing, evaluating, and shipping production-grade LLM prompts and agents.",
    icon: "🤖",
    credentialId: "DLAI-2026-PE",
  },
  {
    year: "2025",
    title: "Google Ads Search Certification",
    issuer: "Google",
    category: "Marketing",
    desc: "Certified in creating, managing, and optimizing Google Search advertising campaigns.",
    icon: "🔍",
    credentialId: "GOOG-ADS-25",
  },
  {
    year: "2025",
    title: "Meta Certified Media Buying Professional",
    issuer: "Meta",
    category: "Marketing",
    desc: "Advanced ads buying and optimization across Facebook, Instagram, and Messenger.",
    icon: "📣",
    credentialId: "META-MBP-25",
  },
  {
    year: "2025",
    title: "HubSpot Inbound Marketing",
    issuer: "HubSpot Academy",
    category: "Marketing",
    desc: "Full-funnel inbound strategy across content, SEO, email, and marketing automation.",
    icon: "📈",
  },
  {
    year: "2024",
    title: "Automation Pro",
    issuer: "Make (Integromat)",
    category: "Automation",
    desc: "Advanced no-code automation across APIs, webhooks, and multi-scenario workflows.",
    icon: "⚙️",
  },
  {
    year: "2024",
    title: "n8n Advanced Workflows",
    issuer: "n8n Academy",
    category: "Automation",
    desc: "Building self-hosted, complex automation flows with custom nodes and integrations.",
    icon: "🔗",
  },
  {
    year: "2024",
    title: "React & Modern Frontend",
    issuer: "Meta / Coursera",
    category: "Development",
    desc: "Production-grade React, hooks, state management, and modern build tooling.",
    icon: "⚛️",
  },
  {
    year: "2024",
    title: "UI/UX Design Specialization",
    issuer: "Google",
    category: "Design",
    desc: "End-to-end UX research, wireframing, prototyping, and usability testing.",
    icon: "🎨",
  },
  {
    year: "2023",
    title: "Shopify Partner Certified",
    issuer: "Shopify",
    category: "E-commerce",
    desc: "Store setup, theme customization, app integration, and merchant success workflows.",
    icon: "🛍️",
  },
  {
    year: "2023",
    title: "SEO Fundamentals & Technical SEO",
    issuer: "SEMrush Academy",
    category: "SEO",
    desc: "On-page, off-page, and technical SEO — including audits, crawlability, and Core Web Vitals.",
    icon: "🌐",
  },
  {
    year: "2023",
    title: "WordPress Development",
    issuer: "Elementor Academy",
    category: "Development",
    desc: "Advanced WordPress theming, custom widgets, and page-builder-driven site delivery.",
    icon: "📝",
  },
  {
    year: "2022",
    title: "Business & Entrepreneurship",
    issuer: "Wharton Online",
    category: "Business",
    desc: "Foundations of running a modern business — finance, operations, and go-to-market.",
    icon: "💼",
  },
];

const stats = [
  { value: "12+", label: "Certifications earned" },
  { value: "8", label: "Global issuers" },
  { value: "6", label: "Disciplines covered" },
  { value: "100%", label: "Verified credentials" },
];

const categories = [
  "AI",
  "Marketing",
  "Automation",
  "Development",
  "Design",
  "E-commerce",
  "SEO",
  "Business",
];

function CertificationsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes cGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .c-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: cGradient 8s ease infinite;
        }
        .c-pill {
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
        .c-pill.dark { background:#111; color:#fff; }
        .c-pill.dark::before { display:none; }
        .c-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: cGradient 8s ease infinite;
          pointer-events:none;
        }
        .c-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 28px;
          height: 100%;
          transition: transform .3s ease;
        }
        .c-card:hover { transform: translateY(-4px); }
        .c-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: cGradient 10s ease infinite;
          pointer-events:none;
        }
        .c-tag {
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
        .c-chip {
          display:inline-flex;
          align-items:center;
          padding: 8px 14px;
          border-radius: 999px;
          background: #f5f5f5;
          color: #111;
          font-weight: 600;
          font-size: 13px;
        }
        .c-stat-value {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: cGradient 8s ease infinite;
        }
        .c-badge {
          width:56px; height:56px;
          border-radius:16px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          font-size:26px;
          background: linear-gradient(135deg,#eef4ff,#dceafd);
          box-shadow: 0 8px 24px -12px rgba(79,172,254,.4);
          flex-shrink:0;
        }
        .c-verified {
          display:inline-flex;
          align-items:center;
          gap:4px;
          font-size:11px;
          font-weight:700;
          color:#0a7c46;
          background:#e6f7ee;
          padding:3px 8px;
          border-radius:999px;
        }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="c-tag mb-6">Certifications</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Verified skills.
          <br />
          <span className="c-gradient-text">Real credentials</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          A curated list of professional certifications — earned across
          marketing, design, engineering, automation, and AI — from issuers
          the industry actually trusts.
        </p>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="c-card text-center">
              <div className="c-stat-value">{s.value}</div>
              <div className="mt-3 text-sm text-neutral-600 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto pb-16 text-center">
        <span className="c-tag mb-4">Disciplines</span>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <span key={c} className="c-chip">{c}</span>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="text-center mb-12">
          <span className="c-tag mb-4">Credentials</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Every certificate, <span className="c-gradient-text">verified</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {certifications.map((c, i) => (
            <article key={i} className="c-card">
              <div className="flex items-start gap-4">
                <span className="c-badge">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="c-tag">{c.category}</span>
                    <span className="text-sm text-neutral-500 font-mono">
                      {c.year}
                    </span>
                    <span className="c-verified">✓ Verified</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight leading-snug">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-neutral-600">
                    {c.issuer}
                  </p>
                  <p className="mt-3 text-neutral-600 leading-relaxed">
                    {c.desc}
                  </p>
                  {c.credentialId && (
                    <p className="mt-3 text-xs font-mono text-neutral-400">
                      ID: {c.credentialId}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="c-card text-center">
          <span className="c-tag mb-4">Put it to work</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Skills on paper, <span className="c-gradient-text">proven in projects</span>
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Certifications are cool. Shipping is cooler. Let's put every one
            of these to work on your next launch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="c-pill dark">
              Start a project →
            </a>
            <a href="/awards" className="c-pill">
              See awards
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
