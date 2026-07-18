import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/press-release")({
  head: () => ({
    meta: [
      { title: "Press Release — Usman Jatoi" },
      {
        name: "description",
        content:
          "Official press releases, media coverage, and press-ready assets about Usman Jatoi — entrepreneur, founder, and creator.",
      },
      { property: "og:title", content: "Press Release — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Official press releases, media coverage, and press-ready assets about Usman Jatoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PressReleasePage,
});

type Release = {
  date: string;
  displayDate: string;
  headline: string;
  location: string;
  tag: string;
  summary: string;
  body: string[];
  link?: { href: string; label: string };
};

const releases: Release[] = [
  {
    date: "2026-07-01",
    displayDate: "July 1, 2026",
    headline:
      "Usman Jatoi Launches UsmanJatoi.com — A Personal Hub for Entrepreneurship, Creators & Public Building",
    location: "Karachi, Pakistan",
    tag: "Launch",
    summary:
      "The official personal platform of Usman Jatoi goes live, bringing together his ventures, writing, and the story of building in public under one roof.",
    body: [
      "Usman Jatoi, founder of Redsglow and a growing portfolio of digital ventures, today announced the launch of UsmanJatoi.com — a personal platform designed to serve as the definitive home for his work, thoughts, and story.",
      "The site consolidates years of blog posts, project updates, and business milestones into a single, modern experience. It also introduces a public changelog, media kit, and a careers hub — making it easier for readers, collaborators, and hiring partners to engage directly.",
      "\"I wanted a place that's fully mine — not a profile on someone else's platform,\" said Jatoi. \"UsmanJatoi.com is where I document the journey, the wins, the mistakes, and everything in between.\"",
    ],
    link: { href: "/log", label: "Read the full journey →" },
  },
  {
    date: "2026-06-15",
    displayDate: "June 15, 2026",
    headline:
      "Redsglow Expands Creative Services with New Automation & AI Division",
    location: "Karachi, Pakistan",
    tag: "Business",
    summary:
      "Redsglow, the flagship agency founded by Usman Jatoi, expands its capabilities with a dedicated automation and AI practice serving global clients.",
    body: [
      "Redsglow announced today the launch of a new division focused on business automation, AI workflows, and custom software — extending its long-standing branding and creative services.",
      "The move reflects growing demand from SMBs and creators looking to scale operations without expanding headcount. Early pilots have already been deployed across e-commerce, real estate, and creator-economy clients.",
    ],
    link: { href: "/businesses", label: "Explore the businesses →" },
  },
  {
    date: "2026-05-20",
    displayDate: "May 20, 2026",
    headline:
      "Usman Jatoi Opens Applications for Founding Team Roles Across Portfolio Companies",
    location: "Remote / Karachi",
    tag: "Hiring",
    summary:
      "Multiple founding-team roles open across Redsglow, UJ Online, and RabbitFlare — spanning engineering, design, growth, and operations.",
    body: [
      "Following a strong first half of the year, Usman Jatoi opened applications for founding-team hires across his portfolio of companies. Roles span full-stack engineering, product design, growth marketing, and creator operations.",
      "All positions are remote-friendly with a strong bias toward asynchronous work, high ownership, and shipping in public.",
    ],
    link: { href: "/careers", label: "See open roles →" },
  },
];

function PressReleasePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes prGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .pr-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: prGradient 8s ease infinite;
        }
        .pr-pill {
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
        .pr-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: prGradient 8s ease infinite;
          pointer-events:none;
        }
        .pr-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 32px;
          transition: transform .3s ease;
        }
        .pr-card:hover { transform: translateY(-4px); }
        .pr-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: prGradient 10s ease infinite;
          pointer-events:none;
        }
        .pr-tag {
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
        .pr-meta {
          font-size: 13px;
          color: #666;
          letter-spacing: 0.03em;
        }
        .pr-link {
          color:#111;
          font-weight:600;
          text-decoration:none;
          border-bottom: 2px solid transparent;
          background-image: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:100% 2px;
          background-repeat:no-repeat;
          background-position: 0 100%;
        }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="pr-tag mb-6">Press Room</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Official <span className="pr-gradient-text">press releases</span>,
          <br />
          straight from the source.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          Announcements, milestones, and media-ready statements from Usman
          Jatoi and the ventures he leads.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href="/media-kit" className="pr-pill">
            📦 Media Kit
          </a>
          <a href="/contact-me" className="pr-pill">
            ✉️ Press Inquiries
          </a>
        </div>
      </section>

      {/* Releases */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto pb-24">
        <div className="space-y-8">
          {releases.map((r) => (
            <article key={r.date} className="pr-card">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="pr-tag">{r.tag}</span>
                <span className="pr-meta">
                  {r.displayDate} · {r.location}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                {r.headline}
              </h2>

              <p className="mt-4 text-lg text-neutral-700 font-medium">
                {r.summary}
              </p>

              <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
                {r.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {r.link && (
                <div className="mt-6">
                  <a href={r.link.href} className="pr-link">
                    {r.link.label}
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Press contact */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="pr-card text-center">
          <span className="pr-tag mb-4">Media Contact</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            For interviews, features & partnerships
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Working on a story, podcast, or feature? Reach out directly and
            we'll get back within 48 hours with quotes, assets, and
            scheduling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="pr-pill">
              Contact for press →
            </a>
            <a href="/media-kit" className="pr-pill">
              Download media kit
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="pr-link">
            ← Back to home
          </a>
        </div>
      </section>
    </div>
  );
}
