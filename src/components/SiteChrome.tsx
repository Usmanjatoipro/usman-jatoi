import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ChevronRight, Menu, X } from "lucide-react";

import homeHeadRaw from "../data/homeHead.html?raw";

/* ---------------------------------------------------------------- */
/*  Head-asset injection — needed only for the homepage Elementor    */
/*  body content. Header/footer no longer depend on it.              */
/* ---------------------------------------------------------------- */

function localizeUsmanAssets(value: string) {
  return value
    .replace(
      /https:\/\/usmanjatoi\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\s"'(),<>]+)/g,
      (_m, fileName: string) => `/site-assets/${fileName.replace(/&amp;/g, "&")}`,
    )
    .replace(/https:\/\/usmanjatoi\.com\//g, "/");
}

const HEAD_JUNK_PATTERNS = [
  /woocommerce/i,
  /\bwc-/i,
  /tutor-/i,
  /wbb-/i,
  /saboxplugin|sabox-/i,
  /wp-emoji/i,
  /wp-img-auto-sizes/i,
  /mystickyelements/i,
  /intl-tel-input|intlTelInput/i,
  /googleidentityservice/i,
  /photoswipe/i,
  /flexslider/i,
  /order-attribution/i,
  /ekit-widget-styles|widget-styles\.css/i,
  /eael-general|general\.min\.css/i,
];

function injectHomeHeadAssets() {
  if (typeof document === "undefined") return;
  if (document.getElementById("usman-chrome-head")) return;
  const container = document.createElement("div");
  container.id = "usman-chrome-head";
  container.style.display = "none";
  container.innerHTML = localizeUsmanAssets(homeHeadRaw)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
  Array.from(container.querySelectorAll("link, style")).forEach((node) => {
    if (HEAD_JUNK_PATTERNS.some((rx) => rx.test(node.outerHTML))) return;
    document.head.appendChild(node);
  });
  document.head.appendChild(container);
}
injectHomeHeadAssets();

/* ---------------------------------------------------------------- */
/*  SPA link interception                                            */
/* ---------------------------------------------------------------- */

function useSpaLinkIntercept() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (anchor.target && anchor.target !== "_self") return;
      e.preventDefault();
      const to = url.pathname.replace(/\/$/, "") || "/";
      router.navigate({ to: (to + url.search + url.hash) as any });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
}

/* ---------------------------------------------------------------- */
/*  Data                                                             */
/* ---------------------------------------------------------------- */

const PRIMARY_NAV: { label: string; href: string }[] = [
  { label: "About Me", href: "/about-me" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Skills & Expertise", href: "/skills-expertise" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Shop", href: "/shop" },
  { label: "Courses", href: "/courses" },
  { label: "My Lifestyle", href: "/my-lifestyle" },
  { label: "Contact Me", href: "/contact-me" },
];

const FOOTER_COLUMNS: { title: string; href?: string; links: { label: string; href: string }[] }[] = [
  {
    title: "About Me",
    href: "/about-me",
    links: [
      { label: "My Journey", href: "/about-me/my-journey" },
      { label: "Vision & Values", href: "/about-me/vision-values" },
      { label: "Personal Life", href: "/about-me/personal-life" },
      { label: "Social Media", href: "/about-me/social-media" },
    ],
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    links: [
      { label: "Brands & Businesses", href: "/portfolio/brands-businesses" },
      { label: "Websites", href: "/portfolio/websites" },
      { label: "Creative Projects", href: "/portfolio/creative-projects" },
    ],
  },
  {
    title: "My Services",
    href: "/services",
    links: [
      { label: "AI Automation", href: "/services/ai" },
      { label: "Bulk Publishing", href: "/services/bulk-publishing" },
      { label: "Creative Projects", href: "/services/creative" },
      { label: "Marketing", href: "/services/marketing" },
      { label: "Website Design & Dev", href: "/services/web" },
      { label: "View More →", href: "/services" },
    ],
  },
  {
    title: "Skills & Expertise",
    href: "/skills-expertise",
    links: [
      { label: "AI Research and Innovation", href: "/skills-expertise/ai-research-and-innovation" },
      { label: "Creative Skills", href: "/skills-expertise/creative-skills" },
      { label: "Technical Skills", href: "/skills-expertise/technical-skills" },
      { label: "SEO & Marketing", href: "/skills-expertise/seo-marketing" },
    ],
  },
  {
    title: "My Lifestyle",
    href: "/my-lifestyle",
    links: [
      { label: "Gaming Life", href: "/portfolio/gaming-life" },
      { label: "Fitness & Health", href: "/my-lifestyle/fitness-health" },
      { label: "Hobbies", href: "/my-lifestyle/hobbies" },
    ],
  },
  {
    title: "Trust and Proof",
    href: "/trust",
    links: [
      { label: "Certifications", href: "/certifications" },
      { label: "Awards", href: "/awards" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "White Label Partnership", href: "/white-label-partnership" },
      { label: "Press Release", href: "/press-release" },
    ],
  },
  {
    title: "Contact Me",
    href: "/contact-me",
    links: [
      { label: "Info@usmanjatoi.com", href: "mailto:Info@usmanjatoi.com" },
      { label: "Reach Out", href: "/contact-me" },
      { label: "Let’s Collaborate", href: "/contact-me" },
    ],
  },
  {
    title: "Others",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Business I Own", href: "/businesses" },
      { label: "Changelog", href: "/log" },
      { label: "Careers", href: "/careers" },
      { label: "Legal", href: "/legal" },
      { label: "Media Kits", href: "/media-kit" },
    ],
  },
];

