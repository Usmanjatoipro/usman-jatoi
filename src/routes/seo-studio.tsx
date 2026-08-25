import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Search,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Trophy,
} from "lucide-react";

const SITE = "https://usmanjatoi.com";

export const Route = createFileRoute("/seo-studio")({
  head: () => ({
    meta: [
      { title: "SEO Studio — Rank a Web Developer Portfolio" },
      {
        name: "description",
        content:
          "A guided, Semrush-powered playbook for ranking a web developer portfolio: keyword picks, difficulty, SERP competitors, and a 90-day content plan.",
      },
      { property: "og:title", content: "SEO Studio — Rank a Web Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Semrush-powered playbook to rank a developer portfolio: keywords, competitors, and a 90-day plan.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/seo-studio` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/seo-studio` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Rank a Web Developer Portfolio on Google",
          description:
            "A 5-step Semrush-powered playbook that goes from keyword research to a 90-day publishing plan.",
          step: [
            { "@type": "HowToStep", name: "Pick your battle keywords" },
            { "@type": "HowToStep", name: "Read the SERP honestly" },
            { "@type": "HowToStep", name: "Build a keyword ladder" },
            { "@type": "HowToStep", name: "Ship 6 anchor pages" },
            { "@type": "HowToStep", name: "Track, iterate, expand" },
          ],
        }),
      },
    ],
  }),
  component: SeoStudioPage,
});

/* ---------- Semrush-sourced data (US database, Nov 2026) ---------- */

const KEYWORDS = [
  { term: "web developer portfolio", volume: 720, cpc: 1.94, kd: 41, comp: "low", pick: "primary" },
  { term: "freelance web developer", volume: 1300, cpc: 6.83, kd: 35, comp: "low", pick: "primary" },
  { term: "hire wordpress developer", volume: 1300, cpc: 15.57, kd: 36, comp: "low", pick: "money" },
  { term: "shopify expert for hire", volume: 110, cpc: 13.67, kd: 38, comp: "medium", pick: "money" },
  { term: "frontend developer portfolio", volume: 50, cpc: 1.65, kd: 21, comp: "low", pick: "quick-win" },
  { term: "react developer portfolio", volume: 20, cpc: 0, kd: 0, comp: "low", pick: "quick-win" },
  { term: "seo consultant pakistan", volume: 20, cpc: 0, kd: 0, comp: "medium", pick: "quick-win" },
  { term: "how to build a web developer portfolio", volume: 20, cpc: 2.43, kd: 32, comp: "medium", pick: "blog" },
] as const;

const SERP = [
  { rank: 1, domain: "reddit.com", note: "Community thread — beatable with a real portfolio + case studies" },
  { rank: 2, domain: "github.com", note: "Awesome-list — target the same intent with a curated /portfolio" },
  { rank: 3, domain: "wearedevelopers.com", note: "Examples article — write your own with 15+ live sites" },
  { rank: 4, domain: "dribbble.com", note: "Gallery — hard to beat, syndicate instead" },
  { rank: 5, domain: "hostinger.com", note: "How-to guide — matches the 'how to build' question cluster" },
  { rank: 6, domain: "webportfolios.dev", note: "Niche site — beatable with fresher content" },
] as const;

const PLAN = [
  {
    month: "Month 1",
    goal: "Land the money pages",
    items: [
      "Rewrite /services with 'hire wordpress developer' as H1 intent",
      "Ship /portfolio with 15+ live projects (screenshots + stack + result)",
      "Add case-study template with problem → solution → metric",
    ],
  },
  {
    month: "Month 2",
    goal: "Quick wins on low-KD terms",
    items: [
      "Publish 'React developer portfolio' showcase page",
      "Publish 'Frontend developer portfolio' guide with your own examples",
      "Add 'SEO consultant Pakistan' location page — near-zero difficulty",
    ],
  },
  {
    month: "Month 3",
    goal: "Answer the question cluster",
    items: [
      "Write 'How to build a web developer portfolio' long-form guide",
      "Add FAQ block with 8+ 'how to' variants (schema markup)",
      "Interlink from every case study back to /services and /portfolio",
    ],
  },
] as const;

const CHECKLIST = [
  "Every page has a unique <title> under 60 characters",
  "Every page has a description under 158 characters",
  "og:image is set per page (not just sitewide)",
  "Featured images have descriptive alt text",
  "One H1 per page, matching the target keyword intent",
  "Internal links use descriptive anchor text (not 'click here')",
  "sitemap.xml lists every URL you want indexed",
  "robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot",
] as const;

/* ---------- UI ---------- */

