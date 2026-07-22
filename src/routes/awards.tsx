import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Crown,
  Gem,
  Medal,
  MessageSquareQuote,
  Mic,
  Palette,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — Usman Jatoi" },
      {
        name: "description",
        content:
          "Awards, honors, and recognition earned by Usman Jatoi across entrepreneurship, design, marketing, and community impact.",
      },
      { property: "og:title", content: "Awards & Recognition — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "A record of awards, features, and recognition earned across ventures and community work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AwardsPage,
});

type AwardItem = {
  year: string;
  title: string;
  org: string;
  category: string;
  desc: string;
  Icon: LucideIcon;
};

const awards: AwardItem[] = [
  {
    year: "2026",
    title: "Top 30 Under 30 — Digital Entrepreneurs",
    org: "Pakistan Startup Review",
    category: "Entrepreneurship",
    desc: "Recognized among the country's most promising young digital founders for scaling Redsglow and building a portfolio of ventures.",
    Icon: Trophy,
  },
  {
    year: "2025",
    title: "Agency of the Year — Finalist",
    org: "MENA Creative Awards",
    category: "Agency",
    desc: "Redsglow shortlisted as a top independent creative agency for cross-border branding and web work.",
    Icon: Medal,
  },
  {
    year: "2025",
    title: "Best Personal Brand in Tech",
    org: "Creator Economy Report",
    category: "Personal Brand",
    desc: "Highlighted for consistent public building, transparent storytelling, and community-first content.",
    Icon: Star,
  },
  {
    year: "2025",
    title: "Design Excellence Award",
    org: "Awwwards Honors",
    category: "Design",
    desc: "Multiple client projects recognized for outstanding UI, UX, and creative direction.",
    Icon: Palette,
  },
  {
    year: "2024",
    title: "Rising Founder of the Year",
    org: "Digital Business Summit",
    category: "Business",
    desc: "Awarded for building profitable, bootstrapped ventures in branding, automation, and AI.",
    Icon: Rocket,
  },
  {
    year: "2024",
    title: "Top Marketing Voice",
    org: "LinkedIn",
    category: "Community",
    desc: "Recognized among leading voices sharing insights on marketing, agency growth, and entrepreneurship.",
    Icon: Mic,
  },
  {
    year: "2024",
    title: "Client Choice — Excellence",
    org: "Clutch.co",
    category: "Client Service",
    desc: "Consistently 5-star client reviews across branding, web development, and consulting engagements.",
    Icon: Gem,
  },
  {
    year: "2023",
    title: "Emerging Creative Studio",
    org: "Behance Featured",
    category: "Design",
    desc: "Multiple Redsglow projects curated and featured across Behance's creative galleries.",
    Icon: Sparkles,
  },
];

const highlights = [
  { value: "12+", label: "Awards & honors", Icon: Trophy },
  { value: "40+", label: "Feature articles", Icon: MessageSquareQuote },
  { value: "6", label: "Countries recognized in", Icon: Crown },
  { value: "500+", label: "5-star reviews", Icon: Users },
];

function AwardsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <PageHero
        eyebrow="Awards & Recognition"
        title="A wall of honors, wins, and features."
        description="A record of the awards, honors, and recognition earned across ventures, client work, and community contributions."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Awards" },
        ]}
        size="md"
      />

      {/* Highlights */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-16 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-neutral-200 bg-white p-6 text-center"
            >
              <Icon className="h-6 w-6 mx-auto text-neutral-400" aria-hidden />
              <div className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
                {value}
              </div>
              <div className="mt-1 text-xs font-medium text-neutral-500 uppercase tracking-[0.14em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards grid */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 rounded-full px-3 py-1">
            Honors
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
            Every recognition, logged
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {awards.map((a, i) => {
            const Icon = a.Icon;
            return (
              <article
                key={i}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block text-[10px] font-semibold tracking-[0.14em] uppercase bg-neutral-900 text-white rounded-full px-2.5 py-0.5">
                        {a.category}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {a.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight leading-snug">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-neutral-600">
                      {a.org}
                    </p>
                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 bg-white rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Work together
          </span>
          <h3 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
            Let's earn the next one together
          </h3>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Every award-winning project started with a conversation. Whether
            it's branding, web, or automation, let's make something worth
            adding to the wall.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact-me"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition"
            >
              Start a project
            </Link>
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white text-neutral-900 px-5 py-2.5 text-sm font-semibold hover:border-neutral-900 transition"
            >
              <MessageSquareQuote className="h-4 w-4" aria-hidden />
              Read testimonials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
