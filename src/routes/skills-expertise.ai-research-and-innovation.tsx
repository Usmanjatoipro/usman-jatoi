import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(
  "/skills-expertise/ai-research-and-innovation",
)({
  head: () => ({
    meta: [
      { title: "AI Research & Innovation — Skills & Expertise | Usman Jatoi" },
      {
        name: "description",
        content:
          "Hands-on AI research, automation, model tuning, and integration — grounded in a personal dataset spanning years of real life and work.",
      },
      {
        property: "og:title",
        content: "AI Research & Innovation — Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Practical AI — data pipelines, automation, model tuning, integration, and honest advisory. No hype.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content:
          "https://usmanjatoi.lovable.app/skills-expertise/ai-research-and-innovation",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/skills-expertise/ai-research-and-innovation",
      },
    ],
  }),
  component: AIResearchPage,
});

const dataset = [
  "30+ pages of school & religious background",
  "66-page log of my 7-year professional path",
  "2.5 years of company growth history",
  "Folder names from 2,500+ GB of files",
  "Meeting, Loom, and YouTube transcripts",
  "69+ Google apps: Gmail, Docs, Sheets, Drive, history",
  "Group chats from 250+ groups, 100+ people",
  "Conversations across Gemini, ChatGPT, Claude",
  "Notepad files from 3 phones",
  "Full ledgers: NayaPay, SadaPay, EasyPaisa, bank",
  "Email-based receipts and invoices",
];

const services: { icon: string; tag: string; title: string; body: string; bullets: string[] }[] = [
  {
    icon: "🧭",
    tag: "Advisory",
    title: "What I help with",
    body:
      "I track what's actually working — new research, experiments, and tools that aren't just flashy demos. Then I ask: can any of this fit your workflow? Could it help now, not five years from now?",
    bullets: [
      "Reviewing useful AI methods for real-world use",
      "Helping you think ahead by watching trends",
      "Translating technical updates into business-friendly insights",
    ],
  },
  {
    icon: "🧪",
    tag: "Model tuning",
    title: "Making AI models work better",
    body:
      "Just having a model isn't enough. You need it to behave — and that depends on training, fine-tuning, and clean data. I handle the behind-the-scenes work that makes the difference.",
    bullets: [
      "Preparing datasets properly",
      "Checking for biased or broken outputs",
      "Adjusting models for speed and better results",
    ],
  },
  {
    icon: "🔌",
    tag: "Integration",
    title: "Integrating AI into daily work",
    body:
      "The real challenge isn't understanding AI. It's making it fit into how you already work. I handle the awkward part — getting it to play nice with your tools and team.",
    bullets: [
      "Planning how AI fits into your setup",
      "Connecting it to your existing tools",
      "Onboarding your team with simple instructions",
    ],
  },
  {
    icon: "🔬",
    tag: "Research",
    title: "Doing the research for you",
    body:
      "Have a specific idea in mind? Wondering if AI can handle it? I dig in — strange data, tough processes, ambitious ideas — and come back with what's possible, what's not, and what's worth trying.",
    bullets: [
      "Deep technical checks for unusual use-cases",
      "Testing ideas before you commit resources",
      "Real answers, not guesses",
    ],
  },
  {
    icon: "🗺️",
    tag: "Strategy",
    title: "Building a real AI plan",
    body:
      "Maybe you know where you want to go — just not how to get there. I help plan the journey. No vague timelines. No buzzwords. Just steps, blockers, and what to expect at each stage.",
    bullets: [
      "Reviewing your current setup and resources",
      "Setting a phased plan",
      "Giving honest input on tools and trade-offs",
    ],
  },
];

const faqs = [
  {
    q: "What does AI research and innovation mean for my business?",
    a: "It means finding new ways to use AI to make your business better — faster tasks, more insight from your data, or entirely new products. The point is staying current and growing on purpose.",
  },
  {
    q: "Is AI only for big companies?",
    a: "No. Smaller teams often benefit more, because a single automation can replace hours of manual work. The tooling has caught up — cost and complexity are no longer the blocker they were.",
  },
  {
    q: "How long does it take to see results from AI projects?",
    a: "Small automations can pay off in days. Deeper integrations or model work usually land in weeks. Anyone promising overnight transformation is selling something.",
  },
  {
    q: "Do I need a lot of technical knowledge to work with you on AI?",
    a: "No. I translate the technical side into decisions you can make. You bring the business context; I handle the rest.",
  },
  {
    q: "What kind of data do I need for AI projects?",
    a: "Whatever you already have — spreadsheets, docs, emails, transcripts, product data. We audit it first, decide what's useful, and clean up from there.",
  },
  {
    q: "How do you make sure AI is used safely and fairly?",
    a: "By checking outputs for bias, controlling what data goes in, keeping sensitive information local when needed, and being honest about what a model can and can't do.",
  },
];

function AIResearchPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span>Skills &amp; Expertise</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">AI Research and Innovation</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Skills &amp; Expertise · AI Research
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              You can't understand AI by reading about it. You have to live inside it.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            My AI work started as a need, not a hobby — pushing past
            surface-level experiments to see what happens when a machine gets
            everything you've lived through.
          </p>
        </header>

        <article className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">🧠</div>
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">The Personal Dataset</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">A local offline chatbot that understands my life</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            One of my most serious projects: a local offline chatbot that
            understands me. Not vaguely — fully. I've been collecting data for
            over a year.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {dataset.map((d) => (
              <li
                key={d}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800"
              >
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-neutral-700 leading-relaxed">
            It sounds over-the-top. It is. But the point is real: if I can get
            a chatbot to grasp all of that, it's proof of what's possible when
            you pair raw data with persistence. No fairy dust — just late
            nights, bad outputs, file cleanup, broken code, and the constant
            tension between privacy and usefulness.
          </p>
        </article>

        <article className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">⚙️</div>
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">Automation In Practice</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Why this matters to you</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            When I work with businesses on AI, I don't rely on half-read
            whitepapers. I've seen where things break, where they quietly
            improve, and what actually helps. For example, an article
            generation workflow driven by a spreadsheet:
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-2 font-medium">Column</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr><td className="px-4 py-2 font-mono text-xs">A</td><td className="px-4 py-2">Website name</td></tr>
                <tr><td className="px-4 py-2 font-mono text-xs">B</td><td className="px-4 py-2">Keyword</td></tr>
                <tr><td className="px-4 py-2 font-mono text-xs">→</td><td className="px-4 py-2">Prompt fires into the AI tool</td></tr>
                <tr><td className="px-4 py-2 font-mono text-xs">←</td><td className="px-4 py-2">Content returned</td></tr>
                <tr><td className="px-4 py-2 font-mono text-xs">G</td><td className="px-4 py-2">Final link</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-neutral-700 leading-relaxed">
            Simple in theory — brutal at scale. Manual burns time. Fully
            automated costs too much unless you're fine with vague, generic
            output. Local AI writers help on price but often lag on freshness.
            The fix is prompt structure, filtering, and forcing clarity —
            lessons that carry straight into client work.
          </p>
        </article>

        <article className="mb-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🎯</div>
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">Where I Come In</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Grounded, not hyped</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            Most businesses know AI could help them, but not how or where to
            start. So they do nothing — or follow trends blindly, waste money,
            then back off when it doesn't deliver.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            I start by understanding how you work, what slows you down, and
            what you actually want to improve. Then I figure out what AI setup
            makes sense for you. No hype. Just clarity, options, and steps you
            can take without burning your time or budget.
          </p>
        </article>

        <div className="space-y-8">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                  {s.icon}
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  {s.tag}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{s.title}</h2>
              <p className="mt-3 text-neutral-700 leading-relaxed">{s.body}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-neutral-800">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[linear-gradient(90deg,#ff2d55,#af52de)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpen(open === i ? null : i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <span className="pr-4 font-medium text-neutral-900">{f.q}</span>
                  <span className={`text-2xl text-neutral-400 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                </div>
                {open === i && (
                  <div className="px-5 pb-6 pt-0 text-neutral-700 sm:px-6">{f.a}</div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Ready to see your business grow with AI?
          </h2>
          <p className="mt-2 text-neutral-700">
            The future of business is tied to how well we use tools like AI.
            Let's talk about your setup and where AI can actually help.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact me
            </Link>
            <Link
              to="/skills-expertise/technical-skills"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Technical skills
            </Link>
          </div>
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
