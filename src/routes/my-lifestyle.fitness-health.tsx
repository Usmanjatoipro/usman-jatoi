import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/my-lifestyle/fitness-health")({
  head: () => ({
    meta: [
      { title: "Fitness & Health — My Lifestyle | Usman Jatoi" },
      {
        name: "description",
        content:
          "How Usman Jatoi balances a fast-paced digital career with fitness, health, and personal well-being.",
      },
      {
        property: "og:title",
        content: "Fitness & Health — My Lifestyle | Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "The honest story of my fitness and health journey as a digital entrepreneur — and the plan forward.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/my-lifestyle/fitness-health",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/my-lifestyle/fitness-health",
      },
    ],
  }),
  component: FitnessHealthPage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "The Beginning",
    icon: "🌱",
    title: "Where the story starts",
    paragraphs: [
      "I was born on April 18, 2006, in Jeddah, Saudi Arabia. When I was two, my family moved back to Khanpur District, Pakistan — where I grew up.",
      "My journey into the digital world started very early. I was seven when I first touched a computer seriously, and I started working professionally at twelve. For a long time, my focus was on learning new skills and building things — which meant long hours in front of a screen, and less time for personal care.",
    ],
  },
  {
    tag: "Early Digital Life",
    icon: "💻",
    title: "How screens shaped my body",
    paragraphs: [
      "As a kid I was obsessed with coding, making games, and building apps. Then came graphic design, 3D modeling, and video editing. Each new passion pulled me deeper into the chair.",
      "In 2020, I spent a whole year learning 3D modeling and working as an artist on Fiverr. My early YouTube channels — UJTutorial and Usman Art — meant even more time sitting and working. In 2021 I moved into video editing and made a documentary with my brother. By 2022 I was producing ads for local businesses in my city.",
      "My skills grew fast, but my body didn't always keep up. My eyes felt heavy. My back would ache. Output was high, but personal habits around fitness quietly slipped.",
    ],
  },
  {
    tag: "Business & Health",
    icon: "🚀",
    title: "Redsglow, Pearl Lemon, and long nights",
    paragraphs: [
      "Building Redsglow — first hand-coded, later rebuilt in WordPress — took months of focused work. Setting up the agency across every social platform meant more long sitting sessions.",
      "At 16, I joined Pearl Lemon Group in the UK — the youngest on the team. I redesigned major websites quickly and took on many projects. I once accidentally crashed the main Pearl Lemon website. A teammate helped fix it, but the stress was real. Those high-pressure moments take a toll if you don't manage them.",
      "I became Head of Web Design, then Head of Social Media. More responsibility, more meetings, more work. Pearl Lemon supported me generously — even personal loans during a home build and my brother's wedding — but the workload meant my own health kept slipping down the priority list.",
    ],
  },
  {
    tag: "The Honest Truth",
    icon: "🩺",
    title: "What my body is telling me",
    paragraphs: [
      "I'll be honest. Sleep hasn't been on time. Meals haven't been on schedule. I've had stomach issues, small ear problems, pimples on my chest, and a black mark on my leg. These are signs — not disasters, but signs.",
      "I rate my self-care in \"looks\" a 6 out of 10. I'm skinny, my nose isn't perfect, my eyes get tired, hair isn't always great, and my beard and mustache stay messy. I rate my overall health a 7 out of 10 — decent, but with clear things to fix.",
      "I'm not writing this for sympathy. I'm writing it because pretending everything is perfect is how founders quietly break down. Naming things is step one.",
    ],
  },
  {
    tag: "The Work",
    icon: "🧠",
    title: "Why my career demands better health",
    paragraphs: [
      "I've shipped 300+ graphic design projects, 190+ websites, and built 1,000+ small converter plugins. I make AI videos, Chrome extensions, and manage teams across ventures.",
      "Every one of those outputs demands a clear mind and steady energy — which only come from real sleep, real food, and real movement. Web design, 3D, video editing, AI research, automation, SEO, and running businesses are all sedentary, screen-heavy, and cognitively expensive.",
      "The math is simple: if I want the next decade of output to beat the last, my body has to keep up with my ambition.",
    ],
  },
  {
    tag: "The Plan",
    icon: "🎯",
    title: "Making health non-negotiable",
    paragraphs: [
      "Going forward, fitness and health aren't a \"someday\" project. They're the foundation everything else runs on.",
      "That means fixed sleep windows, real meals instead of skipped ones, movement built into the day, screen breaks that I actually take, and finally addressing the small health issues I've been ignoring — the stomach, the ears, the skin.",
      "I'm not chasing perfection. I'm chasing a version of me that can sustain building for the next 20 years — clear-eyed, calm, and strong enough to keep showing up.",
    ],
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How important is fitness and health to Usman Jatoi?",
    a: "Extremely important — and increasingly a priority. Long hours in front of screens made it easy to push health aside, but the sustainability of every project depends on staying physically and mentally well.",
  },
  {
    q: "Did Usman Jatoi's early career affect his health?",
    a: "Yes. Starting professional work at 12 and diving into coding, 3D, and video editing meant thousands of sedentary hours. Sleep, movement, and consistent meals often got skipped in favor of deadlines.",
  },
  {
    q: "What specific health problems has Usman Jatoi mentioned?",
    a: "Stomach issues, minor ear problems, pimples on the chest, a black mark on the leg, irregular sleep, and general eye fatigue from screen time.",
  },
  {
    q: "How does Usman Jatoi plan to improve his fitness and health habits?",
    a: "Fixed sleep hours, regular meals, daily movement, scheduled screen breaks, and treating the small health issues instead of ignoring them.",
  },
  {
    q: "Is it hard for someone in the digital world to stay fit and healthy?",
    a: "Yes. Digital work is naturally sedentary and mentally intense, and the culture rewards long hours. Staying healthy takes deliberate structure, not willpower alone.",
  },
  {
    q: "Does Usman Jatoi believe good health helps his work?",
    a: "Completely. Better sleep, food, and movement produce sharper thinking, more consistent energy, and less burnout — which directly translates to better creative and business output.",
  },
  {
    q: "Where can I read more about Usman Jatoi's overall lifestyle?",
    a: "Visit the My Lifestyle section — including Hobbies and Gaming Life — to see the full picture of how life and work fit together.",
  },
];

function FitnessHealthPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-neutral-900">My Lifestyle</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Fitness &amp; Health</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            My Lifestyle · Fitness &amp; Health
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Building a body that can keep up with the mission.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            For me, fitness and health aren't just about looking good — they're
            the base layer of everything I build. This is the honest story of
            where I've been, where I am, and where I'm going.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-14">
          {[
            { label: "Self-care (looks)", value: "6 / 10" },
            { label: "Overall health", value: "7 / 10" },
            { label: "Priority now", value: "High" },
          ].map((s) => (
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
        </div>

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
            More of my lifestyle
          </h2>
          <p className="mt-2 text-neutral-700">
            Fitness is one piece. Explore the rest of how I live and work.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/my-lifestyle/hobbies"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Hobbies
            </Link>
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Say hello
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
