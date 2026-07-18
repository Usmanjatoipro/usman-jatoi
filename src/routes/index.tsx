import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

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

const homeBody = stripScripts(localizeUsmanAssets(homeBodyRaw));
const homeStyles = localizeUsmanAssets(homeStylesRaw);

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
    const prevClass = document.body.className;
    const prevMode = document.body.getAttribute("data-elementor-device-mode");
    document.documentElement.lang = "en-US";
    document.body.className = BODY_CLASS;
    document.body.setAttribute(
      "data-elementor-device-mode",
      window.innerWidth <= 767 ? "mobile" : window.innerWidth <= 1024 ? "tablet" : "desktop",
    );
    return () => {
      document.body.className = prevClass;
      if (prevMode) document.body.setAttribute("data-elementor-device-mode", prevMode);
      else document.body.removeAttribute("data-elementor-device-mode");
    };
  }, []);

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; min-height: 100%; background: #fff; }
        body { overflow-x: hidden; }
        .usman-native-home { width: 100%; min-height: 100vh; overflow-x: clip; }
        /* Reveal Elementor sections that were script-gated on the original site */
        .usman-native-home .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
        .usman-native-home [data-settings*="animation"] { opacity: 1 !important; transform: none !important; }

        /* Apply the hero's animated rainbow gradient border to EVERY button site-wide */
        .usman-native-home .elementor-button,
        .usman-native-home a.elementor-button-link,
        .usman-native-home button.elementor-button,
        .usman-native-home .wp-block-button__link,
        .usman-native-home .btn,
        .usman-native-home button[type="submit"] {
          position: relative;
          border: 1px solid transparent !important;
          border-radius: 120px !important;
          background-origin: border-box;
          background-clip: content-box, border-box;
          background-image:
            linear-gradient(#ffffff, #ffffff),
            linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #ff6ec4) !important;
          animation: usmanRainbowBorder 6s linear infinite;
          padding: 14px 34px !important;
          color: #111 !important;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }
        .usman-native-home .elementor-button *,
        .usman-native-home .wp-block-button__link *,
        .usman-native-home .btn * { color: #111 !important; fill: #111 !important; }

        /* Dark-section variant: keep readable on dark backgrounds */
        .usman-native-home [data-elementor-type="section"][style*="background"] .elementor-button,
        .usman-native-home .elementor-section[style*="background-color: rgb(0"] .elementor-button {
          --rb-inner: #0b0b0b;
          color: #fff !important;
        }
        .usman-native-home .elementor-button:hover,
        .usman-native-home .wp-block-button__link:hover,
        .usman-native-home .btn:hover {
          box-shadow: 0 10px 30px -10px rgba(120, 115, 245, 0.55);
          transform: translateY(-1px);
        }
        .usman-native-home .elementor-button .elementor-button-text { position: relative; z-index: 1; }

        @keyframes usmanRainbowBorder {
          0%   { background-image: linear-gradient(var(--rb-inner, #ffffff), var(--rb-inner, #ffffff)), linear-gradient(45deg,  #ff6ec4, #7873f5, #1fd1f9, #ff6ec4); }
          25%  { background-image: linear-gradient(var(--rb-inner, #ffffff), var(--rb-inner, #ffffff)), linear-gradient(135deg, #7873f5, #1fd1f9, #ff6ec4, #7873f5); }
          50%  { background-image: linear-gradient(var(--rb-inner, #ffffff), var(--rb-inner, #ffffff)), linear-gradient(225deg, #1fd1f9, #ff6ec4, #7873f5, #1fd1f9); }
          75%  { background-image: linear-gradient(var(--rb-inner, #ffffff), var(--rb-inner, #ffffff)), linear-gradient(315deg, #ff6ec4, #7873f5, #1fd1f9, #ff6ec4); }
          100% { background-image: linear-gradient(var(--rb-inner, #ffffff), var(--rb-inner, #ffffff)), linear-gradient(45deg,  #ff6ec4, #7873f5, #1fd1f9, #ff6ec4); }
        }
      `}</style>
      <style>{homeStyles}</style>

      <div
        className="usman-native-home"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: homeBody }}
      />
    </>
  );
}
