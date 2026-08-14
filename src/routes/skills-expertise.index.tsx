import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/skills-expertise/")({
  head: () => ({
    meta: [
      { title: "Skills & Expertise - Usman Jatoi" },
      {
        name: "description",
        content:
          "Leadership, creative, technical, SEO, AI and business skills by Usman Jatoi.",
      },
      { property: "og:title", content: "Skills & Expertise - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsIndex,
});

const skills = [
  ["AI Research and Innovation", "/skills-expertise/ai-research-and-innovation"],
  ["Creative Skills", "/skills-expertise/creative-skills"],
  ["Technical Skills", "/skills-expertise/technical-skills"],
  ["SEO and Marketing", "/skills-expertise/seo-marketing"],
  ["Leadership and Project Management", "/contact-me"],
  ["Digital Business Establishment", "/businesses"],
];

function SkillsIndex() {
  return (
    <PageShell
      eyebrow="Skills"
      title="Skills & Expertise"
      description="The working stack behind my services: creative direction, engineering, marketing, AI research and business execution."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Skills & Expertise" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map(([title, href], index) => (
          <Link
            key={title}
            to={href as never}
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-black hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
          >
            <span className="text-xs font-mono text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-5 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Read the detailed page and see how this skill is applied in actual work.
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
