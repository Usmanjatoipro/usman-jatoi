import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Businesses — Brands & Ventures by Usman Jatoi" },
      {
        name: "description",
        content:
          "The brands, agencies and products founded and operated by Usman Jatoi — Redsglow, UJ Online, RabbitFlare, Usama 2.0 and more.",
      },
      { property: "og:title", content: "Businesses — Brands & Ventures by Usman Jatoi" },
      {
        property: "og:description",
        content:
          "The brands, agencies and products founded and operated by Usman Jatoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusinessesPage,
});

type Business = {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  status: "Active" | "Building" | "Scaling";
  category: string;
  year: string;
  url?: string;
  highlights: string[];
};

const businesses: Business[] = [
  {
    name: "Redsglow",
    tagline: "Full-service creative & tech agency",
    description:
      "My flagship agency delivering web design, development, branding and automation for founders and growing teams worldwide. Home base for most client work.",
    logo: "/site-assets/Redsglow-Logo.png",
    status: "Scaling",
    category: "Agency",
    year: "2020",
    url: "https://redsglow.com",
    highlights: ["500+ websites shipped", "Global client base", "In-house design + dev"],
  },
  {
    name: "UJ Online",
    tagline: "Digital products & creator tools",
    description:
      "A studio for small, sharp digital products — templates, Chrome extensions, and creator-first utilities built to solve real problems fast.",
    logo: "/site-assets/UJonline-Minimal-Logo.png",
    status: "Active",
    category: "Product Studio",
    year: "2022",
    highlights: ["Chrome extensions", "Templates & assets", "Creator tooling"],
  },
  {
    name: "RabbitFlare",
    tagline: "Automation & AI workflows",
    description:
      "Automation engineering brand focused on AI-powered workflows, integrations and internal tooling — 1000+ flows shipped for teams that want to move faster.",
    logo: "/site-assets/RabbitFlare-Logo.png",
    status: "Building",
    category: "Automation",
    year: "2024",
    highlights: ["1000+ automations", "AI + no-code stacks", "Ops for lean teams"],
  },
  {
    name: "Usama 2.0",
    tagline: "Personal brand & content lab",
    description:
      "A content-first brand exploring creativity, entrepreneurship and personal growth — where I document lessons and experiment with new formats.",
    logo: "/site-assets/Usama-2.0-Logo.png",
    status: "Active",
    category: "Media",
    year: "2023",
    highlights: ["Content series", "Community building", "Personal storytelling"],
  },
];

function BusinessesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bizGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .biz-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: bizGradient 8s ease infinite;
        }
        .biz-tag {
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
        .biz-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 32px;
          transition: transform .3s ease;
        }
        .biz-card:hover { transform: translateY(-4px); }
        .biz-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: bizGradient 10s ease infinite;
          pointer-events:none;
        }
        .biz-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          background: #fff;
          color: #111;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }
        .biz-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: bizGradient 8s ease infinite;
          pointer-events:none;
        }
        .biz-status-active { background:#dcfce7; color:#166534; }
        .biz-status-scaling { background:#dbeafe; color:#1e40af; }
        .biz-status-building { background:#fef3c7; color:#92400e; }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="biz-tag mb-6">Portfolio of Ventures</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          The <span className="biz-gradient-text">businesses</span>
          <br />I build & run.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          A small portfolio of brands, agencies and products — each one born from a
          real problem worth solving.
        </p>
      </section>

      {/* Stats strip */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "4+", v: "Active brands" },
            { k: "500+", v: "Websites shipped" },
            { k: "1000+", v: "Automations built" },
            { k: "7+", v: "Years operating" },
          ].map((s) => (
            <div key={s.v} className="biz-card text-center !p-6">
              <div className="text-4xl font-black biz-gradient-text">{s.k}</div>
              <div className="mt-1 text-sm text-neutral-600">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Businesses grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {businesses.map((b) => (
            <article key={b.name} className="biz-card flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center overflow-hidden shrink-0 border border-neutral-100">
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    className="max-w-[70%] max-h-[70%] object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      b.status === "Active"
                        ? "biz-status-active"
                        : b.status === "Scaling"
                          ? "biz-status-scaling"
                          : "biz-status-building"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    Est. {b.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold tracking-tight">{b.name}</h2>
                <span className="text-xs text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded-full">
                  {b.category}
                </span>
              </div>
              <p className="text-neutral-500 font-medium mb-4">{b.tagline}</p>
              <p className="text-neutral-700 leading-relaxed mb-6">{b.description}</p>

              <ul className="space-y-2 mb-6">
                {b.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-neutral-700">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg,#ff5f6d,#4facfe,#a06cff)",
                      }}
                    />
                    {h}
                  </li>
                ))}
              </ul>

              {b.url && (
                <div className="mt-auto pt-2">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="biz-pill"
                  >
                    Visit {b.name} →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32 text-center">
        <div className="biz-card !p-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Want to <span className="biz-gradient-text">collaborate</span>?
          </h2>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Partnerships, investments, or you just want to chat about what I'm
            building — my inbox is open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="mailto:hello@usmanjatoi.com" className="biz-pill">
              Get in touch →
            </a>
            <a href="/" className="biz-pill">
              ← Back to home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
