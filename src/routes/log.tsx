import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Changelog — The Journey of UsmanJatoi.com" },
      {
        name: "description",
        content:
          "A living log of milestones, launches, and behind-the-scenes moments from Usman Jatoi — the story of building UsmanJatoi.com in public.",
      },
      { property: "og:title", content: "Changelog — The Journey of UsmanJatoi.com" },
      {
        property: "og:description",
        content:
          "A living log of milestones, launches, and behind-the-scenes moments from Usman Jatoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogPage,
});

type Entry = {
  date: string;
  displayDate: string;
  title: string;
  event: string;
  story: string[];
  image?: { src: string; alt: string };
  tag?: string;
};

const entries: Entry[] = [
  {
    date: "2024-12-02",
    displayDate: "Dec 2, 2024",
    title: "The Beginning",
    event: "Purchased my domain",
    tag: "Milestone",
    story: [
      "Before I started working on my personal website, I was mainly focused on my agency — Redsglow. But after some time, I realized that I should have a personal space online — something that truly represents me. That's when I decided to create my own website — UsmanJatoi.com.",
      "On December 2, 2024, I officially purchased my domain. For quite some time, it just sat there — no hosting, no content — just an idea waiting to take shape.",
      "Eventually, I connected it with WordPress, installed my favorite plugins and themes, and began building from scratch. That was the real start of my digital home.",
    ],
    image: {
      src: "/site-assets/usmanjatoi.com-domain-1024x331.webp",
      alt: "Screenshot of the moment UsmanJatoi.com domain was purchased",
    },
  },
];

function LogPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes logGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .log-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: logGradient 8s ease infinite;
        }
        .log-pill {
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
        .log-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: logGradient 8s ease infinite;
          pointer-events:none;
        }
        .log-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 32px;
        }
        .log-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: logGradient 10s ease infinite;
          pointer-events:none;
        }
        .log-dot {
          background: linear-gradient(135deg,#ff5f6d,#4facfe,#a06cff);
          box-shadow: 0 0 0 4px #fff, 0 0 0 5px rgba(0,0,0,0.06);
        }
        .log-tag {
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
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="log-tag mb-6">Changelog</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          The <span className="log-gradient-text">journey</span>,
          <br />
          logged in public.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          Every milestone, launch, and behind-the-scenes moment from building
          UsmanJatoi.com — written as it happens.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="relative">
          {/* vertical line */}
          <div
            className="absolute left-4 md:left-6 top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(to bottom, #ff5f6d, #ffc371, #47e0a0, #4facfe, #a06cff)",
            }}
          />

          <div className="space-y-12">
            {entries.map((e) => (
              <article key={e.date} className="relative pl-14 md:pl-20">
                {/* dot */}
                <div
                  className="log-dot absolute left-[9px] md:left-[17px] top-8 w-4 h-4 rounded-full"
                  aria-hidden
                />

                <div className="log-card">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <time className="text-sm font-mono text-neutral-500">
                      {e.displayDate}
                    </time>
                    {e.tag && <span className="log-tag">{e.tag}</span>}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {e.title}
                  </h2>
                  <p className="mt-2 text-lg text-neutral-700">
                    <span className="font-semibold">Event:</span> {e.event}
                  </p>

                  <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
                    {e.story.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {e.image && (
                    <figure className="mt-8 overflow-hidden rounded-2xl border border-neutral-200">
                      <img
                        src={e.image.src}
                        alt={e.image.alt}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                    </figure>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-neutral-600 mb-6">
            More chapters coming as the journey unfolds.
          </p>
          <a href="/" className="log-pill">
            ← Back to home
          </a>
        </div>
      </section>
    </div>
  );
}
