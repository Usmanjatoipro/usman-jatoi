import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — What People Say About Usman Jatoi" },
      {
        name: "description",
        content:
          "Kind words from founders, creators, and clients Usman Jatoi has worked with across Redsglow, UJ Online, and independent projects.",
      },
      { property: "og:title", content: "Testimonials — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Real feedback from real people — founders, creators, and clients who've partnered with Usman Jatoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestimonialsPage,
});

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
  tag?: string;
  rating?: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Usman doesn't just deliver work — he thinks like a partner. Our brand went from scattered to sharp in weeks, not months. Genuinely the best decision we made this year.",
    name: "Ayesha Khan",
    role: "Founder, Loomiere",
    initial: "A",
    tag: "Branding",
    rating: 5,
  },
  {
    quote:
      "Rare mix of speed, taste, and business sense. He asks the right questions, ships fast, and leaves you with something you're actually proud to show off.",
    name: "Daniel Ortega",
    role: "CEO, Northwind Digital",
    initial: "D",
    tag: "Web",
    rating: 5,
  },
  {
    quote:
      "We rebuilt our entire funnel with Usman's team. Conversion jumped, support tickets dropped, and the site finally looks like the brand we always wanted.",
    name: "Priya Sharma",
    role: "Head of Growth, Bloomstack",
    initial: "P",
    tag: "Web & CRO",
    rating: 5,
  },
  {
    quote:
      "The automations Usman set up saved us roughly 20 hours a week. It felt like adding a full-time hire without the headache of hiring one.",
    name: "Marcus Reid",
    role: "Founder, ReidCraft Studio",
    initial: "M",
    tag: "Automation",
    rating: 5,
  },
  {
    quote:
      "Working with Usman is refreshing. No fluff, no ego — just clean strategy, clean delivery, and a real interest in your success.",
    name: "Sana Malik",
    role: "Creator & Coach",
    initial: "S",
    tag: "Consulting",
    rating: 5,
  },
  {
    quote:
      "Redsglow felt like an extension of our own team. Deadlines, quality, communication — all elite. We've already booked our next project.",
    name: "Julian Frost",
    role: "Marketing Director, Cavalry Co.",
    initial: "J",
    tag: "Agency",
    rating: 5,
  },
  {
    quote:
      "I've hired a lot of agencies. Usman's studio is the first one that made me feel like my project actually mattered to them.",
    name: "Zara Ahmed",
    role: "Founder, Petalworks",
    initial: "Z",
    tag: "Branding",
    rating: 5,
  },
  {
    quote:
      "The AI workflows he built for our support team are magic. Response times cut in half and our team finally has room to breathe.",
    name: "Owen Blake",
    role: "COO, Trailside SaaS",
    initial: "O",
    tag: "AI",
    rating: 5,
  },
  {
    quote:
      "Usman is one of those rare operators who genuinely cares about the outcome, not just the deliverable. Highly, highly recommend.",
    name: "Fatima Noor",
    role: "Independent Founder",
    initial: "F",
    tag: "Consulting",
    rating: 5,
  },
];

const stats = [
  { value: "500+", label: "Projects delivered" },
  { value: "4.9/5", label: "Average client rating" },
  { value: "40+", label: "Countries served" },
  { value: "98%", label: "Repeat & referral rate" },
];

function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes tGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .t-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: tGradient 8s ease infinite;
        }
        .t-pill {
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
        .t-pill.dark { background:#111; color:#fff; }
        .t-pill.dark::before { display:none; }
        .t-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: tGradient 8s ease infinite;
          pointer-events:none;
        }
        .t-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 28px;
          height: 100%;
          display:flex; flex-direction:column;
          transition: transform .3s ease;
        }
        .t-card:hover { transform: translateY(-4px); }
        .t-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: tGradient 10s ease infinite;
          pointer-events:none;
        }
        .t-tag {
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
        .t-avatar {
          width:44px; height:44px;
          border-radius:999px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          font-weight:800;
          font-size:18px;
          background: linear-gradient(135deg,#ff5f6d,#4facfe,#a06cff);
          flex-shrink:0;
        }
        .t-stat-value {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: tGradient 8s ease infinite;
        }
        .t-quote-mark {
          font-family: Georgia, serif;
          font-size: 56px;
          line-height: 1;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: tGradient 8s ease infinite;
        }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center">
        <span className="t-tag mb-6">Testimonials</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Kind words from
          <br />
          <span className="t-gradient-text">real partners</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          A collection of feedback from founders, creators, and teams I've
          had the privilege to work with. No paid reviews — just honest words
          from real projects.
        </p>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="t-card text-center">
              <div className="t-stat-value">{s.value}</div>
              <div className="mt-3 text-sm text-neutral-600 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="t-card">
              <div className="flex items-center justify-between">
                <span className="t-quote-mark">“</span>
                {t.tag && <span className="t-tag">{t.tag}</span>}
              </div>
              {t.rating && (
                <div className="mt-1 text-amber-500 text-lg" aria-label={`${t.rating} out of 5`}>
                  {"★".repeat(t.rating)}
                  <span className="text-neutral-300">
                    {"★".repeat(5 - t.rating)}
                  </span>
                </div>
              )}
              <blockquote className="mt-4 text-neutral-700 leading-relaxed flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 pt-6 border-t border-neutral-100">
                <span className="t-avatar">{t.initial}</span>
                <div>
                  <div className="font-bold tracking-tight">{t.name}</div>
                  <div className="text-sm text-neutral-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="t-card text-center">
          <span className="t-tag mb-4">Your turn</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Let's build something worth <span className="t-gradient-text">talking about</span>
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Whether it's branding, web, automation, or a full-blown launch —
            let's make your next project the one you brag about.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="t-pill dark">
              Start a project →
            </a>
            <a href="/businesses" className="t-pill">
              Explore the studio
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
