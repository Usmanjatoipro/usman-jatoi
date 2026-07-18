import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/media-kit")({
  head: () => ({
    meta: [
      { title: "Media Kit — Usman Jatoi" },
      {
        name: "description",
        content:
          "Official media kit for Usman Jatoi — bio, brand logos, high-res photos, stats and press contact for interviews, features and collaborations.",
      },
      { property: "og:title", content: "Media Kit — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Bio, logos, photos, stats and press contact for Usman Jatoi. Everything you need to feature, interview or collaborate.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://usmanjatoi.com/wp-content/uploads/2025/02/cropped-Imagee-Character-2-300x300.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MediaKitPage,
});

const SHORT_BIO =
  "Usman Jatoi is a digital designer, developer and creative entrepreneur with 7+ years of experience building websites, 3D models, Chrome extensions and brand systems. He leads teams, ships products and helps founders launch fast.";

const LONG_BIO =
  "Usman Jatoi has spent over seven years at the intersection of design, code and creative direction — from freelancing on small brand projects to leading teams and launching digital products. His work spans 500+ websites, 1000+ automation flows, 3D visuals, Chrome extensions and content systems for creators and startups worldwide. He is the founder of multiple brands (UJ Online, Redsglow, RabbitFlare, Usama 2.0) and partners with agencies like Pearl Lemon on growth and design.";

const LOGOS = [
  { name: "Usman Jatoi Pro", file: "Usman-Jatoi-Pro.webp" },
  { name: "UJ Online", file: "UJonline-Minimal-Logo.png" },
  { name: "Usama 2.0", file: "Usama-2.0-Logo.png" },
  { name: "Redsglow", file: "Redsglow-Logo.png" },
  { name: "RabbitFlare", file: "RabbitFlare-Logo.png" },
  { name: "Pearl Lemon (Partner)", file: "pearl-lemon-logo.webp" },
];

const PHOTOS = [
  { name: "Portrait — Character", file: "cropped-Imagee-Character-2.webp" },
  { name: "Portrait — Playing", file: "Me-Playng-Usman.webp" },
  { name: "Portrait — Pro", file: "Usman-Jatoi-Pro.webp" },
];

const STATS = [
  { value: "7+", label: "Years of experience" },
  { value: "500+", label: "Websites launched" },
  { value: "1,000+", label: "Automations built" },
  { value: "50+", label: "Brands & startups" },
];

const CONTACT = {
  email: "hello@usmanjatoi.com",
  website: "https://usmanjatoi.com",
  location: "Remote · Worldwide",
};

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
      className="mk-btn"
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function DownloadLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} download className="mk-btn" rel="noopener">
      {children}
    </a>
  );
}

