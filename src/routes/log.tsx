import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Changelog - The Journey of UsmanJatoi.com" },
      {
        name: "description",
        content:
          "A living log of milestones, launches and behind-the-scenes moments from Usman Jatoi.",
      },
      { property: "og:title", content: "Changelog - Usman Jatoi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogPage,
});

const entries = [
  {
    date: "Dec 2, 2024",
    title: "The domain became real",
    image: "/site-assets/usmanjatoi.com-domain-1024x331.webp",
    body:
      "UsmanJatoi.com started as a personal space beside agency work, then became the archive for projects, services, experiments and public learning.",
  },
];

function LogPage() {
  return (
    <PageShell
      eyebrow="Others"
      title="Changelog"
      description="A living record of what changed, what shipped and what happened behind the site."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Changelog" }]}
    >
      <div className="relative border-l border-neutral-200 pl-6">
        {entries.map((entry) => (
          <article key={entry.title} className="relative pb-10">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-black" />
            <time className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {entry.date}
            </time>
            <h2 className="mt-2 text-2xl font-semibold">{entry.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">{entry.body}</p>
            <img
              src={entry.image}
              alt={entry.title}
              className="mt-5 rounded-lg border border-neutral-200"
              loading="lazy"
            />
          </article>
        ))}
      </div>
      <Link
        to="/contact-me"
        className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Share an update
      </Link>
    </PageShell>
  );
}
