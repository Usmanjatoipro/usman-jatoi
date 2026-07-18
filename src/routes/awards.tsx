import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — Usman Jatoi" },
      {
        name: "description",
        content:
          "Awards, honors, and recognition earned by Usman Jatoi across entrepreneurship, design, marketing, and community impact.",
      },
      { property: "og:title", content: "Awards & Recognition — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "A record of awards, features, and recognition earned across ventures and community work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AwardsPage,
});

type Award = {
  year: string;
  title: string;
  org: string;
  category: string;
  desc: string;
  icon: string;
};

const awards: Award[] = [
  {
    year: "2026",
    title: "Top 30 Under 30 — Digital Entrepreneurs",
    org: "Pakistan Startup Review",
    category: "Entrepreneurship",
    desc: "Recognized among the country's most promising young digital founders for scaling Redsglow and building a portfolio of ventures.",
    icon: "🏆",
  },
  {
    year: "2025",
    title: "Agency of the Year — Finalist",
    org: "MENA Creative Awards",
    category: "Agency",
    desc: "Redsglow shortlisted as a top independent creative agency for cross-border branding and web work.",
    icon: "🥇",
  },
  {
    year: "2025",
    title: "Best Personal Brand in Tech",
    org: "Creator Economy Report",
    category: "Personal Brand",
    desc: "Highlighted for consistent public building, transparent storytelling, and community-first content.",
    icon: "⭐",
  },
  {
    year: "2025",
    title: "Design Excellence Award",
    org: "Awwwards Honors",
    category: "Design",
    desc: "Multiple client projects recognized for outstanding UI, UX, and creative direction.",
    icon: "🎨",
  },
  {
    year: "2024",
    title: "Rising Founder of the Year",
    org: "Digital Business Summit",
    category: "Business",
    desc: "Awarded for building profitable, bootstrapped ventures in branding, automation, and AI.",
    icon: "🚀",
  },
  {
    year: "2024",
    title: "Top Marketing Voice",
    org: "LinkedIn",
    category: "Community",
    desc: "Recognized among leading voices sharing insights on marketing, agency growth, and entrepreneurship.",
    icon: "🎙️",
  },
  {
    year: "2024",
    title: "Client Choice — Excellence",
    org: "Clutch.co",
    category: "Client Service",
    desc: "Consistently 5-star client reviews across branding, web development, and consulting engagements.",
    icon: "💎",
  },
  {
    year: "2023",
    title: "Emerging Creative Studio",
    org: "Behance Featured",
    category: "Design",
    desc: "Multiple Redsglow projects curated and featured across Behance's creative galleries.",
    icon: "✨",
  },
];

const highlights = [
  { value: "12+", label: "Awards & honors" },
  { value: "40+", label: "Feature articles" },
  { value: "6", label: "Countries recognized in" },
  { value: "500+", label: "5-star reviews" },
];

function AwardsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes awGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .aw-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: awGradient 8s ease infinite;
        }
        .aw-pill {
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
        .aw-pill.dark { background:#111; color:#fff; }
        .aw-pill.dark::before { display:none; }
        .aw-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: awGradient 8s ease infinite;
          pointer-events:none;
        }
        .aw-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 28px;
          height: 100%;
          transition: transform .3s ease;
        }
        .aw-card:hover { transform: translateY(-4px); }
        .aw-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: awGradient 10s ease infinite;
          pointer-events:none;
        }
        .aw-tag {
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
        .aw-year {
          font-size: 44px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: awGradient 8s ease infinite;
        }
        .aw-stat-value {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: awGradient 8s ease infinite;
        }
        .aw-medal {
          width:56px; height:56px;
          border-radius:16px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          background: linear-gradient(135deg,#fff7d6,#ffe89a);
          box-shadow: 0 8px 24px -12px rgba(255,193,7,.5);
        }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="aw-tag mb-6">Awards & Recognition</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          A little wall of
          <br />
          <span className="aw-gradient-text">honors & wins</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          A record of the awards, honors, and recognition earned across
          ventures, client work, and community contributions.
        </p>
      </section>

      {/* Highlights */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((s) => (
            <div key={s.label} className="aw-card text-center">
              <div className="aw-stat-value">{s.value}</div>
              <div className="mt-3 text-sm text-neutral-600 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="text-center mb-12">
          <span className="aw-tag mb-4">Honors</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Every <span className="aw-gradient-text">recognition</span>, logged
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {awards.map((a, i) => (
            <article key={i} className="aw-card">
              <div className="flex items-start gap-4">
                <span className="aw-medal">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="aw-tag">{a.category}</span>
                    <span className="text-sm text-neutral-500 font-mono">
                      {a.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-neutral-600">
                    {a.org}
                  </p>
                  <p className="mt-3 text-neutral-600 leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="aw-card text-center">
          <span className="aw-tag mb-4">Work together</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Let's earn the <span className="aw-gradient-text">next one</span> together
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Every award-winning project started with a conversation. Whether
            it's branding, web, or automation — let's make something worth
            adding to the wall.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="aw-pill dark">
              Start a project →
            </a>
            <a href="/testimonials" className="aw-pill">
              Read testimonials
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
