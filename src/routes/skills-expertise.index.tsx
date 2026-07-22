import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/skills-expertise/")({
  head: () => ({
    meta: [
      { title: "Skills & Expertise — Usman Jatoi" },
      {
        name: "description",
        content:
          "Leadership, creative, web, technical, SEO, AI, social, business, outreach, problem-solving, communication, and research — the full stack of skills Usman Jatoi brings to work.",
      },
      { property: "og:title", content: "Skills & Expertise — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Twelve disciplines across leadership, creative, engineering, marketing, AI, and business.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/skills-expertise",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/skills-expertise",
      },
    ],
  }),
  component: SkillsIndex,
});

type Skill = {
  n: string;
  icon: string;
  title: string;
  body: string;
  to?: string;
};

const skills: Skill[] = [
  {
    n: "01",
    icon: "",
    title: "Leadership & Project Management",
    body:
      "Led digital projects and a team of 19+ as Head of Department for 1.5+ years at a UK-based company. End-to-end workflows — flowcharts, strategies, prototypes — plus meetings and team training for smooth delivery.",
  },
  {
    n: "02",
    icon: "",
    title: "Creative Skills",
    body:
      "Expert in graphic design, UI/UX, video editing, and 3D. 500+ visuals — logos, social posts, thumbnails, ads, 3D models. Photoshop, Illustrator, Blender, Premiere, After Effects, Canva, CapCut, plus AI tools like Imagen, Gemini, RunwayML, Pika, Leonardo, D-ID, ElevenLabs.",
    to: "/skills-expertise/creative-skills",
  },
  {
    n: "03",
    icon: "",
    title: "Web Design & Dev",
    body:
      "Responsive websites in HTML, CSS, JS, and WordPress (Elementor, Divi, Oxygen, Breakdance). Shopify (Liquid, JSON), Webflow, Wix, and Leadpages. Custom solutions from scratch.",
  },
  {
    n: "04",
    icon: "",
    title: "Technical Skills",
    body:
      "Solve tech problems with clean code. Automation with Python Selenium, Make & N8N (700+ pages). Chrome extensions, 1,000+ WordPress plugins in PHP, and software like FxSound and Finest Browser. Skilled in \"Vibe Coding.\"",
    to: "/skills-expertise/technical-skills",
  },
  {
    n: "05",
    icon: "",
    title: "SEO & Marketing",
    body:
      "Visibility through keyword research, content strategy, on-page SEO, and backlinks. RankMath, Ahrefs, Semrush, Microsoft Clarity. PR campaigns, SEO listicles, and growth-focused content strategies.",
    to: "/skills-expertise/seo-marketing",
  },
  {
    n: "06",
    icon: "",
    title: "AI Research & Innovation",
    body:
      "Build AI-powered tools, sites, and systems using 10+ full-stack AI tools. AI games, chatbots, automated content systems, PWAs, and React sites. Founded AI startup Build On Vibe.",
    to: "/skills-expertise/ai-research-and-innovation",
  },
  {
    n: "07",
    icon: "",
    title: "Social Media Management",
    body:
      "Managed 7+ brand accounts. Content, reels, and scheduling across Instagram, YouTube, Facebook, Twitter, TikTok, LinkedIn, and Discord — focused on growth and real engagement.",
  },
  {
    n: "08",
    icon: "",
    title: "Digital Business Establishment",
    body:
      "Launch and set up online businesses from idea to full operation — strategy, website, online presence, and early growth systems.",
  },
  {
    n: "09",
    icon: "",
    title: "Lead Generation & Digital Outreach",
    body:
      "Find and connect with buyers via lead scraping (60,000+ leads) and targeted outreach across email, WhatsApp, Instagram, and LinkedIn.",
  },
  {
    n: "10",
    icon: "",
    title: "General Problem Solving & Resourcefulness",
    body:
      "Beyond specific skills — quick to learn new tools, spot how systems connect, and find working solutions with limited resources. Critical thinking, multiple angles, no bloat.",
  },
  {
    n: "11",
    icon: "",
    title: "Communication & Teamwork",
    body:
      "Worked with diverse teams including Pearl Lemon, trained team members, and kept groups aligned via daily reports and progress recordings. Real feedback from Kaushal, Ali Yasin, Deepak Shukla, Lydia, and others shaped how I communicate.",
  },
  {
    n: "12",
    icon: "",
    title: "Business Ideas & Research",
    body:
      "Generated 250+ business ideas and researched deeply into markets, tools, and opportunities. Turns curiosity into concrete direction.",
  },
];

function SkillsIndex() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Skills &amp; Expertise</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Services · 12 disciplines
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Skills &amp; Expertise
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            A full-stack digital toolkit — leadership, creative, engineering,
            marketing, AI, and business — built over years of shipping real work.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {skills.map((s) => {
            const inner = (
              <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                    {s.icon}
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{s.n}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {s.body}
                </p>
                {s.to && (
                  <span className="mt-4 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
                    Learn more →
                  </span>
                )}
              </div>
            );
            return s.to ? (
              <Link key={s.n} to={s.to} className="block">
                {inner}
              </Link>
            ) : (
              <div key={s.n}>{inner}</div>
            );
          })}
        </div>

        <article className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            The honest part
          </span>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            My journey in learning and growth
          </h2>
          <div className="mt-4 space-y-4 text-neutral-700 leading-relaxed">
            <p>
              My skills were built through constant work — a lot of it messy.
              Early YouTube uploads went nowhere. I walked away from a graphic
              design job because the pay didn't match the effort. I once
              accidentally crashed a main website at Pearl Lemon — a genuinely
              scary moment. All of it was learning.
            </p>
            <p>
              I've also had to balance work and health, sometimes badly. Those
              swings taught me how to manage myself and my projects, and how to
              get things done with limited resources.
            </p>
            <p>
              Looking ahead, I'm always learning — game development, custom
              software, future startups. The goal is to manage 1,000+ websites
              with a small team and budget, and keep finding cheaper, faster
              ways to publish. The stack keeps growing.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Work with me
            </Link>
            <Link
              to="/log"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See the changelog
            </Link>
          </div>
        </article>
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
