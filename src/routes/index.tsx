import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import homeBodyRaw from "../data/homeBody.html?raw";
import homeLinks from "../data/homeLinks.json";
import homeStylesRaw from "../data/homeStyles.css?raw";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const SITE_URL = "https://usman-connects-us.lovable.app";

function localizeUsmanAssets(value: string) {
  return value
    .replace(
      /https:\/\/usmanjatoi\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\s"'(),<>]+)/g,
      (_m, fileName: string) => `/site-assets/${fileName.replace(/&amp;/g, "&")}`,
    )
    .replace(/https:\/\/usmanjatoi\.com\//g, "/");
}

function stripScripts(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
}

const homeBody = stripScripts(localizeUsmanAssets(homeBodyRaw));
const homeStyles = localizeUsmanAssets(homeStylesRaw)
  .replace(/\.elementor-kit-14\b/g, ".usman-native-home")
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
    const root = document.documentElement;

    // ==================== SAY / image / Hello scroll animation ====================
    const sayEl = document.querySelector<HTMLElement>(".elementor-element-7df0725");
    const imgEl = document.querySelector<HTMLElement>(".elementor-element-6fe2dfe");
    const helloEl = document.querySelector<HTMLElement>(".elementor-element-fdfdb77");
    const sayHelloContainer = document.querySelector<HTMLElement>(".elementor-element-968a77b");

    // Reset the inline styles set by Elementor's now-stripped JS
    if (sayEl) sayEl.style.transform = "translateX(0)";
    if (helloEl) helloEl.style.transform = "translateX(0)";
    if (imgEl) {
      imgEl.style.opacity = "0";
      imgEl.style.transform = "rotateZ(0deg) scale(0.6)";
      imgEl.style.transition = "none";
    }

    const animateSayHello = () => {
      if (!sayHelloContainer || !sayEl || !helloEl || !imgEl) return;
      const rect = sayHelloContainer.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when container's top is at bottom of viewport, 1 when its bottom passes the top
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = Math.min(1, Math.max(0, traveled / total));

      // Phase A (0.30 → 0.50): SAY & Hello split apart, image fades IN & scales up
      // Phase B (0.50 → 0.70): hold
      // Phase C (0.70 → 0.90): image fades OUT
      const splitP = Math.min(1, Math.max(0, (p - 0.3) / 0.2));
      const fadeInP = splitP;
      const fadeOutP = Math.min(1, Math.max(0, (p - 0.7) / 0.2));
      const opacity = Math.max(0, fadeInP - fadeOutP);
      const scale = 0.6 + splitP * 0.4;
      const rot = splitP * 10;

      sayEl.style.transform = `translateX(${splitP * 80}px)`;
      helloEl.style.transform = `translateX(${splitP * -35}px)`;
      imgEl.style.opacity = String(opacity);
      imgEl.style.transform = `rotateZ(${rot}deg) scale(${scale})`;
    };

    // ==================== Global scroll bar + theme progress ====================
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const h = Math.max(window.innerHeight * 1.1, 1);
      const raw = Math.min(1, Math.max(0, y / h));
      const eased = raw * raw * (3 - 2 * raw);
      root.style.setProperty("--scroll-theme", eased.toFixed(4));
      const doc = document.documentElement;
      const max = Math.max(1, (doc.scrollHeight || 0) - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / max));
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      animateSayHello();
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // ==================== Tabs (Creative Work / Website Designs / etc.) ====================
    const tabWidgets = document.querySelectorAll<HTMLElement>(".elementor-widget-n-tabs");
    tabWidgets.forEach((widget) => {
      const buttons = widget.querySelectorAll<HTMLElement>(".e-n-tab-title");
      const panels = widget.querySelectorAll<HTMLElement>('[role="tabpanel"]');
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = btn.getAttribute("data-tab-index");
          buttons.forEach((b) => {
            b.setAttribute("aria-selected", "false");
            b.setAttribute("tabindex", "-1");
          });
          btn.setAttribute("aria-selected", "true");
          btn.setAttribute("tabindex", "0");
          panels.forEach((panel) => {
            if (panel.getAttribute("data-tab-index") === idx) {
              panel.classList.add("e-active");
            } else {
              panel.classList.remove("e-active");
            }
          });
        });
      });
    });

    // ==================== Fix carousels: reset transforms, remove duplicates, wire arrows ====================
    const carousels = document.querySelectorAll<HTMLElement>(".elementor-widget-image-carousel");
    carousels.forEach((carousel) => {
      const wrapper = carousel.querySelector<HTMLElement>(".swiper-wrapper");
      const swiperEl = carousel.querySelector<HTMLElement>(".elementor-image-carousel-wrapper");
      if (!wrapper || !swiperEl) return;

      // Remove all duplicate slides — they were only there for Swiper's infinite loop
      wrapper.querySelectorAll(".swiper-slide-duplicate").forEach((d) => d.remove());
      // Reset inline transforms and per-slide inert/aria-hidden
      wrapper.style.transform = "none";
      wrapper.style.transition = "none";
      wrapper.style.display = "flex";
      wrapper.style.gap = "28px";
      wrapper.style.overflow = "visible";
      wrapper.querySelectorAll<HTMLElement>(".swiper-slide").forEach((slide) => {
        slide.removeAttribute("aria-hidden");
        slide.removeAttribute("inert");
        slide.style.marginRight = "0";
        slide.style.flex = "0 0 auto";
      });
      // Convert the outer swiper wrapper into a horizontal scroll container
      swiperEl.style.overflowX = "auto";
      swiperEl.style.overflowY = "hidden";
      swiperEl.style.scrollSnapType = "x mandatory";
      swiperEl.style.scrollBehavior = "smooth";
      wrapper.querySelectorAll<HTMLElement>(".swiper-slide").forEach((slide) => {
        slide.style.scrollSnapAlign = "start";
      });

      // Wire prev/next arrows
      const prev = carousel.querySelector<HTMLElement>(".elementor-swiper-button-prev");
      const next = carousel.querySelector<HTMLElement>(".elementor-swiper-button-next");
      const step = () => {
        const first = wrapper.querySelector<HTMLElement>(".swiper-slide");
        return (first?.offsetWidth || 320) + 28;
      };
      prev?.addEventListener("click", () => swiperEl.scrollBy({ left: -step(), behavior: "smooth" }));
      next?.addEventListener("click", () => swiperEl.scrollBy({ left: step(), behavior: "smooth" }));
    });

    // ==================== Promotional Ad YouTube embed ====================
    const promoHolder = document.querySelector<HTMLElement>(
      ".elementor-element-407d27a .elementor-video",
    );
    if (promoHolder && !promoHolder.querySelector("iframe")) {
      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube.com/embed/-3JGm2TNPds?autoplay=1&mute=1&loop=1&playlist=-3JGm2TNPds&controls=1&modestbranding=1&rel=0";
      iframe.title = "Website Designing Services Ad – Usman Jatoi";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "true");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.aspectRatio = "16 / 9";
      iframe.style.border = "0";
      iframe.style.display = "block";
      promoHolder.style.aspectRatio = "16 / 9";
      promoHolder.style.width = "100%";
      promoHolder.appendChild(iframe);
    }

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
      <div className="usman-scroll-progress" aria-hidden="true">
        <div className="usman-scroll-progress__fill" />
      </div>

      <style>{homeStyles}</style>
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

        /* ============ Header ============ */
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
        .usman-native-home .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
        .usman-native-home [data-settings*="animation"] { opacity: 1 !important; transform: none !important; }

        /* ============ SAY / image / Hello ============ */
        .usman-native-home .elementor-element-6fe2dfe {
          transition: opacity 200ms linear, transform 200ms linear !important;
          will-change: opacity, transform;
        }
        .usman-native-home .elementor-element-7df0725,
        .usman-native-home .elementor-element-fdfdb77 {
          transition: transform 200ms linear !important;
        }

        /* ============ Rainbow-border buttons ============ */
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
        @keyframes usmanRainbowBorder {
          0%   { background-position: 0% 0%, 0% 50%; }
          50%  { background-position: 0% 0%, 100% 50%; }
          100% { background-position: 0% 0%, 0% 50%; }
        }

        /* Newsletter/form submit */
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

        /* "Your Digital Partner" pill */
        .usman-native-home .elementor-element-a7b656e .elementor-button {
          background: transparent !important;
          background-image: none !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          animation: none !important;
          color: #fff !important;
          padding: 8px 22px !important;
        }
        .usman-native-home .elementor-element-a7b656e .elementor-button * {
          color: #fff !important;
          fill: #fff !important;
        }

        /* ============ Tabs — visible active state ============ */
        .usman-native-home .e-n-tabs-content > [role="tabpanel"] { display: none; }
        .usman-native-home .e-n-tabs-content > [role="tabpanel"].e-active { display: block; }
        .usman-native-home .e-n-tab-title { cursor: pointer; }
        .usman-native-home .e-n-tab-title[aria-selected="true"] {
          font-weight: 700;
          border-bottom: 2px solid currentColor;
        }

        /* ============ Carousel arrows visible & clickable ============ */
        .usman-native-home .elementor-swiper-button {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 999px;
          background: rgba(0,0,0,0.65); color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          font-size: 20px;
        }
        .usman-native-home .elementor-swiper-button:hover { background: #000; }
        .usman-native-home .elementor-swiper-button-prev { left: 10px; }
        .usman-native-home .elementor-swiper-button-next { right: 10px; }
        .usman-native-home .elementor-swiper-button i { color: #fff; font-style: normal; }
        .usman-native-home .elementor-swiper-button i::before {
          content: "";
          display: inline-block;
          width: 12px; height: 12px;
          border-top: 3px solid #fff;
          border-right: 3px solid #fff;
        }
        .usman-native-home .elementor-swiper-button-prev i::before { transform: rotate(-135deg); margin-left: 4px; }
        .usman-native-home .elementor-swiper-button-next i::before { transform: rotate(45deg); margin-right: 4px; }
        .usman-native-home .elementor-image-carousel-wrapper { position: relative; }
        .usman-native-home .elementor-image-carousel-wrapper::-webkit-scrollbar { display: none; }
        .usman-native-home .swiper-slide { min-width: 280px; }
        .usman-native-home .swiper-slide-image { width: 100%; height: auto; display: block; }

        /* ============ Skills & Expertise — use native icon rendering ============ */
        /* (Icon fonts eicons + elementskit are hosted locally in /public/fonts,
           so icons render natively without gradient-circle fallbacks.) */


        /* ============ My Impact — restore proper colors (dark on white) ============ */
        /* Section wrapper background stays with body theme */
        .usman-native-home .elementor-element-3359bcc {
          background: transparent !important;
        }
        /* Outer heading "My Impact / in Numbers" and intro paragraph — dark on scrolled-white bg */
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-element-92ce4e6 h1,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-element-92ce4e6 h2,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-element-92ce4e6 h3,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-element-92ce4e6 p,
        .usman-native-home .elementor-element-3359bcc > .e-con-inner > .elementor-element-92ce4e6 span {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        /* Small cards inside impact grid — dark text */
        .usman-native-home .impact-section-v3 .impact-small-card-grid-v3 .metric-value,
        .usman-native-home .impact-section-v3 .impact-small-card-grid-v3 .metric-title,
        .usman-native-home .impact-section-v3 .impact-small-card-grid-v3 .metric-description,
        .usman-native-home .impact-section-v3 .impact-small-card-grid-v3 .card-icon-wrapper i {
          color: #1D1D1F !important;
          -webkit-text-fill-color: #1D1D1F !important;
        }
        /* Large card (with image bg) — keep white */
        .usman-native-home .impact-section-v3 .large-card .metric-value,
        .usman-native-home .impact-section-v3 .large-card .metric-title,
        .usman-native-home .impact-section-v3 .large-card .metric-description {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        /* ============ The Good Stuff — section white bg, cards dark bg ============ */
        .usman-native-home .elementor-element-d15c148 {
          background: #ffffff !important;
        }
        /* Section heading ("The Good Stuff") stays dark on white */
        .usman-native-home .elementor-element-d15c148 > .e-con-inner > .elementor-element:first-child h1,
        .usman-native-home .elementor-element-d15c148 > .e-con-inner > .elementor-element:first-child h2,
        .usman-native-home .elementor-element-d15c148 > .e-con-inner > .elementor-element:first-child h3 {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        /* Card titles/text on dark card backgrounds — force white */
        .usman-native-home .elementor-element-d15c148 .elementor-widget-heading h1,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-heading h2,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-heading h3,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-heading h4,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-heading .elementor-heading-title,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-text-editor,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-text-editor p,
        .usman-native-home .elementor-element-d15c148 .elementor-widget-text-editor span {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }
        /* But the very first (section title) widget-heading is dark - handled above */
        .usman-native-home .elementor-element-d15c148 > .e-con-inner > .elementor-element:first-child .elementor-heading-title {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
        }
        /* Buttons inside good-stuff cards — button text black (already black via .elementor-button rule) */
        .usman-native-home .elementor-element-d15c148 .elementor-button,
        .usman-native-home .elementor-element-d15c148 .elementor-button * {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
          fill: #111 !important;
        }

        /* Marquee roles strip */
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

        /* ============ Header "Let's Talk" pill ============ */
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
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"]::before {
          content: "Let's Talk";
          color: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff) !important;
          font-size: 15px;
        }
        .usman-native-home header.elementor-location-header a[href*="/contact-me/"]::after {
          content: "✦";
          margin-left: 10px;
          color: color-mix(in oklab, #0a0a0e calc(var(--scroll-theme) * 100%), #ffffff) !important;
        }
      `}</style>

      <div
        className="usman-native-home"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: homeBody }}
      />
    </>
  );
}