function kdBadge(kd: number) {
  if (kd === 0) return { text: "very easy", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
  if (kd <= 25) return { text: "easy", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
  if (kd <= 45) return { text: "possible", bg: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
  return { text: "hard", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30" };
}

function SeoStudioPage() {
  return (
    <main className="bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-40 pointer-events-none [background:radial-gradient(60%_60%_at_10%_10%,#a855f7_0%,transparent_60%),radial-gradient(50%_50%_at_90%_20%,#3b82f6_0%,transparent_60%),radial-gradient(50%_50%_at_50%_100%,#ec4899_0%,transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" aria-hidden="true" /> Powered by Semrush
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-4xl">
            Rank a Web Developer Portfolio on Google
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-3xl mb-8">
            A live worked example. Real keyword data, the actual SERP, and a
            90-day plan you can copy. Every number below comes from Semrush's
            US database.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#keywords"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-white/90 transition"
              aria-label="Jump to keyword research section"
            >
              Start with the data <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link
              to="/contact-me"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 hover:bg-white/10 transition"
            >
              Get this done for you
            </Link>
          </div>

          {/* Stat strip */}
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {[
              { label: "Primary keywords", value: "8" },
              { label: "Best difficulty", value: "0/100" },
              { label: "Top volume", value: "1.3K/mo" },
              { label: "Highest CPC", value: "$15.57" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <dt className="text-xs uppercase tracking-wider text-white/60">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Step 1 — Keywords */}
      <section id="keywords" className="border-b border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <StepHeader n={1} icon={<Search className="w-5 h-5" aria-hidden="true" />} title="Pick your battle keywords" />
          <p className="text-white/70 max-w-3xl mb-8">
            I asked Semrush what a developer portfolio should target. Here's
            the raw table — sort mentally by <em>volume × commercial intent ÷ difficulty</em>.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">Keyword research for a web developer portfolio</caption>
              <thead className="bg-white/5 text-white/70 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="text-left px-4 py-3">Keyword</th>
                  <th scope="col" className="text-right px-4 py-3">Volume</th>
                  <th scope="col" className="text-right px-4 py-3">CPC</th>
                  <th scope="col" className="text-right px-4 py-3">Difficulty</th>
                  <th scope="col" className="text-left px-4 py-3">Play</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {KEYWORDS.map((k) => {
                  const b = kdBadge(k.kd);
                  return (
                    <tr key={k.term} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">{k.term}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{k.volume.toLocaleString()}/mo</td>
                      <td className="px-4 py-3 text-right tabular-nums">${k.cpc.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${b.bg}`}>
                          {k.kd}/100 · {b.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70 capitalize">{k.pick.replace("-", " ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-white/50 mt-3">
            Source: Semrush US database. Difficulty is 0–100; anything under
            30 is realistic for a new portfolio.
          </p>
        </div>
      </section>

      {/* Step 2 — SERP */}
      <section className="border-b border-white/10 py-20 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <StepHeader n={2} icon={<Trophy className="w-5 h-5" aria-hidden="true" />} title="Read the SERP honestly" />
          <p className="text-white/70 max-w-3xl mb-8">
            Who currently owns page 1 for "web developer portfolio"? If it's
            all forums and awesome-lists, a real portfolio with case studies
            can crack the top 10. Here's the actual SERP:
          </p>
          <ol className="grid md:grid-cols-2 gap-3">
            {SERP.map((s) => (
              <li key={s.rank} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold tabular-nums">
                  {s.rank}
                </div>
                <div>
                  <div className="font-semibold">{s.domain}</div>
                  <p className="text-sm text-white/60 mt-1">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Step 3 — Ladder */}
      <section className="border-b border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <StepHeader n={3} icon={<Target className="w-5 h-5" aria-hidden="true" />} title="Build a keyword ladder" />
          <div className="grid md:grid-cols-3 gap-5">
            <LadderCard
              tone="emerald"
              title="Quick wins"
              blurb="0–25 KD, tiny volume but rankable in weeks"
              items={["react developer portfolio", "frontend developer portfolio", "seo consultant pakistan"]}
            />
            <LadderCard
              tone="amber"
              title="Money keywords"
              blurb="High CPC, low competition — this is where clients come from"
              items={["hire wordpress developer", "shopify expert for hire", "freelance web developer"]}
            />
            <LadderCard
              tone="sky"
              title="Content cluster"
              blurb="Question intent — 15+ variants around 'how to build'"
              items={["how to build a web developer portfolio", "web developer portfolio examples"]}
            />
          </div>
        </div>
      </section>

      {/* Step 4 — Plan */}
      <section className="border-b border-white/10 py-20 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <StepHeader n={4} icon={<BarChart3 className="w-5 h-5" aria-hidden="true" />} title="A 90-day plan" />
          <div className="grid md:grid-cols-3 gap-5">
            {PLAN.map((m) => (
              <article key={m.month} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-wider text-white/50">{m.month}</div>
                <h3 className="mt-1 text-xl font-bold">{m.goal}</h3>
                <ul className="mt-4 space-y-2">
                  {m.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-white/75">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Step 5 — Checklist */}
      <section className="border-b border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <StepHeader n={5} icon={<TrendingUp className="w-5 h-5" aria-hidden="true" />} title="Ship the on-page basics" />
          <div className="grid md:grid-cols-2 gap-3">
            {CHECKLIST.map((c) => (
              <div key={c} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-white/80">
              Semrush numbers are estimates, not visit counts. Use them to
              rank keywords against each other, then trust your own analytics
              for real traffic.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want this playbook run on your site?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            I do the keyword research, competitive analysis, and content plan,
            then build the pages that rank. Let's talk.
          </p>
          <Link
            to="/contact-me"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-semibold hover:bg-white/90 transition"
          >
            Start a project <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function StepHeader({ n, icon, title }: { n: number; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 flex items-center justify-center font-bold text-lg">
        {n}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-1.5">
          {icon} Step {n}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

function LadderCard({
  tone,
  title,
  blurb,
  items,
}: {
  tone: "emerald" | "amber" | "sky";
  title: string;
  blurb: string;
  items: string[];
}) {
  const tones = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    sky: "from-sky-500/20 to-sky-500/5 border-sky-500/30",
  } as const;
  return (
    <article className={`rounded-2xl border bg-gradient-to-b p-6 ${tones[tone]}`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-white/70 mt-1 mb-4">{blurb}</p>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="text-sm font-mono text-white/85">· {i}</li>
        ))}
      </ul>
    </article>
  );
}
