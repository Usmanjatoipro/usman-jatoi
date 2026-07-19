import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ChevronRight, Menu, X } from "lucide-react";

/* ---------------------------------------------------------------- */
/*  Chrome assets — native header/footer only need local icon fonts. */
/* ---------------------------------------------------------------- */

const CHROME_STYLESHEETS = [
  "/site-assets/fontawesome.min.css",
  "/site-assets/solid.min.css",
  "/site-assets/brands.min.css",
];

function injectChromeAssets() {
  if (typeof document === "undefined") return;
  if (document.getElementById("usman-chrome-assets")) return;
  const marker = document.createElement("meta");
  marker.id = "usman-chrome-assets";
  CHROME_STYLESHEETS.forEach((href) => {
    if (document.head.querySelector(`link[rel="stylesheet"][href="${CSS.escape(href)}"]`)) return;
    const clone = document.createElement("link");
    clone.rel = "stylesheet";
    clone.href = href;
    clone.dataset.usmanHeadAsset = "true";
    document.head.appendChild(clone);
  });
  document.head.appendChild(marker);
}
injectChromeAssets();

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
      <style>{`
        header.site-header, footer.site-footer {
          max-width: none !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        header.site-header, header.site-header a, header.site-header button { color: inherit; border-color: transparent; }
        header.site-header a { text-decoration: none; }
        header.site-header, header.site-header * { border-bottom-color: transparent !important; }
        footer.site-footer { color: rgb(212 212 212); background: #0a0a0a; }
        footer.site-footer a { color: inherit; text-decoration: none; }
        footer.site-footer a:hover { color: #fff; }
        footer.site-footer h4, footer.site-footer .footer-brand { color: #fff; }
        footer.site-footer input { color: #fff; background: transparent; }

      `}</style>

      <header
        className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,color] duration-500 ${
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
              className={`inline-flex items-center gap-2 rounded-full border py-1 pl-4 pr-1 text-sm font-medium transition ${
                scrolled
                  ? "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                  : "border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
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
    <footer className="site-footer bg-neutral-950 text-neutral-300">
      <div className="grid w-full gap-14 px-6 py-20 md:px-12 lg:grid-cols-[1.15fr_1fr_1fr_1fr] lg:gap-12">
        {/* Column 1: brand + primary nav pills */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
            Usman Jatoi
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
            Digital entrepreneur and a full-stack digital expert.
          </p>
          <ul className="mt-8 max-w-[260px] space-y-2.5">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-neutral-200 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columns 2-4: link groups */}
        {FOOTER_GROUPS.map((column, idx) => (
          <div key={idx} className="space-y-10">
            {column.map((group) => (
              <div key={group.title}>
                <h4 className="text-[15px] font-semibold tracking-tight text-white">
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

            {/* Newsletter under column 4 */}
            {idx === FOOTER_GROUPS.length - 1 && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-10 flex items-center gap-2 border-b border-white/15 pb-2 focus-within:border-white/40"
              >
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:text-amber-300"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full px-6 md:px-12">
        <div className="h-px w-full bg-white/10" />
      </div>

      {/* Bottom bar */}
      <div className="grid w-full grid-cols-1 items-center gap-6 px-6 py-8 md:grid-cols-3 md:px-12">
        <p className="text-sm text-neutral-400 md:justify-self-start">
          © {new Date().getFullYear()} Usman Jatoi Pro&nbsp;|&nbsp;Designed by{" "}
          <a href="http://redsglow.com/" target="_blank" rel="noopener" className="text-white hover:text-amber-300">
            Redsglow.com
          </a>
        </p>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-400 md:justify-self-center">
          <li><a href="/sitemap.xml" className="hover:text-white">Sitemap</a></li>
          <li><a href="/legal/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
          <li><a href="/legal/our-terms" className="hover:text-white">Our Terms</a></li>
        </ul>

        <ul className="flex flex-wrap items-center gap-1.5 md:justify-self-end">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-white hover:text-neutral-950"
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


