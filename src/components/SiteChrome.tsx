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

const FOOTER_GROUPS: { title: string; href?: string; links: { label: string; href: string }[] }[][] = [
  // Column 2
  [
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
  ],
  // Column 3
  [
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
      links: [
        { label: "Certifications", href: "/certifications" },
        { label: "Awards", href: "/awards" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "White Label Partnership", href: "/white-label-partnership" },
        { label: "Press Release", href: "/press-release" },
      ],
    },
  ],
  // Column 4
  [
    {
      title: "Our Contacts",
      links: [{ label: "Info@usmanjatoi.com", href: "mailto:Info@usmanjatoi.com" }],
    },
    {
      title: "Contact Me",
      href: "/contact-me",
      links: [
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
  ],
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
        <div className="mx-auto grid h-[72px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 md:px-10">
          {/* Left: hamburger */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:opacity-70"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          {/* Center: brand */}
          <a
            href="/"
            className="text-[13px] font-medium uppercase tracking-[0.28em] md:text-sm"
          >
            Usman Jatoi
          </a>

          {/* Right: Let's Talk pill with avatars */}
          <div className="flex justify-end">
            <a
              href="/contact-me"
              className={`inline-flex items-center gap-2 rounded-full py-1 pl-4 pr-1 text-sm font-medium transition ${
                scrolled
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-white text-neutral-900 hover:bg-white/90"
              }`}
            >
              <span>Let’s Talk</span>
              <span className="flex -space-x-2">
                <img
                  src="/site-assets/Usman-Jatoi-Pro-252x300.webp"
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                />
                <img
                  src="/site-assets/Me-Playng-Usman-150x150.webp"
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                />
              </span>
            </a>
          </div>
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

    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Footer                                                           */
/* ---------------------------------------------------------------- */

export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-4 lg:gap-10">
        {/* Column 1: brand + pill nav */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
            Usman Jatoi
          </p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-400">
            Digital entrepreneur and a full-stack digital expert.
          </p>

          <div className="mt-8 space-y-3">
            {PRIMARY_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-md border border-white/10 px-4 py-3 text-sm text-white/90 transition hover:border-white/30 hover:bg-white/5"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Columns 2-4: link groups */}
        {FOOTER_GROUPS.map((column, idx) => (
          <div key={idx} className="space-y-10">
            {column.map((group) => (
              <div key={group.title}>
                <h4 className="text-[15px] font-medium text-white">
                  {group.href ? (
                    <a href={group.href} className="hover:text-amber-300">
                      {group.title}
                    </a>
                  ) : (
                    group.title
                  )}
                </h4>
                <ul className="mt-5 space-y-3 text-sm">
                  {group.links.map((link) => (
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
        ))}
      </div>

      {/* Center avatar + pill nav row */}
      <div className="mx-auto flex w-full max-w-[1440px] justify-center px-5 pb-8 md:px-10">
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Home" className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15">
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
              className="rounded-full border border-white/15 px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/85 transition hover:border-white/40 hover:bg-white hover:text-neutral-950"
            >
              {b.label}
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="h-px w-full bg-white/10" />
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

    </footer>
  );
}

