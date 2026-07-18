import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/my-lifestyle/")({
  head: () => ({
    meta: [
      { title: "My Lifestyle — Usman Jatoi" },
      {
        name: "description",
        content:
          "How Usman Jatoi lives — balancing focused digital work, learning, health, hobbies, and purpose.",
      },
      { property: "og:title", content: "My Lifestyle — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Discipline with flexibility, constant learning, honest health, and creative hobbies.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/my-lifestyle",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/my-lifestyle",
      },
    ],
  }),
  component: MyLifestylePage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "Daily Routine",
    icon: "🧭",
    title: "Discipline with flexibility",
    paragraphs: [
      "Discipline matters to me, but it doesn't mean being rigid. It means having a clear plan to get things done while leaving room for rest and other interests.",
      "My work is deep, focused digital projects — but I take breaks. That balance keeps burnout away and keeps energy steady.",
      "Work and personal life blend, because I enjoy what I do. Projects feel more like hobbies than chores, so I flow from one task to the next naturally.",
    ],
  },
  {
    tag: "Always Learning",
    icon: "📚",
    title: "Staying curious",
    paragraphs: [
      "Learning is a huge part of my life — not just for work, but because I like it. I've always been curious and tried many different skills, even ones I later dropped.",
      "I spend time exploring new tools and ideas on my own. It's not a duty; it's a source of joy and growth. Curiosity is what keeps me adapting as the digital world shifts.",
    ],
  },
  {
    tag: "Honest Health",
    icon: "🩺",
    title: "An honest look",
    paragraphs: [
      "I'm open about my health because it's part of my real life. Physically, I rate myself around 7/10. I'm skinny, my beard gets messy, and I'm not perfect — that's fine.",
      "Health-wise, also around 7/10. I deal with some stomach issues, don't always sleep well, and have minor skin problems. Knowing my limits keeps me grounded and pushes me to improve day by day.",
    ],
  },
  {
    tag: "Hobbies",
    icon: "🎨",
    title: "What I do beyond work",
    paragraphs: [
      "Art, photography, and filmmaking have been with me since I was young. Projects like the Khanpur Katora documentary come from that love of telling stories.",
      "I tried gaming with friends — fun for a while, but it didn't hold long-term interest. Travel, like my trip to Bhawalpur, clears my mind and gives me fresh perspective.",
    ],
  },
  {
    tag: "Physical Health",
    icon: "💪",
    title: "The base of everything",
    paragraphs: [
      "Taking care of my body is a priority because it supports everything else. Even with the challenges, I work to stay active. A strong body means a clearer mind and steadier output.",
      "It's a continuous process, not a one-time fix.",
    ],
  },
  {
    tag: "My Outlook",
    icon: "🔥",
    title: "Staying true and moving forward",
    paragraphs: [
      "I motivate myself by focusing on what actually matters, especially when things get tough. I remind myself not to quit because of what others might think.",
      "I'm proud of where I come from, and it shows in my creative work. I want to live honestly and with clear purpose, always aiming to be better.",
    ],
  },
];

const pillars: { title: string; to: string; description: string; emoji: string }[] = [
  {
    title: "Hobbies",
    to: "/my-lifestyle/hobbies",
    description: "Art, storytelling, curiosity, adventure, reflection, impact.",
    emoji: "🎨",
  },
  {
    title: "Fitness & Health",
    to: "/my-lifestyle/fitness-health",
    description: "The honest health story and the plan forward.",
    emoji: "🩺",
  },
  {
    title: "Gaming Life",
    to: "/my-lifestyle/gaming-life",
    description: "Fun, friendship, and why I moved on.",
    emoji: "🎮",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How does Usman Jatoi balance work and personal life?",
    a: "He mixes focused digital work with breaks and hobbies. Because his work overlaps with his passion, it doesn't feel like a chore — but he still leaves room for rest to avoid burnout.",
  },
  {
    q: "What role does learning play in his lifestyle?",
    a: "A central one. Learning isn't just for work — it's a source of joy. Exploring new tools and ideas keeps his mind sharp and his skills evolving with the digital world.",
  },
  {
    q: "Does he face any health challenges?",
    a: "Yes, and he's open about them — stomach issues, inconsistent sleep, and minor skin problems. He rates himself around 7/10 physically and treats health as an ongoing improvement, not a fixed state.",
  },
  {
    q: "What hobbies does he enjoy?",
    a: "Art, photography, and filmmaking are the core. He also enjoys travel and storytelling projects — like his documentary about Khanpur Katora.",
  },
  {
    q: "What mindset helps him stay motivated?",
    a: "Focusing on what genuinely matters, ignoring pressure to quit based on others' opinions, and drawing strength from where he comes from.",
  },
];

function MyLifestylePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">My Lifestyle</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            My Lifestyle
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Finding balance and purpose.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            My lifestyle isn't just what I do every day — it's how I live,
            shaped by my beliefs and what I care about. Focused work, real
            health, honest hobbies, and a clear mission.
          </p>
        </header>

        <section className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-50 text-2xl">
                {p.emoji}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                {p.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">{p.description}</p>
              <span className="mt-3 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
                Explore →
              </span>
            </Link>
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
            A life with purpose
          </h2>
          <p className="mt-2 text-neutral-700">
            Focused work, constant learning, honest health, and real hobbies —
            all pointing in the same direction. Want to talk about any of it?
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact me
            </Link>
            <Link
              to="/log"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              My changelog
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