const SOCIAL_LINKS: { label: string; href: string; icon: string }[] = [
  { label: "Google", href: "https://www.google.com/search?q=Usman+Jatoi&kgmid=/g/11h5pc9x4d", icon: "fab fa-google" },
  { label: "Instagram", href: "https://www.instagram.com/usmanjatoipro/", icon: "fab fa-instagram" },
  { label: "Facebook", href: "https://www.facebook.com/Muhd.Usman418/", icon: "fab fa-facebook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/usman-jatoi-pro/", icon: "fab fa-linkedin-in" },
  { label: "X", href: "https://twitter.com/UsmanJatoiPro", icon: "fab fa-x-twitter" },
  { label: "Pinterest", href: "https://www.pinterest.com/usmanjatoipro/", icon: "fab fa-pinterest" },
  { label: "Reddit", href: "https://www.reddit.com/user/usmanjatoipro/", icon: "fab fa-reddit" },
  { label: "GitHub", href: "https://github.com/Usmanjatoipro", icon: "fab fa-github" },
  { label: "Medium", href: "https://medium.com/@usmanjatoipro", icon: "fab fa-medium" },
  { label: "Vimeo", href: "https://vimeo.com/usmanjatoipro", icon: "fab fa-vimeo" },
  { label: "WhatsApp", href: "https://web.whatsapp.com/send?phone=+1(209)7766324", icon: "fab fa-whatsapp" },
];

/* ---------------------------------------------------------------- */
/*  Header                                                           */
/* ---------------------------------------------------------------- */

function useScroll() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { scrolled, progress };
}

export function SiteHeader() {
  useSpaLinkIntercept();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, progress } = useScroll();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,color] duration-500 ${
          scrolled
            ? "bg-white/85 text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-lg"
            : "bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
              scrolled ? "border-black/10 hover:bg-black/5" : "border-white/25 hover:bg-white/10"
            }`}
          >
            <Menu className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <a href="/" className="font-serif text-2xl tracking-tight md:text-[28px]" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Usman Jatoi
          </a>

          <a
            href="/contact-me"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition ${
              scrolled
                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                : "border border-white/40 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Let’s Talk <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {/* Scroll progress bar */}
        <div className="h-[3px] w-full bg-black/10">
          <div
            className="h-full transition-[width] duration-150"
            style={{
              width: `${progress * 100}%`,
              backgroundImage:
                "linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#00c7be,#007aff,#5856d6,#af52de,#ff2d55)",
              backgroundSize: "200% 100%",
              animation: "chrome-rainbow 6s linear infinite",
            }}
          />
        </div>
      </header>

      <style>{`@keyframes chrome-rainbow{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-neutral-950 text-white transition-opacity duration-300 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 py-6 md:px-10">
          <div className="flex items-center justify-between">
            <a href="/" onClick={() => setMenuOpen(false)} className="font-serif text-2xl" style={{ fontFamily: '"DM Serif Display", serif' }}>
              Usman Jatoi
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          <nav className="mt-10 flex-1 overflow-y-auto">
            <ul className="divide-y divide-white/10">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between py-5 text-2xl font-light tracking-tight transition hover:pl-2 hover:text-amber-300 md:text-4xl"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:text-amber-300" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Spacer so page content doesn't sit under the fixed header */}
      <div aria-hidden className="h-[75px]" />
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Footer                                                           */
/* ---------------------------------------------------------------- */

export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      {/* Top: brand + big vertical menu */}
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:px-10 lg:gap-20">
        <div>
          <a
            href="/"
            className="font-serif text-4xl text-white md:text-5xl"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Usman Jatoi
          </a>
          <p className="mt-4 max-w-md text-base text-neutral-400">
            Digital entrepreneur and a full-stack digital expert.
          </p>

          <div className="mt-10 overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
            {PRIMARY_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between border-b border-white/5 bg-neutral-900 px-5 py-4 text-[15px] text-white transition last:border-b-0 hover:bg-neutral-800"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-amber-300" />
              </a>
            ))}
          </div>
        </div>

        {/* 4-column link grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
                {col.href ? (
                  <a href={col.href} className="hover:text-amber-300">
                    {col.title}
                  </a>
                ) : (
                  col.title
                )}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} className="text-neutral-400 transition hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="h-px w-full bg-white/10" />
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} Usman Jatoi Pro&nbsp;|&nbsp;Designed by{" "}
          <a href="http://redsglow.com/" target="_blank" rel="noopener" className="text-white hover:text-amber-300">
            Redsglow.com
          </a>
        </p>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-400">
          <li>
            <a href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </a>
          </li>
          <li>
            <a href="/legal/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/legal/our-terms" className="hover:text-white">
              Our Terms
            </a>
          </li>
        </ul>

        <ul className="flex flex-wrap items-center gap-2">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-300 transition hover:bg-white hover:text-neutral-950"
              >
                <i className={s.icon} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating sticky quick-nav pill (desktop only) */}
      <FloatingQuickNav />
    </footer>
  );
}

function FloatingQuickNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden justify-center transition-all duration-500 md:flex ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/90 px-2 py-2 shadow-2xl backdrop-blur-xl">
        <a href="/" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
          <img
            src="/site-assets/cropped-Imagee-Character-2-150x150.webp"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </a>
        {[
          { label: "Services", href: "/services" },
          { label: "About", href: "/about-me" },
          { label: "Portfolio", href: "/portfolio" },
          { label: "Contact", href: "/contact-me" },
        ].map((b) => (
          <a
            key={b.href}
            href={b.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white hover:text-neutral-950"
          >
            {b.label}
          </a>
        ))}
      </div>
    </div>
  );
}
