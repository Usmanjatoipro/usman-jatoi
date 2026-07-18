import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import PortfolioTabs from "@/components/PortfolioTabs";
import SayHello from "@/components/SayHello";
import homeBodyRaw from "../data/homeBody.html?raw";
import homeLinks from "../data/homeLinks.json";
import homeStylesRaw from "../data/homeStyles.css?raw";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const SITE_URL = "https://usman-connects-us.lovable.app";
const BODY_CLASS =
  "home wp-singular page-template page-template-elementor_header_footer page page-id-86 wp-custom-logo wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor hello-elementor-default elementor-default elementor-template-full-width elementor-kit-14 elementor-page elementor-page-86";

function localizeUsmanAssets(value: string) {
  return value
    .replace(
      /https:\/\/usmanjatoi\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\s"'(),<>]+)/g,
      (_m, fileName: string) => `/site-assets/${fileName.replace(/&amp;/g, "&")}`,
    )
    .replace(/https:\/\/usmanjatoi\.com\//g, "/");
}

// Strip all <script> tags — we render as pure static markup.
// Also strip inline event handlers that might reference removed globals.
function stripScripts(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
}

const homeBodyProcessed = stripScripts(localizeUsmanAssets(homeBodyRaw));
function splitOn(html: string, marker: string): [string, string] {
  const i = html.indexOf(marker);
  return i === -1 ? [html, ""] : [html.slice(0, i), html.slice(i + marker.length)];
}
const [homeBodyBeforePortfolio, homeBodyAfter] = splitOn(homeBodyProcessed, "<!--PORTFOLIO_TABS-->");
const [homeBodyBefore, homeBodyBetween] = splitOn(homeBodyBeforePortfolio, "<!--SAY_HELLO-->");
// Re-scope the Elementor "kit" (body-class) selectors onto our wrapper class so
// all styles apply on first paint — no FOUC waiting for a body class from JS.
const homeStyles = localizeUsmanAssets(homeStylesRaw)
  .replace(/\.elementor-kit-14\b/g, ".usman-native-home")
  // Neutralize Elementor's lazy-load guard that strips background-image from
  // 4th+ .e-parent containers until JS marks them .e-lazyloaded. We stripped
  // all scripts, so this guard would permanently hide gradient borders on our
  // rainbow-border buttons in later sections. Point the selector at a class
  // that never exists so the rule never matches.
  .replace(/:not\(\.e-lazyloaded\):not\(\.e-no-lazyload\)/g, ".__lovable-never-match");

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      ...homeLinks.map((link) => ({ ...link })),
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Usman Jatoi",
          url: SITE_URL,
          jobTitle: "Full-Stack Digital Expert & Entrepreneur",
          sameAs: [
            "https://www.youtube.com/@UsmanJatoi",
            "https://www.instagram.com/usmanjatoi/",
          ],
        }),
      },
    ],
  }),
});

