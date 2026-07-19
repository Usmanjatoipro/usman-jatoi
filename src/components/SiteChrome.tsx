import { useEffect, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

/* ============================================================
   Native black & premium chrome — no Elementor, no injected CSS.
   Helvetica everywhere, hairline gradient accents only.
   ============================================================ */

const PRIMARY_NAV = [
  { label: "Services", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "Businesses", to: "/businesses" },
  { label: "About", to: "/about-me" },
  { label: "Contact", to: "/contact-me" },
];

const FOOTER_COLS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: "Work",
    links: [
      { label: "Services", to: "/services" },
      { label: "White-Label", to: "/white-label-partnership" },
      { label: "Case Studies", to: "/case-studies" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Shop", to: "/shop" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Me", to: "/about-me" },
      { label: "Skills & Expertise", to: "/skills-expertise" },
      { label: "My Lifestyle", to: "/my-lifestyle" },
      { label: "Businesses", to: "/businesses" },
      { label: "Social Media", to: "/about-me/social-media" },
    ],
  },
  {
    title: "Proof",
    links: [
      { label: "Testimonials", to: "/testimonials" },
      { label: "Awards", to: "/awards" },
      { label: "Certifications", to: "/certifications" },
      { label: "Press Release", to: "/press-release" },
      { label: "Media Kit", to: "/media-kit" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Courses", to: "/courses" },
      { label: "Careers", to: "/careers" },
      { label: "Log", to: "/log" },
      { label: "Trust", to: "/trust" },
    ],
  },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      {/* Gradient scroll progress bar */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-black/40"
      >
        <div
          className="h-full origin-left"
          style={{
            width: `${progress * 100}%`,
            background: "var(--gradient-brand)",
          }}
        />
      </div>

      <header
        className={
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
          (scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/10"
            : isHome
              ? "bg-transparent"
              : "bg-background/60 backdrop-blur-md")
        }
        style={{ top: 2 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="group flex items-center gap-2">
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              Usman<span className="text-gradient">Jatoi</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                className="gradient-underline text-[13px] font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact-me"
              className="gradient-border hidden rounded-full px-5 py-2 text-[12px] font-semibold uppercase tracking-widest text-foreground transition-transform hover:scale-[1.02] lg:inline-flex"
            >
              Let's Talk
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-6 py-6">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to as any}
                  className="border-b border-white/5 py-3 text-sm font-medium text-foreground/85"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact-me"
                className="gradient-border mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest"
              >
                Let's Talk
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so content isn't hidden under fixed header (except on home hero) */}
      {!isHome && <div className="h-16" />}
    </>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t border-white/10 bg-background">
      {/* hairline gradient rule at top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--gradient-brand)" }}
      />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight">
              Usman<span className="text-gradient">Jatoi</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Top 0.1% full-stack digital expert & entrepreneur. Building brands,
              systems and businesses across the globe.
            </p>
            <Link
              to="/contact-me"
              className="gradient-border mt-8 inline-flex rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Start a project
            </Link>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to as any}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {year} Usman Jatoi. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/legal" className="hover:text-foreground">
              Legal
            </Link>
            <Link to="/trust" className="hover:text-foreground">
              Trust
            </Link>
            <Link to="/press-release" className="hover:text-foreground">
              Press
            </Link>
            <Link to="/careers" className="hover:text-foreground">
              Careers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
