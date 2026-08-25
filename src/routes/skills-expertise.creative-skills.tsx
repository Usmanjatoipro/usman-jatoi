import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/skills-expertise/creative-skills")({
  head: () => ({
    meta: [
      { title: "Creative Skills — Skills & Expertise | Usman Jatoi" },
      {
        name: "description",
        content:
          "Branding, graphic design, thumbnails, social posters, video editing, and 3D — Usman Jatoi's creative toolbox and story.",
      },
      {
        property: "og:title",
        content: "Creative Skills — Skills & Expertise | Usman Jatoi",
      },
      {
        property: "og:description",
        content:
          "Turning ideas into visuals — brand systems, graphic design, video, and 3D.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content:
          "https://usmanjatoi.com/skills-expertise/creative-skills",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.com/skills-expertise/creative-skills",
      },
    ],
  }),
  component: CreativeSkillsPage,
});

type Section = {
  tag: string;
  icon: string;
  title: string;
  paragraphs: string[];
  ai?: { label: string; tools: string[] };
};

const sections: Section[] = [
  {
    tag: "Branding",
    icon: "",
    title: "Giving a voice to ideas",
    paragraphs: [
      "Branding is how people recognize and remember something. I handle the full stack — logo, motion graphics, color, typography, and mockups that show how it all lives in the real world.",
      "I've applied that to my own projects — Redsglow, my personal brand, and Redsglow's internal tools — plus branding work for Pearl Lemon Group in the UK.",
      "Every detail matters, from overall style down to the smallest touch.",
    ],
    ai: {
      label: "AI tools in the mix",
      tools: ["Adobe Firefly", "Midjourney", "DALL·E 3", "Looka"],
    },
  },
  {
    tag: "Thumbnails",
    icon: "",
    title: "Thumbnail designs",
    paragraphs: [
      "I've designed 100+ thumbnails for Fiverr gigs, documentaries, and YouTube videos.",
      "A thumbnail's job is one second of clarity — the right frame, the right hierarchy, the right stopping power.",
    ],
  },
  {
    tag: "Social Media",
    icon: "",
    title: "Social media posters",
    paragraphs: [
      "Social is often the first place people meet your brand. Posters have to grab attention fast and land the message clearly.",
      "I design for both — attention and emotion. The right palette, the right type, and consistency across a single post or a full campaign.",
    ],
  },
  {
    tag: "Mascots",
    icon: "",
    title: "Mascot logo work",
    paragraphs: [
      "I started making mascot logos in 2021, mostly for Twitch streamers and small creators. Early on, the work was simpler — more experimentation than polish.",
      "That phase taught me the fundamentals of character design and branding — clarity, recognizability, and personality. It's the base every stronger piece of work grew from.",
    ],
  },
  {
    tag: "Graphic Design",
    icon: "",
    title: "Turning ideas into pictures",
    paragraphs: [
      "Graphic design is where thoughts become clear, eye-catching visuals. I use Adobe Illustrator for vector work and logos, Photoshop for photo editing and detailed compositions, and Canva for quick social pieces. 3+ years hands-on.",
      "The tally so far: 100+ thumbnails, 15–20 logos, and 250+ mascot designs and other visuals — plus a steady stream of work on my own projects.",
    ],
    ai: {
      label: "AI tools in the mix",
      tools: [
        "Canva Magic Studio",
        "Clipdrop (Stability AI)",
        "Microsoft Designer",
        "PhotoRoom",
      ],
    },
  },
  {
    tag: "Video Editing",
    icon: "",
    title: "Making stories move",
    paragraphs: [
      "Video editing is how I tell longer stories — cutting, color, sound, effects, and pacing. The goal is engaging and memorable, not just polished.",
      "I've edited 4+ documentaries, including a street-food film, one on Cholistan, and \"KPR\" — a documentary about my own city, Khanpur District Rahim Khan.",
      "Beyond documentaries, I edit short reels for accountants and entrepreneurs, my own promos and ads, plus gaming and vlog content.",
      "Toolchain: Premiere Pro and After Effects for pro work, CapCut for social speed, and Filmora when simplicity wins.",
    ],
    ai: {
      label: "AI tools in the mix",
      tools: ["RunwayML", "Pika Labs", "HeyGen", "Descript", "Topaz Video AI"],
    },
  },
  {
    tag: "3D",
    icon: "",
    title: "3D modeling — worlds & objects",
    paragraphs: [
      "3D lets me build objects and environments in three-dimensional space — for games, animation, product visuals, or architectural mockups.",
      "I first learned 3ds Max on a house-mapping project, then spent two years deep in Blender, which is now my main 3D tool. I render with both Eevee and Cycles.",
      "During that stretch I built 50–100 models — low-poly game assets, full environments, and standalone objects.",
    ],
    ai: {
      label: "AI tools in the mix",
      tools: [
        "Blockade Labs (Skybox AI)",
        "Luma AI",
        "Instant NGP (Nvidia)",
        "Spline AI",
        "Masterpiece Studio",
      ],
    },
  },
  {
    tag: "The Journey",
    icon: "",
    title: "Learning, failing, growing",
    paragraphs: [
      "Not every experiment worked. Early YouTube videos didn't fly. I left a graphic design job because the pay didn't match the effort. Projects stalled, tools broke, deadlines bit back.",
      "Every one of those moments taught me something — usually about problem-solving and persistence more than about design.",
      "The work continues. New tools, new trends, new mediums — but the same goal: bring ideas to life in ways that actually land.",
    ],
  },
];

