import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/my-lifestyle/gaming-life")({
  head: () => ({
    meta: [
      { title: "Gaming Life — My Lifestyle | Usman Jatoi" },
      {
        name: "description",
        content:
          "My gaming life — the friends, the games, the motion sickness, and why I stepped away to focus on creating.",
      },
      {
        property: "og:title",
        content: "Gaming Life — My Lifestyle | Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Fun, friendship, and moving on — Usman Jatoi's honest take on gaming.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.com/my-lifestyle/gaming-life",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.com/my-lifestyle/gaming-life",
      },
    ],
  }),
  component: GamingLifePage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "The Social Side",
    icon: "",
    title: "Playing with friends",
    paragraphs: [
      "Like many young people, I spent time playing video games. It started as a way to connect and share moments with friends. We played a mix of mobile and PC games together.",
      "The games themselves were secondary. The friendships, the late-night sessions, the yelling into a mic when a match got tight — that was the whole point.",
      "My friends really enjoyed those times, and that was the main reason I played. We even started a YouTube channel called \"UJGamer418\" to share our sessions.",
    ],
  },
  {
    tag: "Alone Mode",
    icon: "",
    title: "A different experience solo",
    paragraphs: [
      "Playing games by myself never truly felt fun. In fact, trying to play alone — especially first-person titles — often led to nausea, headaches, and boredom.",
      "It turns out I have motion sickness, and certain game movements would trigger it. My connection to gaming was mostly tied to the people I played with. Without friends on the other end, the same game felt like a chore.",
      "That was an important realization: what's a relaxing hobby for many wasn't relaxing for me.",
    ],
  },
  {
    tag: "The Shift",
    icon: "",
    title: "Understanding what actually matters",
    paragraphs: [
      "Over time, I learned to listen to what truly held my interest and what simply filled time. Gaming was a social outlet — the joy was in the people, not the activity itself.",
      "My passion for creating art, making videos, and building digital tools was a much deeper, longer-lasting interest. So I chose to move gaming out of the center of my life and shut down the gaming channel.",
      "Not because gaming is bad. Because my creative energy belonged somewhere else.",
    ],
  },
  {
    tag: "Takeaways",
    icon: "",
    title: "Lessons from my gaming days",
    paragraphs: [
      "Friendship value: how much I value time and shared experiences with people I care about.",
      "Self-awareness: what truly engages me vs. what just passes the time — and recognizing my motion sickness with certain games.",
      "Making choices: picking activities that support my growth and well-being, instead of going along with what others do.",
    ],
  },
];

const games: { label: string; group: string; items: string[] }[] = [
  {
    label: "Mobile",
    group: "",
    items: ["Free Fire", "PUBG Mobile", "Subway Surfers"],
  },
  {
    label: "PC",
    group: "",
    items: [
      "Call of Duty",
      "IGI",
      "GTA: San Andreas",
      "Need for Speed",
      "Assassin's Creed",
      "Tekken",
    ],
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "What games did you play?",
    a: "A mix of mobile and PC — Free Fire, PUBG Mobile, Subway Surfers, Call of Duty, IGI, Grand Theft Auto (like San Andreas), Need for Speed, Assassin's Creed, and Tekken.",
  },
  {
    q: "Did you enjoy playing games alone?",
    a: "Not really. Solo play — especially first-person games — often gave me headaches and nausea. Motion sickness plus lack of the social element made it feel like a chore.",
  },
  {
    q: "Why did you start a gaming YouTube channel if you didn't always enjoy playing?",
    a: "The channel — UJGamer418 — was a way to share time with friends and turn our sessions into something we could look back on. It was more about the group than the games.",
  },
  {
    q: "What made you decide to stop focusing on gaming?",
    a: "I realized my creative energy went further into art, video, and building digital tools. Gaming was fun socially, but it wasn't where my real interest lived.",
  },
  {
    q: "What did your gaming experiences teach you?",
    a: "That I value friendships and shared time deeply, that self-awareness beats just going along with the crowd, and that choosing where you spend your time is one of the most important decisions you make.",
  },
];

function GamingLifePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-neutral-900">My Lifestyle</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Gaming Life</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            My Lifestyle · Gaming Life
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Fun, friendship, and moving on.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Gaming, for me, was always about connection — less about the games,
            more about the people. This is what I played, why I played, and why
            I eventually stepped away.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-14">
          {games.map((g) => (
            <div
              key={g.label}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-xl">
                  {g.group}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">
                    {g.label} games
                  </div>
                  <div className="text-lg font-semibold">Regulars</div>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700"
                  >
                    {i}
                  </li>
                ))}
              </ul>
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
            The rest of how I live and work.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/my-lifestyle/hobbies"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Hobbies
            </Link>
            <Link
              to="/my-lifestyle/fitness-health"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Fitness &amp; Health
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
