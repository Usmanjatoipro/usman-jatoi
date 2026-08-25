import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/skills-expertise/seo-marketing")({
  head: () => ({
    meta: [
      { title: "SEO & Marketing — Skills & Expertise | Usman Jatoi" },
      {
        name: "description",
        content:
          "How Usman Jatoi helps businesses get found online — keyword research, content strategy, on-page SEO, backlinks, PR, and growth.",
      },
      {
        property: "og:title",
        content: "SEO & Marketing — Skills & Expertise | Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Keyword research, content strategy, on-page SEO, backlinks, PR campaigns, and growth-focused content.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content:
          "https://usmanjatoi.com/skills-expertise/seo-marketing",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.com/skills-expertise/seo-marketing",
      },
    ],
  }),
  component: SeoMarketingPage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "Keyword Research",
    icon: "",
    title: "Understanding how people search",
    paragraphs: [
      "The first step in getting a business found is understanding what people actually type into Google. Keyword research is finding that secret language your customers already speak.",
      "If someone sells handmade jewelry, they might search for \"unique necklaces\" or \"custom earrings.\" Knowing those exact phrases lets us place them on the site so Google understands what the page is really about.",
      "I use tools like Ahrefs and Semrush to find not just the obvious keywords, but hidden ones with real volume and low competition. That's how you win traffic without fighting everyone else for it.",
    ],
  },
  {
    tag: "Content Strategy",
    icon: "",
    title: "Planning what to say",
    paragraphs: [
      "Once I know the keywords, the next step is deciding what content to make — topics, page types, and questions to answer.",
      "If people are searching for \"best ways to care for a house plant,\" the strategy might be a full blog post that actually answers that. It's not keyword stuffing — it's giving real value.",
      "I focus on making content clear, easy to read, and useful. That's what builds trust with visitors and pushes rankings up over time.",
    ],
  },
  {
    tag: "On-Page SEO",
    icon: "",
    title: "Making pages search-engine friendly",
    paragraphs: [
      "On-page SEO is about placing keywords in the right spots — titles, headings, meta descriptions — and making sure the site loads fast and works great on mobile.",
      "I use RankMath to keep every page structured cleanly, and Microsoft Clarity to see how real users behave — where they click, where they scroll, where they get stuck. That data tells me what to fix.",
      "A fast, well-organized page is good for Google and good for the human reading it. Both matter.",
    ],
  },
  {
    tag: "Backlinks",
    icon: "",
    title: "Building trust online",
    paragraphs: [
      "Backlinks are votes of confidence from other websites. When a trusted site links to yours, Google sees your site as more credible — and rankings move.",
      "I earn them the honest way: creating content worth linking to, and doing thoughtful outreach. It's slow, but the impact compounds.",
    ],
  },
  {
    tag: "PR & Growth",
    icon: "",
    title: "Getting the word out",
    paragraphs: [
      "SEO isn't the whole picture. PR campaigns put a business into articles, blogs, and media outlets — expanding reach and adding trust that pure search can't.",
      "Growth-focused content is content designed to actually convert: helpful articles, guides, and SEO listicles that pull in customers and turn a business into the go-to source in its space.",
      "I spent 2.5 years working closely with an SEO expert company. That was where a lot of real-world instincts got sharpened.",
    ],
  },
  {
    tag: "The Reality",
    icon: "⏳",
    title: "Challenges & continuous learning",
    paragraphs: [
      "SEO changes constantly. Google updates its rules, and what worked last year may not work now. I stay in learning mode — always.",
      "Results also take time. It's like planting a tree — the work happens now, the shade comes later. Patience is part of the job.",
      "My own early projects, like my first YouTube channel, taught me that creating isn't enough. You need a plan to get it seen. That lesson is baked into how I work today.",
    ],
  },
];

const toolkit: { name: string; use: string }[] = [
  { name: "Ahrefs", use: "Keyword & backlink research" },
  { name: "Semrush", use: "Competitor & keyword intelligence" },
  { name: "RankMath", use: "On-page SEO structure" },
  { name: "Microsoft Clarity", use: "User behavior & heatmaps" },
  { name: "Google Search Console", use: "Search performance & indexing" },
  { name: "Google Analytics", use: "Traffic & conversions" },
];

const stats = [
  { value: "12+", label: "Years in digital" },
  { value: "2.5y", label: "With SEO experts" },
  { value: "190+", label: "Sites launched" },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "What are Usman Jatoi's main SEO & Marketing skills?",
    a: "Keyword research, content strategy, on-page SEO, backlink building, PR campaigns, and creating growth-focused content designed to bring in real customers.",
  },
  {
    q: "What tools does Usman Jatoi use for SEO & Marketing?",
    a: "Ahrefs and Semrush for research, RankMath for on-page structure, Microsoft Clarity for user behavior, and Google Search Console + Analytics for performance tracking.",
  },
  {
    q: "How does Usman Jatoi help businesses get found online?",
    a: "By combining keyword research with a smart content plan, technical on-page SEO, and trust signals like backlinks and PR — so the right people find the business at the right time.",
  },
  {
    q: "What is \"content strategy\" in Usman Jatoi's SEO work?",
    a: "It's deciding what pages, posts, and answers a business needs based on real search behavior. The goal is content that's genuinely useful — not keyword-stuffed filler.",
  },
  {
    q: "How long has Usman Jatoi worked in SEO?",
    a: "SEO has been part of his digital work for years, including 2.5 years working closely with an established SEO expert company that shaped his real-world approach.",
  },
  {
    q: "Does Usman Jatoi also do PR campaigns?",
    a: "Yes. PR campaigns are used to place businesses in articles, blogs, and media outlets — expanding reach, adding authority, and complementing pure SEO work.",
  },
  {
    q: "What is Usman Jatoi's general approach to online marketing?",
    a: "Blend a deep understanding of how search engines work with smart content and promotion. Keep learning, stay patient, and measure everything.",
  },
];

function SeoMarketingPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-neutral-900">Skills &amp; Expertise</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">SEO &amp; Marketing</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Skills &amp; Expertise · SEO &amp; Marketing
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Getting businesses found — and growing them there.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Building a great website is only half the battle. The other half is
            making sure the right people can actually find it. That's where SEO
            and marketing come in.
          </p>
        </header>

        <section className="mb-14 grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 text-center"
            >
              <div className="text-2xl font-semibold sm:text-3xl">
                <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
                  {s.value}
                </span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        <div className="space-y-8">
          {sections.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                  {s.icon}
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  {s.tag}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-700 leading-relaxed">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">The toolkit</h2>
          <p className="mt-2 text-neutral-600">
            What I actually use, day to day.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolkit.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <div className="font-semibold text-neutral-900">{t.name}</div>
                <div className="mt-1 text-sm text-neutral-600">{t.use}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpen(open === i ? null : i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <span className="pr-4 font-medium text-neutral-900">
                    {f.q}
                  </span>
                  <span
                    className={`text-2xl text-neutral-400 transition-transform ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                {open === i && (
                  <div className="px-5 pb-6 pt-0 text-neutral-700 sm:px-6">
                    {f.a}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Want a website audit?
          </h2>
          <p className="mt-2 text-neutral-700">
            Get an honest look at what's working, what's not, and the fastest
            wins for organic traffic.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Request an audit
            </Link>
            <Link
              to="/testimonials"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See client results
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