const stats = [
  { value: "300+", label: "Design projects" },
  { value: "100+", label: "Thumbnails" },
  { value: "250+", label: "Mascots & visuals" },
  { value: "4+", label: "Documentaries" },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "What types of creative work does Usman Jatoi do?",
    a: "Branding, graphic design, thumbnails, social posters, mascot logos, video editing, and 3D modeling — the whole visual stack.",
  },
  {
    q: "What graphic design tools does Usman Jatoi use?",
    a: "Adobe Illustrator for vectors and logos, Photoshop for photo work and detailed designs, and Canva for quick social pieces. 3+ years of hands-on experience.",
  },
  {
    q: "Has Usman Jatoi worked on documentary films?",
    a: "Yes — 4+ documentaries, including a street-food doc, one about Cholistan, and \"KPR,\" a documentary about his home city Khanpur District Rahim Khan.",
  },
  {
    q: "What 3D software is Usman Jatoi skilled in?",
    a: "Started with 3ds Max on a house-mapping project, then spent two years deep in Blender — now his primary tool, rendered in both Eevee and Cycles.",
  },
  {
    q: "How does Usman Jatoi use AI in his creative work?",
    a: "AI speeds up ideation and cleanup. Firefly, Midjourney, DALL·E 3, and Looka for branding; Canva Magic Studio, Clipdrop, Microsoft Designer, and PhotoRoom for graphic design; RunwayML, Pika, HeyGen, Descript, and Topaz for video; Blockade Labs, Luma, Instant NGP, Spline, and Masterpiece Studio for 3D.",
  },
  {
    q: "What kind of branding projects has Usman Jatoi completed?",
    a: "Full branding for Redsglow, his personal brand, tools inside Redsglow, and branding work for Pearl Lemon Group (UK) — logos, motion, color, typography, and mockups.",
  },
  {
    q: "How many visual pieces has Usman Jatoi created in graphic design?",
    a: "300+ graphic design projects overall, including 100+ thumbnails, 15–20 logos, and 250+ mascot designs and other visuals.",
  },
];

function CreativeSkillsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-neutral-900">Skills &amp; Expertise</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Creative Skills</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            Skills &amp; Expertise · Creative Skills
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              Bringing ideas to life through visuals and stories.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Creativity, for me, is more than tools. It's seeing what's possible
            and making it real — across branding, design, video, and 3D.
          </p>
        </header>

        <section className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
              {s.ai && (
                <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {s.ai.label}
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {s.ai.tools.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            Let's build something visual
          </h2>
          <p className="mt-2 text-neutral-700">
            Brand identity, thumbnails, posters, mascots, video, or 3D — tell
            me what you need and we'll take it from there.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Let's talk
            </Link>
            <Link
              to="/skills-expertise/technical-skills"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              See technical skills
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