function MediaKitPage() {
  return (
    <main className="mk-root">
      <style>{`
        .mk-root {
          --mk-ink: #0b0b0f;
          --mk-muted: #5a5a66;
          --mk-line: #e6e6ec;
          --mk-bg: #ffffff;
          --mk-soft: #f6f6f8;
          background: var(--mk-bg);
          color: var(--mk-ink);
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 96px 20px 120px;
          min-height: 100vh;
        }
        .mk-wrap { max-width: 1160px; margin: 0 auto; }
        .mk-eyebrow {
          display: inline-block;
          font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--mk-muted); margin-bottom: 18px;
        }
        .mk-h1 {
          font-size: clamp(44px, 7vw, 92px);
          line-height: 0.95; font-weight: 800; letter-spacing: -0.03em;
          margin: 0 0 20px;
        }
        .mk-h1 .grad {
          background: linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55);
          background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: mkflow 8s linear infinite;
        }
        @keyframes mkflow { to { background-position: -200% 0; } }
        .mk-lede { font-size: clamp(17px, 1.6vw, 20px); color: var(--mk-muted); max-width: 720px; line-height: 1.55; }
        .mk-h2 {
          font-size: clamp(28px, 3.4vw, 40px);
          font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px;
        }
        .mk-section { margin-top: 88px; }
        .mk-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .mk-section-head p { color: var(--mk-muted); max-width: 520px; margin: 0; }

        .mk-hero {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center;
        }
        @media (max-width: 860px) { .mk-hero { grid-template-columns: 1fr; } }
        .mk-portrait {
          aspect-ratio: 1/1; width: 100%; border-radius: 28px; overflow: hidden;
          background: var(--mk-soft);
          box-shadow: 0 24px 60px -30px rgba(10,10,20,0.35);
          position: relative;
        }
        .mk-portrait::before {
          content: ""; position: absolute; inset: -2px; border-radius: 30px; padding: 2px;
          background: linear-gradient(135deg,#ff2d55,#ff9500,#34c759,#0a84ff,#af52de);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
        .mk-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .mk-hero-cta { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
        .mk-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; border-radius: 999px;
          background: #fff; color: var(--mk-ink);
          font-weight: 600; font-size: 14px; cursor: pointer;
          position: relative; text-decoration: none;
          border: 2px solid transparent;
          background-image: linear-gradient(#fff,#fff), linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#0a84ff,#af52de,#ff2d55);
          background-origin: border-box; background-clip: padding-box, border-box;
          background-size: 100% 100%, 200% 100%;
          animation: mkflow 6s linear infinite;
          transition: transform .18s ease;
        }
        .mk-btn:hover { transform: translateY(-1px); }

        .mk-bio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 860px) { .mk-bio-grid { grid-template-columns: 1fr; } }
        .mk-card {
          background: var(--mk-soft);
          border: 1px solid var(--mk-line);
          border-radius: 20px;
          padding: 24px;
        }
        .mk-card h3 { margin: 0 0 12px; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mk-muted); font-weight: 700; }
        .mk-card p { margin: 0 0 16px; line-height: 1.65; color: #1f1f28; }

        .mk-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 860px) { .mk-stats { grid-template-columns: repeat(2, 1fr); } }
        .mk-stat {
          background: #0b0b0f; color: #fff; border-radius: 20px; padding: 28px 24px;
          position: relative; overflow: hidden;
        }
        .mk-stat .v { font-size: clamp(34px, 4vw, 48px); font-weight: 800; letter-spacing: -0.02em; }
        .mk-stat .l { color: #b8b8c4; margin-top: 6px; font-size: 14px; }
        .mk-stat::after {
          content: ""; position: absolute; inset: auto -30% -60% auto; width: 220px; height: 220px; border-radius: 999px;
          background: radial-gradient(closest-side, rgba(10,132,255,0.35), transparent 70%);
        }

        .mk-logos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 860px) { .mk-logos { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .mk-logos { grid-template-columns: 1fr; } }
        .mk-logo {
          background: #fff; border: 1px solid var(--mk-line); border-radius: 20px; padding: 24px;
          display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center;
        }
        .mk-logo .box { width: 100%; aspect-ratio: 16/10; background: var(--mk-soft); border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .mk-logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .mk-logo .name { font-weight: 700; }

        .mk-photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 860px) { .mk-photos { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .mk-photos { grid-template-columns: 1fr; } }
        .mk-photo { position: relative; border-radius: 20px; overflow: hidden; background: var(--mk-soft); border: 1px solid var(--mk-line); }
        .mk-photo img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 4/5; display: block; }
        .mk-photo .cap { position: absolute; left: 12px; right: 12px; bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .mk-photo .tag { background: rgba(255,255,255,0.9); color: #0b0b0f; font-size: 12px; padding: 6px 10px; border-radius: 999px; font-weight: 600; }

        .mk-contact { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: stretch; }
        @media (max-width: 860px) { .mk-contact { grid-template-columns: 1fr; } }
        .mk-contact .dark {
          background: #0b0b0f; color: #fff; border-radius: 24px; padding: 32px; position: relative; overflow: hidden;
        }
        .mk-contact .dark::before {
          content: ""; position: absolute; inset: -1px; border-radius: 25px; padding: 1px;
          background: linear-gradient(135deg,#ff2d55,#ff9500,#34c759,#0a84ff,#af52de);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
        .mk-contact .dark h3 { margin: 0 0 20px; font-size: 24px; font-weight: 800; }
        .mk-contact .row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.08); gap: 16px; flex-wrap: wrap; }
        .mk-contact .row:last-child { border-bottom: none; }
        .mk-contact .row .k { color: #b8b8c4; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; }
        .mk-contact .row .v { font-weight: 600; }

        .mk-audio { width: 100%; margin-top: 8px; }
      `}</style>

      <div className="mk-wrap">
        {/* HERO */}
        <section className="mk-hero">
          <div>
            <span className="mk-eyebrow">Press · Partnerships · Features</span>
            <h1 className="mk-h1">
              Media <span className="grad">Kit</span>
            </h1>
            <p className="mk-lede">
              Everything you need to feature, interview or collaborate with Usman Jatoi — bio,
              brand logos, high-resolution photos, key stats and press contact, in one place.
            </p>
            <div className="mk-hero-cta">
              <CopyButton text={SHORT_BIO} label="Copy short bio" />
              <CopyButton text={CONTACT.email} label="Copy press email" />
              <a href={`mailto:${CONTACT.email}?subject=Press%20inquiry`} className="mk-btn">
                Email press
              </a>
            </div>
          </div>
          <div className="mk-portrait">
            <img
              src="/site-assets/cropped-Imagee-Character-2.webp"
              alt="Portrait of Usman Jatoi"
              loading="eager"
              decoding="async"
            />
          </div>
        </section>

        {/* BIO */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">Bio</h2>
              <p>Copy-paste ready. Use whichever length fits your feature or intro card.</p>
            </div>
          </div>
          <div className="mk-bio-grid">
            <div className="mk-card">
              <h3>Short bio · 50 words</h3>
              <p>{SHORT_BIO}</p>
              <CopyButton text={SHORT_BIO} label="Copy short bio" />
            </div>
            <div className="mk-card">
              <h3>Long bio · 100 words</h3>
              <p>{LONG_BIO}</p>
              <CopyButton text={LONG_BIO} label="Copy long bio" />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">By the numbers</h2>
              <p>A snapshot of impact across products, brands and creative work.</p>
            </div>
          </div>
          <div className="mk-stats">
            {STATS.map((s) => (
              <div key={s.label} className="mk-stat">
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LOGOS */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">Brand & partner logos</h2>
              <p>Right-click to save, or hit download. Please don't recolor or distort.</p>
            </div>
          </div>
          <div className="mk-logos">
            {LOGOS.map((l) => (
              <div key={l.file} className="mk-logo">
                <div className="box">
                  <img src={`/site-assets/${l.file}`} alt={`${l.name} logo`} loading="lazy" />
                </div>
                <div className="name">{l.name}</div>
                <DownloadLink href={`/site-assets/${l.file}`}>Download</DownloadLink>
              </div>
            ))}
          </div>
        </section>

        {/* PHOTOS */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">Photos</h2>
              <p>Approved portraits for editorial, podcast covers and social features.</p>
            </div>
          </div>
          <div className="mk-photos">
            {PHOTOS.map((p) => (
              <a
                key={p.file}
                href={`/site-assets/${p.file}`}
                download
                className="mk-photo"
                aria-label={`Download ${p.name}`}
              >
                <img src={`/site-assets/${p.file}`} alt={p.name} loading="lazy" />
                <div className="cap">
                  <span className="tag">{p.name}</span>
                  <span className="tag">Download ↓</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* VOICE INTRO */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">Voice intro</h2>
              <p>A short spoken introduction — useful for podcasts or feature intros.</p>
            </div>
          </div>
          <div className="mk-card">
            <h3>Introductional voicenote</h3>
            <audio controls preload="none" className="mk-audio">
              <source src="/site-assets/Usman-Jatoi-Introductional-Voicenote.mp3" type="audio/mpeg" />
              Your browser doesn't support the audio element.
            </audio>
            <div style={{ marginTop: 14 }}>
              <DownloadLink href="/site-assets/Usman-Jatoi-Introductional-Voicenote.mp3">
                Download MP3
              </DownloadLink>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="mk-section">
          <div className="mk-section-head">
            <div>
              <h2 className="mk-h2">Press contact</h2>
              <p>Direct line for interviews, features, podcast bookings and partnerships.</p>
            </div>
          </div>
          <div className="mk-contact">
            <div className="dark">
              <h3>Get in touch</h3>
              <div className="row">
                <span className="k">Email</span>
                <span className="v">{CONTACT.email}</span>
              </div>
              <div className="row">
                <span className="k">Website</span>
                <span className="v">usmanjatoi.com</span>
              </div>
              <div className="row">
                <span className="k">Location</span>
                <span className="v">{CONTACT.location}</span>
              </div>
              <div className="row">
                <span className="k">Response time</span>
                <span className="v">Within 24 hours</span>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={`mailto:${CONTACT.email}?subject=Press%20inquiry`} className="mk-btn">
                  Email press
                </a>
                <CopyButton text={CONTACT.email} label="Copy email" />
              </div>
            </div>
            <div className="mk-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3>Booking notes</h3>
              <p>
                Available for interviews, podcasts, keynote talks and design/dev features. For
                sponsorships and brand collabs, please include audience size, deliverables and
                timeline in the first message.
              </p>
              <CopyButton
                text={`Hi Usman,\n\nWe'd love to feature you on [outlet]. Could we schedule a 30-min interview?\n\nAudience: \nFormat: \nProposed date: \n\nThanks!`}
                label="Copy inquiry template"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