function Home() {
  useEffect(() => {
    const prevLang = document.documentElement.lang;
    document.documentElement.lang = "en-US";

    // Smooth hero -> white theme transition tied to scroll.
    // We interpolate a CSS var (--scroll-theme: 0..1) over the first viewport.
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const h = Math.max(window.innerHeight * 1.1, 1);
      const raw = Math.min(1, Math.max(0, y / h));
      const eased = raw * raw * (3 - 2 * raw);
      root.style.setProperty("--scroll-theme", eased.toFixed(4));
      // Full-page scroll progress for the top gradient bar (0..1)
      const doc = document.documentElement;
      const max = Math.max(1, (doc.scrollHeight || 0) - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / max));
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      document.documentElement.lang = prevLang;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty("--scroll-theme");
    };
  }, []);

  return (
    <>
      {/* Top gradient scroll progress bar */}
      <div className="usman-scroll-progress" aria-hidden="true">
        <div className="usman-scroll-progress__fill" />
      </div>

      {/* Elementor kit styles first (re-scoped to .usman-native-home) */}
      <style>{homeStyles}</style>
      {/* Our overrides last so they win the cascade */}
      <style>{`
        html, body, #root { margin: 0; padding: 0; min-height: 100%; }
        :root { --scroll-theme: 0; --scroll-progress: 0; }

        /* ============ Top gradient scroll progress bar ============ */
        .usman-scroll-progress {
          position: fixed; top: 0; left: 0; right: 0;
          height: 4px;
          background: color-mix(in oklab, #ffffff calc(var(--scroll-theme) * 100%), #000000);
          z-index: 100000;
          pointer-events: none;
          transition: background-color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .usman-scroll-progress__fill {
          height: 100%;
          width: calc(var(--scroll-progress) * 100%);
          background: linear-gradient(90deg, #ff6ec4, #7873f5, #1fd1f9, #ff6ec4);
          background-size: 300% 100%;
          animation: usmanRainbowBorder 6s linear infinite;
          box-shadow: 0 0 12px rgba(120, 115, 245, 0.55);
          transition: width 120ms linear;
        }

        /* ============ Header: dark theme first, converts to white on scroll ============ */
        .usman-native-home header.elementor-location-header,
        .usman-native-home header.elementor-location-header .elementor-sticky--active,
        .usman-native-home header.elementor-location-header .elementor-sticky--effects {
          position: fixed !important;
          top: 4px; left: 0; right: 0;
          width: 100% !important;
          z-index: 99999 !important;
          background-color: color-mix(in oklab, rgba(255,255,255,0.92) calc(var(--scroll-theme) * 100%), transparent) !important;
          backdrop-filter: saturate(140%) blur(calc(var(--scroll-theme) * 14px));
          -webkit-backdrop-filter: saturate(140%) blur(calc(var(--scroll-theme) * 14px));
          box-shadow: none !important;
          border: 0 !important;
          transition: background-color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Kill any bottom gradient/border/divider Elementor might draw under the header */
        .usman-native-home header.elementor-location-header::before,
        .usman-native-home header.elementor-location-header::after,
        .usman-native-home header.elementor-location-header > *::before,
        .usman-native-home header.elementor-location-header > *::after {
          background-image: none !important;
          border: 0 !important;
        }
        .usman-native-home header.elementor-location-header .elementor-shape,
        .usman-native-home header.elementor-location-header .elementor-shape-bottom,
        .usman-native-home header.elementor-location-header .elementor-shape-top { display: none !important; }

        /* Reserve space so content isn't hidden under the fixed header */
        .usman-native-home { padding-top: 84px; }
        .usman-native-home header.elementor-location-header a,
        .usman-native-home header.elementor-location-header .elementor-nav-menu a,
        .usman-native-home header.elementor-location-header .elementor-item,
        .usman-native-home header.elementor-location-header .elementor-heading-title,
        .usman-native-home header.elementor-location-header p,
        .usman-native-home header.elementor-location-header span {
          color: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff) !important;
          transition: color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .usman-native-home header.elementor-location-header svg,
        .usman-native-home header.elementor-location-header svg * {
          fill: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff);
          stroke: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff);
          transition: fill 500ms cubic-bezier(0.22, 1, 0.36, 1), stroke 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Interpolate hero dark -> soft white based on scroll progress (eased) */
        html, body {
          background:
            radial-gradient(1200px 600px at 50% -10%,
              color-mix(in oklab, #7873f5 calc((1 - var(--scroll-theme)) * 22%), transparent) 0%,
              transparent 60%),
            color-mix(in oklab, #ffffff calc(var(--scroll-theme) * 100%), #06060a) !important;
          color: color-mix(in oklab, #111111 calc(var(--scroll-theme) * 100%), #ffffff);
          transition: background-color 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        body { overflow-x: hidden; }
        .usman-native-home { width: 100%; min-height: 100vh; overflow-x: clip; background: transparent; }
        /* Reveal Elementor sections that were script-gated on the original site */
        .usman-native-home .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
        .usman-native-home [data-settings*="animation"] { opacity: 1 !important; transform: none !important; }

        /* ============ Elementor container gutters (missing from extracted CSS) ============ */
        /* Constrain every top-level section itself, not just its inner wrapper.
           This makes children naturally flow inside the 1280 box. */
        .usman-native-home { padding-inline: clamp(20px, 5vw, 60px); box-sizing: border-box; overflow-x: hidden; }
        .usman-native-home .elementor { max-width: var(--container-max-width, 1280px); margin-inline: auto; }
        .usman-native-home .e-con { box-sizing: border-box; }
        /* Reset any inner wrapper — it now sits inside a padded parent, no extra padding needed */
        .usman-native-home .e-con-inner {
          max-width: 100% !important;
          width: 100% !important;
          margin-inline: auto !important;
          padding-inline: 0 !important;
          box-sizing: border-box !important;
        }







        /* Animated gradient-border button — WHITE fill, gradient border only */
        .usman-native-home .elementor-button,
        .usman-native-home a.elementor-button-link,
        .usman-native-home button.elementor-button,
        .usman-native-home .wp-block-button__link,
        .usman-native-home .btn,
        .usman-native-home button[type="submit"] {
          position: relative;
          border: 3px solid transparent !important;
          border-radius: 999px !important;
          background-color: transparent !important;
          background-origin: border-box !important;
          background-clip: padding-box, border-box !important;
          background-image:
            linear-gradient(#ffffff, #ffffff),
            linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #ff6ec4) !important;
          background-size: auto, 300% 300% !important;
          animation: usmanRainbowBorder 6s linear infinite;
          padding: 14px 34px !important;
          color: #111 !important;
          box-shadow: none !important;
          text-shadow: none !important;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }
        .usman-native-home .elementor-button *,
        .usman-native-home .wp-block-button__link *,
        .usman-native-home .btn * { color: #111 !important; fill: #111 !important; text-shadow: none !important; }

        .usman-native-home .elementor-button:hover,
        .usman-native-home .wp-block-button__link:hover,
        .usman-native-home .btn:hover {
          box-shadow: 0 10px 30px -10px rgba(120, 115, 245, 0.55) !important;
          transform: translateY(-1px);
        }
        .usman-native-home .elementor-button .elementor-button-text { position: relative; z-index: 1; color: #111 !important; }

        @keyframes usmanRainbowBorder {
          0%   { background-position: 0% 0%, 0% 50%; }
          50%  { background-position: 0% 0%, 100% 50%; }
          100% { background-position: 0% 0%, 0% 50%; }
        }

        /* Newsletter/form submit — keep as plain text label, no gradient pill */
        .usman-native-home .elementor-widget-form .elementor-button,
        .usman-native-home form button[type="submit"] {
          background: transparent !important;
          background-image: none !important;
          border: none !important;
          border-radius: 0 !important;
          animation: none !important;
          padding: 8px 4px !important;
          color: #fff !important;
          box-shadow: none !important;
          letter-spacing: 0.08em;
          font-weight: 700;
        }
        .usman-native-home .elementor-widget-form .elementor-button *,
        .usman-native-home form button[type="submit"] * {
          color: #fff !important;
          fill: #fff !important;
        }
        .usman-native-home .elementor-widget-form .elementor-button:hover,
        .usman-native-home form button[type="submit"]:hover {
          box-shadow: none !important;
          transform: none !important;
          opacity: 0.85;
        }

        /* "Your Digital Partner" pill — keep it as a plain label, not a button */
        .usman-native-home .elementor-element-a7b656e .elementor-button {
          background: transparent !important;
          background-image: none !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          animation: none !important;
          color: #fff !important;
          padding: 8px 22px !important;
          box-shadow: none !important;
        }
        .usman-native-home .elementor-element-a7b656e .elementor-button * {
          color: #fff !important;
          fill: #fff !important;
        }
        .usman-native-home .elementor-element-a7b656e .elementor-button:hover {
          box-shadow: none !important;
          transform: none !important;
        }



        /* "My Impact in Numbers" section — white background */
        .usman-native-home .elementor-element-3359bcc,
        .usman-native-home .elementor-element-3359bcc .impact-section-v3 {
          background: #ffffff !important;
          background-image: none !important;
        }
        /* Numeric cards: dark text on their light card bg */
        .usman-native-home .elementor-element-3359bcc .impact-card-v3 .card-content-v3,
        .usman-native-home .elementor-element-3359bcc .impact-card-v3 .card-content-v3 * {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        .usman-native-home .elementor-element-3359bcc .impact-card-v3 .metric-label,
        .usman-native-home .elementor-element-3359bcc .impact-card-v3 .metric-description {
          color: #555 !important;
          -webkit-text-fill-color: #555 !important;
        }
        /* Section heading + intro paragraph on white bg */
        .usman-native-home .elementor-element-3359bcc .impact-header-v3 h2,
        .usman-native-home .elementor-element-3359bcc .impact-header-v3 p,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-widget-heading .elementor-heading-title,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-widget-text-editor p {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        /* Feature card (with photo) keeps its dark overlay + white text */
        .usman-native-home .elementor-element-3359bcc .impact-card-v3.large-card .card-content-v3,
        .usman-native-home .elementor-element-3359bcc .impact-card-v3.large-card .card-content-v3 * {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        /* "The Good Stuff" section — white outer bg, section title dark */
        .usman-native-home .elementor-element-d15c148 {
          background: #ffffff !important;
        }
        .usman-native-home .elementor-element-d15c148 > .e-con-inner > .elementor-widget-heading .elementor-heading-title {
          color: #111 !important;
        }
        /* Cards inside stay dark — force white text on titles/paragraphs.
           Exclude anything inside .elementor-button so the gradient pill keeps dark label. */
        .usman-native-home .elementor-element-d15c148 .e-con.e-child .elementor-heading-title,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child h1,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child h2,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child h3,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child h4,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child p,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child li,
        .usman-native-home .elementor-element-d15c148 .e-con.e-child a:not(.elementor-button) {
          color: #ffffff !important;
        }
        /* Gradient-border pill buttons in this section: dark text + dark icon on white fill */
        .usman-native-home .elementor-element-d15c148 .elementor-button,
        .usman-native-home .elementor-element-d15c148 .elementor-button *,
        .usman-native-home .elementor-element-d15c148 .elementor-button .elementor-button-text {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        .usman-native-home .elementor-element-d15c148 .elementor-button .elementor-button-icon svg,
        .usman-native-home .elementor-element-d15c148 .elementor-button .elementor-button-icon svg * {
          fill: #111 !important;
        }

        /* Marquee roles strip — always white bg with dark text */
        .usman-native-home .elementor-element-2b94d37,
        .usman-native-home .elementor-element-2b94d37 > .e-con-inner,
        .usman-native-home .elementor-element-c1e9d04,
        .usman-native-home .marquee-container {
          background: #ffffff !important;
          background-image: none !important;
        }
        .usman-native-home .elementor-element-2b94d37 { padding: 2rem 0 !important; }
        .usman-native-home .marquee-container,
        .usman-native-home .marquee,
        .usman-native-home .marquee span {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }

        /* ============ Recreated "Let's Talk" pill (theme-aware) ============ */
        /* Hide the raster LetTalk images (both white and dark variants) */
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"] img {
          display: none !important;
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"] {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          min-width: 150px;
          padding: 12px 26px !important;
          border-radius: 999px !important;
          border: 2px solid transparent !important;
          background-origin: border-box !important;
          background-clip: padding-box, border-box !important;
          background-image:
            linear-gradient(
              color-mix(in oklab, #ffffff calc(var(--scroll-theme) * 100%), #0a0a0e),
              color-mix(in oklab, #ffffff calc(var(--scroll-theme) * 100%), #0a0a0e)
            ),
            linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #ff6ec4) !important;
          background-size: auto, 300% 300% !important;
          animation: usmanRainbowBorder 6s linear infinite;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none !important;
          transition: background-image 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.25s ease, box-shadow 0.25s ease;
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"]::before {
          content: "Let's Talk";
          color: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff) !important;
          font-size: 15px;
          transition: color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"]::after {
          content: "✦";
          margin-left: 10px;
          color: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff) !important;
          transition: color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"]:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -12px rgba(120, 115, 245, 0.6);
        }
      `}</style>

      <style>{`
        /* ============ Portfolio Tabs + Grid ============ */
        .pf-tabs {
          max-width: 1240px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          color: #0a0a0e;
          font-family: inherit;
          contain: layout paint;
        }
        .pf-tabs__nav {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 10px; margin-bottom: 18px;
        }
        .pf-tabs__tab {
          appearance: none; border: 0; cursor: pointer;
          padding: 11px 20px; border-radius: 999px;
          background: #fff; color: #0a0a0e;
          font: 600 14px/1 inherit; letter-spacing: 0.01em;
          box-shadow: inset 0 0 0 1px rgba(10,10,14,0.10);
          transition: transform .2s ease, box-shadow .2s ease, background .3s ease, color .3s ease;
        }
        .pf-tabs__tab:hover { box-shadow: inset 0 0 0 1px rgba(10,10,14,0.28); }
        .pf-tabs__tab.is-active {
          color: #fff;
          background: linear-gradient(120deg, #ff6a3d, #f74a8b 40%, #7873f5 70%, #22c1c3);
          background-size: 200% 200%;
          animation: pfGrad 6s linear infinite;
          box-shadow: 0 10px 24px -12px rgba(120,115,245,0.55);
        }
        @keyframes pfGrad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .pf-tabs__blurb {
          text-align: center; max-width: 640px; margin: 0 auto 32px;
          color: rgba(10,10,14,0.66); font-size: 15px; line-height: 1.5;
          animation: pfFadeUp 400ms ease-out both;
        }
        @keyframes pfFadeUp { from { opacity: 0; transform: translateY(6px);} to {opacity:1; transform:none;} }

        .pf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
          animation: pfFadeUp 400ms ease-out both;
        }
        .pf-card {
          margin: 0;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 0 rgba(10,10,14,0.05), 0 12px 28px -18px rgba(10,10,14,0.25);
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
          display: flex; flex-direction: column;
        }
        .pf-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 1px 0 rgba(10,10,14,0.05), 0 24px 44px -20px rgba(10,10,14,0.35);
        }
        .pf-card__media {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #f4f4f7;
        }
        .pf-card__media img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .6s cubic-bezier(.22,1,.36,1);
        }
        .pf-card:hover .pf-card__media img { transform: scale(1.05); }
        .pf-card__body {
          padding: 14px 16px 18px;
        }
        .pf-card__body strong {
          display: block; font-size: 15px; font-weight: 700;
          color: #0a0a0e; margin-bottom: 4px;
        }
        .pf-card__body span {
          display: block; font-size: 13px; line-height: 1.45;
          color: rgba(10,10,14,0.62);
        }

        @media (max-width: 640px) {
          .pf-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
          .pf-tabs__tab { padding: 9px 14px; font-size: 13px; }
        }
      `}</style>




      <div className="usman-native-home">
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: homeBodyBefore }}
        />
        <SayHello />
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: homeBodyBetween }}
        />
        <PortfolioTabs />
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: homeBodyAfter }}
        />
      </div>
    </>
  );
}
