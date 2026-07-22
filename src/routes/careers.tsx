import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Usman Jatoi" },
      {
        name: "description",
        content:
          "Join Usman Jatoi's team. Remote-first roles in design, development, 3D, content and automation. See open positions, values, perks and how we hire.",
      },
      { property: "og:title", content: "Careers — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Remote-first roles across design, development, 3D, content and automation. Build products with a small, senior team.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://usmanjatoi.com/wp-content/uploads/2025/02/cropped-Imagee-Character-2-300x300.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

const VALUES = [
  {
    title: "Ship weekly",
    body: "We prefer small, real releases over big roadmaps. Every week the work moves forward — visibly.",
  },
  {
    title: "Craft over noise",
    body: "Type set right, animations that earn their place, code you'd be proud to open a year from now.",
  },
  {
    title: "Own the outcome",
    body: "You don't hand work over the wall. You see it live, watch how users react, and iterate.",
  },
  {
    title: "Async by default",
    body: "Deep work protected. Meetings only when writing wouldn't move faster. Global team, one Slack thread.",
  },
];

const ROLES = [
  {
    title: "Senior Product Designer",
    team: "Design",
    type: "Full-time · Remote",
    blurb:
      "Own end-to-end design for landing pages, dashboards and marketing sites. Systems thinking + strong visual craft.",
    tags: ["Figma", "Systems", "Motion"],
  },
  {
    title: "Full-Stack Engineer (React + Node)",
    team: "Engineering",
    type: "Full-time · Remote",
    blurb:
      "Ship features across the stack — TanStack, Supabase, Tailwind. You care about DX, perf and clean state.",
    tags: ["React", "TypeScript", "Supabase"],
  },
  {
    title: "3D / Motion Designer",
    team: "Creative",
    type: "Contract · Remote",
    blurb:
      "Build 3D scenes, product renders and motion pieces for launches. Blender or Cinema 4D, After Effects.",
    tags: ["Blender", "AE", "Render"],
  },
  {
    title: "Automation Engineer (n8n / Make)",
    team: "Ops",
    type: "Part-time · Remote",
    blurb:
      "Design and maintain automation flows for content, CRM and internal ops. You love clean, resilient pipelines.",
    tags: ["n8n", "Make", "APIs"],
  },
  {
    title: "Content & Social Producer",
    team: "Content",
    type: "Full-time · Remote",
    blurb:
      "Turn client work and studio projects into short-form video, threads and case studies. Writer + editor.",
    tags: ["Video", "Writing", "Editing"],
  },
];

const PERKS = [
  { icon: "", title: "Fully remote", body: "Work from anywhere. Overlap 4 hours with the core team." },
  { icon: "", title: "Flexible time", body: "Unlimited PTO with a 20-day minimum. Take real breaks." },
  { icon: "", title: "Gear budget", body: "$1,500 setup + $500/yr refresh. Whatever helps you ship." },
  { icon: "", title: "Learning stipend", body: "$1,000/yr for books, courses, conferences." },
  { icon: "", title: "Product upside", body: "Bonus tied to shipped launches and revenue you helped move." },
  { icon: "", title: "Real onboarding", body: "Two weeks paired with a senior. No cold starts." },
];

const HIRING_STEPS = [
  { n: "01", title: "Apply", body: "Send your CV, portfolio or GitHub — plus a short note on what you want to work on." },
  { n: "02", title: "Intro call", body: "30 minutes. We share the role in detail, you share what you're looking for." },
  { n: "03", title: "Paid trial task", body: "A small, real piece of work — 4–8 hours, paid at market rate." },
  { n: "04", title: "Team chat", body: "Meet the people you'd work with. Ask anything." },
  { n: "05", title: "Offer", body: "Clear comp, start date, expectations. No games." },
];

const CONTACT_EMAIL = "careers@usmanjatoi.com";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      className="ca-btn"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function CareersPage() {
  return (
    <main className="ca-root">
      <style>{`
        .ca-root {
          --ink:#0b0b0f; --muted:#5a5a66; --line:#e6e6ec; --bg:#ffffff; --soft:#f6f6f8;
          background: var(--bg); color: var(--ink);
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 96px 20px 120px; min-height: 100vh;
        }
        .ca-wrap { max-width: 1160px; margin: 0 auto; }
        .ca-eyebrow { display:inline-block; font-size:12px; letter-spacing:.24em; text-transform:uppercase; color:var(--muted); margin-bottom:18px; }
        .ca-h1 { font-size: clamp(44px, 7vw, 96px); line-height:.95; font-weight:800; letter-spacing:-0.03em; margin:0 0 20px; }
        .ca-h1 .grad {
          background: linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55);
          background-size: 200% 100%;
          -webkit-background-clip:text; background-clip:text; color:transparent;
          animation: caflow 8s linear infinite;
        }
        @keyframes caflow { to { background-position:-200% 0; } }
        .ca-lede { font-size: clamp(17px,1.6vw,20px); color:var(--muted); max-width:720px; line-height:1.55; }
        .ca-h2 { font-size: clamp(28px,3.4vw,42px); font-weight:800; letter-spacing:-0.02em; margin:0 0 8px; }
        .ca-section { margin-top: 96px; }
        .ca-section-head { display:flex; align-items:baseline; justify-content:space-between; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
        .ca-section-head p { color:var(--muted); max-width:520px; margin:0; }

        .ca-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 20px; border-radius:999px;
          background:#fff; color:var(--ink);
          font-weight:600; font-size:14px; cursor:pointer;
          text-decoration:none;
          border:2px solid transparent;
          background-image: linear-gradient(#fff,#fff), linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55);
          background-origin: border-box; background-clip: padding-box, border-box;
          background-size: 100% 100%, 200% 100%;
          animation: caflow 6s linear infinite;
          transition: transform .18s ease;
        }
        .ca-btn:hover { transform: translateY(-1px); }
        .ca-btn.dark {
          color:#fff;
          background-image: linear-gradient(#0b0b0f,#0b0b0f), linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55);
        }

        .ca-hero { display:grid; grid-template-columns: 1.2fr 1fr; gap:48px; align-items:center; }
        @media (max-width: 860px) { .ca-hero { grid-template-columns: 1fr; } }
        .ca-hero-cta { display:flex; gap:12px; margin-top:28px; flex-wrap:wrap; }
        .ca-hero-card {
          background:#0b0b0f; color:#fff; border-radius:24px; padding:28px; position:relative; overflow:hidden;
        }
        .ca-hero-card::after {
          content:""; position:absolute; inset:auto -20% -60% auto; width:280px; height:280px; border-radius:999px;
          background: radial-gradient(closest-side, rgba(175,82,222,.45), transparent 70%);
        }
        .ca-hero-card::before {
          content:""; position:absolute; inset:-1px; border-radius:25px; padding:1px;
          background: linear-gradient(135deg,#ff2d55,#ff9500,#34c759,#0a84ff,#af52de);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events:none;
        }
        .ca-hero-card h3 { margin:0 0 14px; font-size:20px; font-weight:800; }
        .ca-hero-card ul { list-style:none; padding:0; margin:0; }
        .ca-hero-card li { padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; gap:10px; }
        .ca-hero-card li:last-child { border-bottom:none; }
        .ca-hero-card li .k { color:#b8b8c4; font-size:13px; letter-spacing:.14em; text-transform:uppercase; }
        .ca-hero-card li .v { font-weight:600; }

        .ca-values { display:grid; grid-template-columns: repeat(4,1fr); gap:16px; }
        @media (max-width: 1024px) { .ca-values { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 520px) { .ca-values { grid-template-columns: 1fr; } }
        .ca-value { background: var(--soft); border:1px solid var(--line); border-radius:20px; padding:24px; }
        .ca-value .num { font-size:12px; letter-spacing:.24em; color:var(--muted); text-transform:uppercase; margin-bottom:14px; }
        .ca-value h3 { margin:0 0 8px; font-size:20px; font-weight:800; letter-spacing:-0.01em; }
        .ca-value p { margin:0; color:#3a3a44; line-height:1.6; }

        .ca-roles { display:grid; gap:12px; }
        .ca-role {
          background:#fff; border:1px solid var(--line); border-radius:20px; padding:22px 24px;
          display:grid; grid-template-columns: 1.4fr 1fr auto; gap:20px; align-items:center;
          transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease;
        }
        .ca-role:hover { border-color:#c9c9d3; transform: translateY(-1px); box-shadow: 0 20px 40px -30px rgba(10,10,20,.25); }
        @media (max-width: 860px) { .ca-role { grid-template-columns: 1fr; } }
        .ca-role h3 { margin:0 0 4px; font-size:20px; font-weight:800; letter-spacing:-0.01em; }
        .ca-role p { margin:6px 0 0; color:var(--muted); line-height:1.55; font-size:14px; }
        .ca-role .meta { display:flex; flex-direction:column; gap:6px; }
        .ca-role .meta .t { font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
        .ca-role .tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
        .ca-role .tag { background: var(--soft); border:1px solid var(--line); padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; }

        .ca-perks { display:grid; grid-template-columns: repeat(3,1fr); gap:16px; }
        @media (max-width: 860px) { .ca-perks { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 520px) { .ca-perks { grid-template-columns: 1fr; } }
        .ca-perk { background:var(--soft); border:1px solid var(--line); border-radius:20px; padding:22px; }
        .ca-perk .ic { font-size:26px; margin-bottom:10px; }
        .ca-perk h3 { margin:0 0 6px; font-size:16px; font-weight:800; }
        .ca-perk p { margin:0; color:#3a3a44; line-height:1.55; font-size:14px; }

        .ca-steps { display:grid; grid-template-columns: repeat(5,1fr); gap:12px; }
        @media (max-width: 1024px) { .ca-steps { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 520px) { .ca-steps { grid-template-columns: 1fr; } }
        .ca-step { background:#fff; border:1px solid var(--line); border-radius:20px; padding:22px; }
        .ca-step .n {
          font-size:12px; font-weight:800; letter-spacing:.18em;
          background: linear-gradient(90deg,#ff2d55,#ff9500,#34c759,#0a84ff,#af52de);
          -webkit-background-clip:text; background-clip:text; color:transparent;
          margin-bottom:10px;
        }
        .ca-step h3 { margin:0 0 6px; font-size:16px; font-weight:800; }
        .ca-step p { margin:0; color:#3a3a44; line-height:1.55; font-size:14px; }

        .ca-cta {
          background:#0b0b0f; color:#fff; border-radius:28px; padding:48px; text-align:center;
          position:relative; overflow:hidden;
        }
        .ca-cta::before {
          content:""; position:absolute; inset:-1px; border-radius:29px; padding:1px;
          background: linear-gradient(135deg,#ff2d55,#ff9500,#34c759,#0a84ff,#af52de);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events:none;
        }
        .ca-cta h2 { margin:0 0 12px; font-size: clamp(28px,3.4vw,44px); font-weight:800; letter-spacing:-0.02em; }
        .ca-cta p { margin:0 auto 24px; color:#b8b8c4; max-width:560px; line-height:1.6; }
        .ca-cta .actions { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
      `}</style>

      <div className="ca-wrap">
        {/* HERO */}
        <section className="ca-hero">
          <div>
            <span className="ca-eyebrow">Careers · Remote-first · Global</span>
            <h1 className="ca-h1">
              Build the <span className="grad">good stuff</span> with us.
            </h1>
            <p className="ca-lede">
              A small, senior team shipping products, brands and content for founders worldwide.
              If you love craft, autonomy and moving fast without burning out — we should talk.
            </p>
            <div className="ca-hero-cta">
              <a href="#roles" className="ca-btn">See open roles</a>
              <a href={`mailto:${CONTACT_EMAIL}?subject=General%20application`} className="ca-btn">
                Send open application
              </a>
            </div>
          </div>
          <div className="ca-hero-card">
            <h3>Working here, at a glance</h3>
            <ul>
              <li><span className="k">Team</span><span className="v">12 people · 8 countries</span></li>
              <li><span className="k">Location</span><span className="v">Fully remote</span></li>
              <li><span className="k">Hours</span><span className="v">Async · 4h overlap</span></li>
              <li><span className="k">Comp</span><span className="v">Market + product bonus</span></li>
              <li><span className="k">Time off</span><span className="v">Unlimited · 20d min</span></li>
            </ul>
          </div>
        </section>

        {/* VALUES */}
        <section className="ca-section">
          <div className="ca-section-head">
            <div>
              <h2 className="ca-h2">How we work</h2>
              <p>Four things that shape every hire, every project, every launch.</p>
            </div>
          </div>
          <div className="ca-values">
            {VALUES.map((v, i) => (
              <div key={v.title} className="ca-value">
                <div className="num">0{i + 1}</div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* OPEN ROLES */}
        <section className="ca-section" id="roles">
          <div className="ca-section-head">
            <div>
              <h2 className="ca-h2">Open roles</h2>
              <p>Currently hiring across design, engineering, 3D, ops and content.</p>
            </div>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{ROLES.length} openings</span>
          </div>
          <div className="ca-roles">
            {ROLES.map((r) => (
              <div key={r.title} className="ca-role">
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.blurb}</p>
                  <div className="tags">
                    {r.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="meta">
                  <span className="t">{r.team}</span>
                  <span style={{ fontWeight: 600 }}>{r.type}</span>
                </div>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Application — " + r.title)}`}
                  className="ca-btn"
                >
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* PERKS */}
        <section className="ca-section">
          <div className="ca-section-head">
            <div>
              <h2 className="ca-h2">Perks & benefits</h2>
              <p>The basics done right, plus a few things you'll actually use.</p>
            </div>
          </div>
          <div className="ca-perks">
            {PERKS.map((p) => (
              <div key={p.title} className="ca-perk">
                <div className="ic" aria-hidden>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HIRING PROCESS */}
        <section className="ca-section">
          <div className="ca-section-head">
            <div>
              <h2 className="ca-h2">Our hiring process</h2>
              <p>Fast, respectful, and boringly clear. Usually 2–3 weeks end to end.</p>
            </div>
          </div>
          <div className="ca-steps">
            {HIRING_STEPS.map((s) => (
              <div key={s.n} className="ca-step">
                <div className="n">STEP {s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ca-section">
          <div className="ca-cta">
            <h2>Don't see your role?</h2>
            <p>
              If you're exceptional at what you do and would love to work with this team, send an
              open application. We keep every note on file and reach out when a fit opens up.
            </p>
            <div className="actions">
              <a href={`mailto:${CONTACT_EMAIL}?subject=Open%20application`} className="ca-btn">
                Email {CONTACT_EMAIL}
              </a>
              <CopyButton text={CONTACT_EMAIL} label="Copy email" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
