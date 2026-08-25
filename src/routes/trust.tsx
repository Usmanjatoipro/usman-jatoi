import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/trust")({
    head: () => ({
    meta: [
      { title: "Trust & Transparency — Usman Jatoi" },
      { name: "description", content: "Security standards, client confidentiality, and operational integrity." },
      { property: "og:title", content: "Trust & Transparency — Usman Jatoi" },
      { property: "og:description", content: "Security standards, client confidentiality, and operational integrity." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/trust" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/trust" }],
  }),
  component: TrustPage,
});

type Section = {
  title: string;
  body: string[];
  bullets?: string[];
};

const sections: Section[] = [
  {
    title: "Access & Authentication",
    body: [
      "Admin areas of UsmanJatoi.com are protected by email-based sign-in. Only accounts explicitly granted an admin role can access private dashboards, import tools, or submissions.",
    ],
    bullets: [
      "Public pages are open to everyone; no account is required to read them.",
      "Admin sessions use short-lived tokens managed by our hosting platform.",
      "Role checks run server-side, not in the browser.",
    ],
  },
  {
    title: "Hosting & Platform",
    body: [
      "The site runs on modern serverless infrastructure. Application logic, media, and database services are provided through Lovable Cloud. This is a platform capability description — not an independent certification.",
    ],
  },
  {
    title: "Data We Collect",
    body: [
      "We aim to keep the personal data footprint small. The main data touchpoints are:",
    ],
    bullets: [
      "Contact form submissions (name, email, optional phone, message).",
      "Basic analytics (page views, referrer, approximate location from IP).",
      "Third-party chat and video widgets when you interact with them.",
    ],
  },
  {
    title: "How We Use It",
    body: [
      "Submitted information is used to respond to your inquiry, follow up on collaborations, and improve the site. We do not sell personal data. Marketing outreach is limited to conversations you started.",
    ],
  },
  {
    title: "Subprocessors & Integrations",
    body: [
      "The site relies on a small set of third parties to operate. Each has their own privacy policy:",
    ],
    bullets: [
      "Lovable Cloud — application hosting, database, and storage.",
      "Chatway — embedded chat widget.",
      "VideoAsk — embedded async video messaging.",
    ],
  },
  {
    title: "Cookies & Analytics",
    body: [
      "We use a minimal set of cookies for session state and basic analytics. Third-party widgets may set their own cookies when loaded. You can clear cookies at any time via your browser settings.",
    ],
  },
  {
    title: "Retention & Deletion",
    body: [
      "Contact submissions are retained as long as they are useful for the ongoing conversation. If you would like your message or personal data removed, email us and we will delete it from our records.",
    ],
  },
  {
    title: "Responsible Disclosure",
    body: [
      "If you believe you have found a security issue on UsmanJatoi.com, please report it privately before sharing publicly. We appreciate researchers who give us a chance to fix issues first.",
    ],
    bullets: [
      "Email: security@usmanjatoi.com",
      "Please include reproduction steps and any relevant URLs.",
      "We aim to acknowledge reports within a few business days.",
    ],
  },
  {
    title: "Shared Responsibility",
    body: [
      "Security is a shared effort. The hosting platform maintains the underlying infrastructure, we maintain the application and content, and visitors are responsible for keeping their own accounts, devices, and credentials safe.",
    ],
  },
];

function TrustPage() {
  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Trust</span>
        </nav>

        <header className="mb-12">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Trust Center
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Privacy, security, and how we handle your data.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            This page is maintained by Usman Jatoi to answer common security and
            privacy questions about UsmanJatoi.com. It describes current,
            app-visible practices — it is not an independent certification or
            audit report.
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            >
              <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-700 leading-relaxed">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.bullets && (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-neutral-700">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Questions or concerns?
          </h2>
          <p className="mt-2 text-neutral-700">
            If you have a privacy request, a security report, or want to know
            more about how a specific feature handles data, get in touch.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact Usman
            </Link>
            <a
              href="mailto:security@usmanjatoi.com"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              security@usmanjatoi.com
            </a>
          </div>
          <p className="mt-6 text-xs text-neutral-500">
            Last reviewed: July 2026. This page is app-owned editable content
            and may be updated as our practices evolve.
          </p>
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
