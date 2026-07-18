import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact-me")({
  head: () => ({
    meta: [
      { title: "Contact — Let's Collaborate | Usman Jatoi" },
      {
        name: "description",
        content:
          "Get in touch with Usman Jatoi for projects, partnerships, or collaborations. Reach out via email or the contact form.",
      },
      { property: "og:title", content: "Contact — Let's Collaborate | Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Reach out for projects, partnerships, or collaborations.",
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
    company: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.company) return; // honeypot
    setStatus("sending");
    setError(null);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      looking_for: form.looking_for,
      message: form.message.trim(),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", looking_for: OPTIONS[0], message: "", company: "" });
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ctGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .ct-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: ctGrad 8s ease infinite;
        }
        .ct-tag { display:inline-block; font-size:11px; letter-spacing:.12em; text-transform:uppercase;
          padding:4px 10px; border-radius:999px; background:#111; color:#fff; font-weight:600; }
        .ct-card { position:relative; border-radius:24px; background:#fff; padding:32px; }
        .ct-card::before {
          content:""; position:absolute; inset:0; padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: ctGrad 10s ease infinite; pointer-events:none;
        }
        .ct-input, .ct-textarea, .ct-select {
          width:100%; padding:14px 16px; border-radius:12px;
          border:1px solid #e5e5e5; background:#fafafa;
          font-size:15px; transition: border-color .2s, background .2s;
          font-family: inherit;
        }
        .ct-input:focus, .ct-textarea:focus, .ct-select:focus {
          outline: none; border-color:#111; background:#fff;
        }
        .ct-textarea { resize: vertical; min-height: 140px; }
        .ct-label { display:block; font-size:13px; font-weight:600; margin-bottom:8px; color:#333; }
        .ct-pill {
          position:relative; display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:14px 28px; border-radius:999px; background:#111; color:#fff;
          font-weight:600; font-size:15px; border:0; cursor:pointer; min-width: 180px;
        }
        .ct-pill::before {
          content:""; position:absolute; inset:0; padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: ctGrad 8s ease infinite; pointer-events:none;
        }
        .ct-pill[disabled] { opacity:.6; cursor:not-allowed; }
        .honey { position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }
      `}} />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 md:px-10 max-w-4xl mx-auto text-center">
        <span className="ct-tag mb-6">Contact</span>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          Reach out — let's <span className="ct-gradient-text">collaborate</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
          I'm always open to new ideas, partnerships, or opportunities. Whether you
          have a question, a project in mind, or just want to connect — feel free to
          get in touch.
        </p>
        <a
          href="mailto:info@usmanjatoi.com"
          className="inline-block mt-6 text-lg font-mono ct-gradient-text hover:underline underline-offset-4"
        >
          info@usmanjatoi.com
        </a>
      </section>

      {/* Form */}
      <section className="px-6 md:px-10 max-w-3xl mx-auto pb-32">
        <div className="ct-card">
          {status === "sent" ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-3xl font-bold mb-3">Message sent</h2>
              <p className="text-neutral-600 max-w-md mx-auto">
                Thanks for reaching out. I'll get back to you at your email within
                1–2 business days.
              </p>
              <button
                className="ct-pill mt-8"
                onClick={() => setStatus("idle")}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="honey"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                aria-hidden
              />

              <div>
                <label className="ct-label" htmlFor="name">Name</label>
                <input
                  id="name"
                  required
                  maxLength={200}
                  className="ct-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="ct-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={200}
                    className="ct-input"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ct-label" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={40}
                    className="ct-input"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="ct-label" htmlFor="looking_for">What are you looking for?</label>
                <select
                  id="looking_for"
                  className="ct-select"
                  value={form.looking_for}
                  onChange={(e) => setForm({ ...form, looking_for: e.target.value })}
                >
                  {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="ct-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  required
                  maxLength={5000}
                  className="ct-textarea"
                  placeholder="Please share more details about your project, question, or idea…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  Couldn't send: {error}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button type="submit" className="ct-pill" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message →"}
                </button>
                <p className="text-xs text-neutral-500">
                  I read every message personally. No spam, no lists.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
