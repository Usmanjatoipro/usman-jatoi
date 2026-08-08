import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, ShieldCheck, Video } from "lucide-react";
import CalEmbed from "@/components/CalEmbed";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/call")({
  head: () => ({
    meta: [
      { title: "Book a Free 30-Minute Call | Usman Jatoi" },
      {
        name: "description",
        content:
          "Book a free 30-minute discovery call with Usman Jatoi to scope your web, AI, SEO or content project — no obligation, clear next steps.",
      },
      { property: "og:title", content: "Book a Free 30-Minute Call — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Pick a time that suits you. We map scope, timeline and budget together on a free 30-minute call.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/call" }],
  }),
  component: CallPage,
});

const perks = [
  { icon: Clock, t: "30 minutes", d: "Focused, on time, and no sales pressure." },
  { icon: Video, t: "Google Meet or Zoom", d: "Link is sent the moment you book." },
  { icon: ShieldCheck, t: "NDA on request", d: "Mutual NDA before anything sensitive." },
];

export default function CallPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Free 30-minute discovery call",
    provider: { "@type": "Person", name: "Usman Jatoi" },
    areaServed: "Worldwide",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "A free 30-minute discovery call to scope your web, AI, SEO or content project.",
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHero
        eyebrow="Booking"
        title="Book a free 30-minute call"
        description="Tell me what you're building. We'll map scope, timeline and budget together — then you decide."
        crumbs={[{ label: "Home", href: "/" }, { label: "Book a Call" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {perks.map((p) => (
            <div key={p.t} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <p.icon className="mb-3 h-7 w-7 text-[#FF6A00]" />
              <h2 className="text-lg font-bold">{p.t}</h2>
              <p className="mt-1 text-sm text-neutral-600">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-center gap-3">
            <Calendar className="h-7 w-7 text-[#FF6A00]" />
            <h2 className="text-3xl font-bold md:text-4xl">Pick your time</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-2">
            <CalEmbed />
          </div>
          <p className="mt-6 text-sm text-white/60">
            Prefer writing first?{" "}
            <Link to="/contact-me" className="text-[#FF6A00] hover:underline">
              Send me a message instead
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
