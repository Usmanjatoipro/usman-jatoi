import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact-me")({
  head: () => ({
    meta: [
      { title: "Contact - Let's Collaborate | Usman Jatoi" },
      {
        name: "description",
        content:
          "Get in touch with Usman Jatoi for projects, partnerships, or collaborations. Reach out via email or the contact form.",
      },
      { property: "og:title", content: "Contact - Let's Collaborate | Usman Jatoi" },
      {
        property: "og:description",
        content: "Reach out for projects, partnerships, or collaborations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const OPTIONS = [
  "Website Design",
  "Web Development",
  "Branding & Identity",
  "3D & Motion",
  "Automation / AI",
  "Chrome Extension",
  "Partnership",
  "Something else",
];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    looking_for: OPTIONS[0],
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function openMailFallback() {
    const subject = encodeURIComponent(`Website inquiry: ${form.looking_for}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        `Phone: ${form.phone.trim() || "-"}`,
        `Looking for: ${form.looking_for}`,
        "",
        form.message.trim(),
      ].join("\n"),
    );
    window.location.href = `mailto:contact@usmanjatoi.com?subject=${subject}&body=${body}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.company) return;
    setStatus("sending");

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      looking_for: form.looking_for,
      message: form.message.trim(),
      source_path: typeof window !== "undefined" ? window.location.pathname : "/contact-me",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    if (error) {
      openMailFallback();
      setStatus("sent");
      return;
    }

    setStatus("sent");
    setForm({ name: "", email: "", phone: "", looking_for: OPTIONS[0], message: "", company: "" });
  }

  return (
    <main className="bg-white text-neutral-950">
      <PageHero
        title="Contact Me"
        eyebrow="Contact"
        description="Tell me what you want to build, fix, automate, redesign, or grow."
        size="sm"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Me" }]}
      />

      <section className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg bg-neutral-950 text-white shadow-[0_24px_70px_rgba(15,23,42,.16)] md:grid-cols-[1fr_1.05fr]">
          <div className="p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/55">
              Contact
            </p>
            <h1 className="mt-5 max-w-md text-3xl font-semibold leading-tight md:text-5xl">
              Tell me what you want to build
            </h1>

            {status === "sent" ? (
              <div className="mt-8 rounded-md border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-semibold">Message sent</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Thanks for reaching out. I will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 w-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7 space-y-4">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-px w-px opacity-0"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  aria-hidden
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    required
                    maxLength={200}
                    className="min-h-12 w-full rounded-none border-0 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    className="min-h-12 w-full rounded-none border-0 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <input
                  name="phone"
                  type="tel"
                  maxLength={40}
                  className="min-h-12 w-full rounded-none border-0 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <select
                  name="looking_for"
                  className="min-h-12 w-full rounded-none border-0 bg-white px-4 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={form.looking_for}
                  onChange={(e) => setForm({ ...form, looking_for: e.target.value })}
                >
                  {OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <textarea
                  name="message"
                  required
                  maxLength={5000}
                  rows={7}
                  className="w-full resize-y rounded-none border-0 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell me about your AI project"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send enquiry"}
                </button>
                <p className="text-sm text-white/70">
                  Prefer email?{" "}
                  <a
                    className="font-medium text-white underline"
                    href="mailto:contact@usmanjatoi.com"
                  >
                    contact@usmanjatoi.com
                  </a>
                </p>
              </form>
            )}
          </div>

          <aside className="relative min-h-[420px] overflow-hidden md:min-h-[640px]">
            <img
              src="/site-assets/Usman-Jatoi-Contact-Us-image.webp"
              alt="Abstract creative contact artwork"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/70"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
              <p className="max-w-md text-sm font-medium leading-7 text-white drop-shadow">
                I believe in collaborating with smart, diverse, and creative people, then giving
                them the clarity and room to do excellent work.
              </p>
              <p className="mt-5 text-lg font-semibold">Usman Jatoi</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
