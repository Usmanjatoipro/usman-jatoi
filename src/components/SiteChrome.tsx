import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV: Array<{ label: string; to: string }> = [
  { label: "About", to: "/about-me" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
  { label: "Businesses", to: "/businesses" },
  { label: "Contact", to: "/contact-me" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled
          ? "border-b border-neutral-200 bg-white/85 backdrop-blur-md"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-7 w-7 rounded-lg bg-[linear-gradient(135deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de)]" />
          <span>Usman Jatoi</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
              activeProps={{ className: "bg-neutral-900 text-white hover:bg-neutral-900 hover:text-white" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact-me"
            className="ml-2 rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Start a project
          </Link>
        </nav>
        <button
          className="rounded-lg p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact-me"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white"
            >
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const FOOTER_COLS: Array<{ heading: string; links: Array<{ label: string; to: string }> }> = [
  {
    heading: "Explore",
    links: [
      { label: "About me", to: "/about-me" },
      { label: "Services", to: "/services" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Case studies", to: "/case-studies" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Businesses", to: "/businesses" },
      { label: "Skills & expertise", to: "/skills-expertise" },
      { label: "Certifications", to: "/certifications" },
      { label: "Awards", to: "/awards" },
      { label: "Testimonials", to: "/testimonials" },
    ],
  },
  {
    heading: "Press",
    links: [
      { label: "Media kit", to: "/media-kit" },
      { label: "Press release", to: "/press-release" },
      { label: "Changelog", to: "/log" },
      { label: "White-label", to: "/white-label-partnership" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Trust", to: "/trust" },
      { label: "Privacy", to: "/legal/privacy-policy" },
      { label: "Terms", to: "/legal/our-terms" },
      { label: "Contact", to: "/contact-me" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="inline-block h-7 w-7 rounded-lg bg-[linear-gradient(135deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de)]" />
              Usman Jatoi
            </Link>
            <p className="mt-3 text-sm text-neutral-400">
              Educator, entrepreneur & strategist — building working systems, not slogans.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {col.heading}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-neutral-300 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} Usman Jatoi. All rights reserved.</span>
          <span>
            Built with care. <Link to="/trust" className="hover:text-white">Trust & security</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
