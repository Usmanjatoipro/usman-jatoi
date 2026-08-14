import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CalEmbed from "@/components/CalEmbed";
import ServiceCover from "@/components/ServiceCover";
import silkDark from "@/assets/silk-dark.jpg.asset.json";
import contactImage from "@/assets/Usman-Jatoi-Contact-Us-image.webp.asset.json";
import redsglow from "@/assets/Redsglow-Banner.jpg.asset.json";

export type ServiceArticleData = {
  id?: number;
  slug: string;
  title: string;
  h1?: string | null;
  paragraphs?: string[];
  bullets?: string[];
  content?: string | null;
  excerpt?: string | null;
  post_date?: string | null;
  path?: string | null;
  fifu_image_url?: string | null;
};

export type ServiceChild = {
  title: string;
  href: string;
  excerpt?: string | null;
  featured_image?: string | null;
};

function displayDate(value?: string | null) {
  if (!value) return "Imported from WordPress";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Imported from WordPress";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ServiceArticle({
  service,
  children,
  childCount,
}: {
  service: ServiceArticleData;
  children: ServiceChild[];
  childCount: number;
}) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(60);
  const [contactState, setContactState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const title = service.h1 || service.title;
  const intro = service.paragraphs?.[0] || service.excerpt || "";
  const highlights = (service.bullets || []).filter(Boolean).slice(0, 6);
  const filteredChildren = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return children;
    return children.filter((child) =>
      `${child.title} ${child.excerpt || ""}`.toLowerCase().includes(needle),
    );
  }, [children, query]);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setContactState("sending");
    const { error } = await supabase.from("contact_submissions").insert({
      name: String(data.get("name") || "").trim() || "Anonymous",
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      looking_for: service.title,
      message: String(data.get("message") || "").trim(),
      source_path: typeof window !== "undefined" ? window.location.pathname : service.path,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    if (error) setContactState("error");
    else {
      setContactState("done");
      form.reset();
    }
  }

  return (
    <main className="bg-white text-neutral-950">
      <section
        className="relative overflow-hidden bg-neutral-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.94), rgba(0,0,0,.76), rgba(0,0,0,.42)), url(${silkDark.url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-[1.08fr_.92fr] lg:px-10">
          <div>
            <nav
              className="flex flex-wrap items-center gap-2 text-sm text-white/65"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-white">
                Services
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{service.title}</span>
            </nav>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[.2em] text-white/60">
              Usman Jatoi Services
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.04] md:text-6xl">
              {title}
            </h1>
            {intro && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{intro}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/call"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 p-[2px] font-semibold"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-white">
                  Book a free call <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <a
                href="#service-details"
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white hover:text-neutral-950"
              >
                Explore the service
              </a>
            </div>
          </div>

          <div className="border-l border-white/18 pl-0 lg:pl-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {(highlights.length
                ? highlights
                : [
                    "Clear scope before work begins",
                    "Direct communication with Usman",
                    "Responsive delivery and handover",
                    "Built for measurable outcomes",
                  ]
              ).map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-white/15 py-4 text-sm leading-6 text-white/85"
                >
                  <Check className="mt-1 h-4 w-4 flex-none" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-white/15 pt-6 text-sm">
              <div>
                <dt className="text-white/50">Published</dt>
                <dd className="mt-1 font-medium">{displayDate(service.post_date)}</dd>
              </div>
              <div>
                <dt className="text-white/50">Service pages</dt>
                <dd className="mt-1 font-medium">{childCount.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
        <ServiceCover title={service.title} kicker="Service overview" slug={service.slug} eager />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-neutral-500">
            Built around your goals
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
            A practical {service.title.toLowerCase()} partner from strategy to delivery
          </h2>
          {(service.paragraphs || []).slice(1, 4).map((paragraph) => (
            <p key={paragraph} className="mt-5 text-base leading-7 text-neutral-600">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 border-t border-neutral-200 pt-4">
              <ShieldCheck className="h-5 w-5 flex-none" />
              <span className="text-sm text-neutral-700">
                Transparent scope, milestones, and ownership
              </span>
            </div>
            <div className="flex gap-3 border-t border-neutral-200 pt-4">
              <Sparkles className="h-5 w-5 flex-none" />
              <span className="text-sm text-neutral-700">
                Custom work shaped around the imported service data
              </span>
            </div>
          </div>
        </div>
      </section>

      {service.content && (
        <section id="service-details" className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-neutral-500">
                Service details
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                Everything included, rendered from the original fields
              </h2>
            </div>
            <div
              className="service-content"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </section>
      )}

      {children.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-neutral-500">
                Full service catalogue
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
                Explore every {service.title} service
              </h2>
              <p className="mt-3 text-neutral-600">
                {childCount.toLocaleString()} imported child and specialist service pages.
              </p>
            </div>
            <label className="flex w-full max-w-sm items-center gap-2 border-b border-neutral-400 py-2 text-sm focus-within:border-neutral-950">
              <Search className="h-4 w-4 text-neutral-500" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(60);
                }}
                placeholder="Search services"
                className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
            </label>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChildren.slice(0, visibleCount).map((child, index) => (
              <a
                key={child.href}
                href={child.href}
                className="group block border-b border-neutral-200 pb-6"
              >
                <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                  {child.featured_image ? (
                    <img
                      src={child.featured_image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-neutral-950 text-sm text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  )}
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[.14em] text-neutral-500">
                  {service.title}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug group-hover:underline">
                  {child.title}
                </h3>
                {child.excerpt && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                    {child.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
          {filteredChildren.length === 0 && (
            <p className="py-16 text-center text-neutral-500">No services match “{query}”.</p>
          )}
          {visibleCount < filteredChildren.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 60)}
                className="rounded-full border border-neutral-950 px-6 py-3 text-sm font-semibold transition hover:bg-neutral-950 hover:text-white"
              >
                Show more services ({(filteredChildren.length - visibleCount).toLocaleString()}{" "}
                remaining)
              </button>
            </div>
          )}
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div
          className="relative min-h-[310px] overflow-hidden border border-neutral-200"
          style={{
            backgroundImage: `url(${redsglow.url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative max-w-xl p-8 md:p-12">
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              Need a larger team for this scope?
            </h2>
            <p className="mt-4 leading-7 text-neutral-800">
              Redsglow brings strategy, design, development, automation, and operations under one
              accountable team.
            </p>
            <a
              href="https://redsglow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Visit Redsglow <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <Calendar className="mx-auto h-8 w-8" />
          <h2 className="mt-4 text-center text-3xl font-semibold md:text-5xl">
            Book a call about {service.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
            Choose a 30-minute slot and bring your goals, constraints, or current setup.
          </p>
          <CalEmbed className="mt-10 overflow-hidden border border-neutral-200 bg-white" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="overflow-hidden bg-neutral-950 text-white md:grid md:grid-cols-2">
          <form onSubmit={submitContact} className="space-y-4 p-7 md:p-10">
            <h2 className="text-3xl font-semibold">Tell me what you want to build</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              className="w-full bg-white px-4 py-3 text-neutral-950 outline-none"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder={`Tell me about your ${service.title} project`}
              className="w-full resize-y bg-white px-4 py-3 text-neutral-950 outline-none"
            />
            <button
              disabled={contactState === "sending"}
              className="w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {contactState === "sending"
                ? "Sending..."
                : contactState === "done"
                  ? "Message sent"
                  : "Send enquiry"}
            </button>
            <p role="status" className="text-sm text-white/65">
              {contactState === "error"
                ? "The form could not submit. Email contact@usmanjatoi.com instead."
                : contactState === "done"
                  ? "Thanks. I will get back to you shortly."
                  : "Prefer email? contact@usmanjatoi.com"}
            </p>
          </form>
          <div className="relative min-h-[430px]">
            <img
              src={contactImage.url}
              alt="Usman Jatoi"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/55" />
            <div className="absolute bottom-0 p-8 md:p-10">
              <p className="max-w-md text-sm leading-7 text-white">
                I believe in collaborating with smart, diverse, and creative people, then giving
                them the clarity and room to do excellent work.
              </p>
              <p className="mt-4 font-semibold">Usman Jatoi</p>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .service-content { color:#262626; font-size:16px; line-height:1.75; }
        .service-content .migrated-field { border-top:1px solid #d4d4d4; padding:clamp(32px,5vw,64px) 0; }
        .service-content .migrated-field:first-child { border-top:0; padding-top:0; }
        .service-content h2,.service-content h3,.service-content h4 { color:#0a0a0a; letter-spacing:0; line-height:1.15; }
        .service-content h2 { margin:0 0 18px; font-size:clamp(28px,4vw,46px); font-weight:650; }
        .service-content h3 { margin:0 0 12px; font-size:clamp(20px,2vw,26px); font-weight:650; }
        .service-content p { margin:0 0 16px; color:#525252; }
        .service-content a { color:#111; text-decoration:underline; text-underline-offset:3px; }
        .service-content ul,.service-content ol { margin:16px 0; padding-left:22px; }
        .service-content li { margin:8px 0; }
        .service-content .migrated-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-top:26px; }
        .service-content .migrated-grid article { border:1px solid #d4d4d4; background:#fff; padding:22px; border-radius:8px; }
        .service-content .uj-steps { display:flex; gap:16px; overflow-x:auto; padding:4px 0 16px; scroll-snap-type:x mandatory; }
        .service-content .uj-steps article { flex:0 0 min(330px,86vw); scroll-snap-align:start; border:1px solid #262626; background:#111; color:#fff; padding:24px; border-radius:8px; }
        .service-content .uj-steps article h3,.service-content .uj-steps article p { color:#fff; }
        .service-content .uj-step-n { display:grid; width:32px; height:32px; place-items:center; margin-bottom:18px; border-radius:999px; background:#fff; color:#111; font-size:12px; font-weight:800; }
        .service-content details { border-bottom:1px solid #262626; padding:18px 0; }
        .service-content summary { cursor:pointer; list-style:none; display:flex; justify-content:space-between; gap:20px; color:#111; font-weight:650; }
        .service-content summary::-webkit-details-marker { display:none; }
        .service-content summary::after { content:"+"; font-size:22px; font-weight:400; }
        .service-content details[open] summary::after { content:"−"; }
        .service-content .migrated-table { overflow-x:auto; }
        .service-content table { min-width:680px; width:100%; border-collapse:collapse; }
        .service-content th,.service-content td { border:1px solid #d4d4d4; padding:12px; text-align:left; vertical-align:top; }
        .service-content th { background:#111; color:#fff; }
        .service-content img { max-width:100%; height:auto; }
        .service-content .service-video-frame { aspect-ratio:16/9; overflow:hidden; background:#000; }
        .service-content .service-video-frame iframe { width:100%; height:100%; border:0; }
        .service-content .wbb-flag-grid,.service-content .locations-grid,.service-content .industry-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
        .service-content .wbb-flag-card-link,.service-content .industry-card { display:block; border:1px solid #d4d4d4; padding:14px; text-decoration:none; background:#fff; }
        @media (max-width:640px) {
          .service-content .migrated-grid { grid-template-columns:1fr; }
        }
      `,
        }}
      />
    </main>
  );
}
