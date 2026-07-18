import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import homeBodyRaw from "../data/homeBody.html?raw";
import homeLinks from "../data/homeLinks.json";
import homeStylesRaw from "../data/homeStyles.css?raw";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const URL = "https://usman-connects-us.lovable.app";
const BODY_CLASS =
  "home wp-singular page-template page-template-elementor_header_footer page page-id-86 wp-custom-logo wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor tutor-lms woocommerce-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-14 elementor-page elementor-page-86 e--ua-blink e--ua-chrome e--ua-webkit";

declare global {
  interface Window {
    __usmanHomeScriptsLoaded?: boolean;
    elementorFrontend?: { init?: () => void };
    jQuery?: {
      (target?: unknown): {
        trigger?: (eventName: string) => void;
        ready?: (callback: () => void) => void;
      };
    };
  }
}

function localizeUsmanAssets(value: string) {
  return value
    .replace(
      /https:\/\/usmanjatoi\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^\s"'(),<>]+)/g,
      (_match, fileName: string) => `/site-assets/${fileName.replace(/&amp;/g, "&")}`,
    )
    .replace(/https:\/\/usmanjatoi\.com\//g, "/");
}

const homeBody = localizeUsmanAssets(homeBodyRaw);
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
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      ...homeLinks.map((link) => ({ ...link })),
      { rel: "canonical", href: URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Usman Jatoi",
          url: URL,
          jobTitle: "Full-Stack Digital Expert & Entrepreneur",
          sameAs: [
            "https://usmanjatoi.com/",
            "https://www.youtube.com/@UsmanJatoi",
            "https://www.instagram.com/usmanjatoi/",
          ],
        }),
      },
    ],
  }),
});

function Home() {
  useHomepageRuntime();

  return (
    <>
      <style>{homeStyles}</style>
      <style>{`
        html, body, #root { margin: 0; padding: 0; min-height: 100%; background: #000; }
        body { overflow-x: hidden; }
        #root { background: #fff; }
        .usman-native-home { width: 100%; min-height: 100vh; overflow-x: clip; }
        .usman-native-home script { display: none !important; }
      `}</style>
      <div
        className="usman-native-home"
        dangerouslySetInnerHTML={{ __html: homeBody }}
      />
    </>
  );
}

function useHomepageRuntime() {
  useEffect(() => {
    const previousBodyClass = document.body.className;
    const previousDeviceMode = document.body.getAttribute("data-elementor-device-mode");

    document.documentElement.lang = "en-US";
    document.body.className = BODY_CLASS;
    document.body.setAttribute(
      "data-elementor-device-mode",
      window.innerWidth <= 767 ? "mobile" : window.innerWidth <= 1024 ? "tablet" : "desktop",
    );

    if (!window.__usmanHomeScriptsLoaded) {
      window.__usmanHomeScriptsLoaded = true;
      void hydrateWordPressScripts();
    } else {
      triggerWordPressReadyEvents();
    }

    return () => {
      document.body.className = previousBodyClass;
      if (previousDeviceMode) {
        document.body.setAttribute("data-elementor-device-mode", previousDeviceMode);
      } else {
        document.body.removeAttribute("data-elementor-device-mode");
      }
    };
  }, []);
}

async function hydrateWordPressScripts() {
  try {
    const mirrorResponse = await fetch("/site-mirror.html", { credentials: "same-origin" });
    const mirrorHtml = localizeUsmanAssets(await mirrorResponse.text());
    const mirrorDocument = new DOMParser().parseFromString(mirrorHtml, "text/html");
    const scripts = [...mirrorDocument.querySelectorAll<HTMLScriptElement>("head script, body script")];

    for (let index = 0; index < scripts.length; index += 1) {
      await runScript(scripts[index], index);
    }

    triggerWordPressReadyEvents();
  } catch (error) {
    console.warn("Homepage runtime hydration skipped", error);
  }
}

function runScript(sourceScript: HTMLScriptElement, index: number) {
  const type = sourceScript.getAttribute("type")?.trim().toLowerCase();
  const executableTypes = new Set(["", "text/javascript", "application/javascript", "module"]);

  if (type && !executableTypes.has(type)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const script = document.createElement("script");

    for (const attr of [...sourceScript.attributes]) {
      if (attr.name === "id") continue;
      script.setAttribute(attr.name, localizeUsmanAssets(attr.value));
    }

    script.dataset.usmanNativeRuntime = "true";
    script.id = sourceScript.id
      ? `usman-native-${sourceScript.id}`
      : `usman-native-script-${index}`;

    if (sourceScript.src) {
      script.async = false;
      script.src = localizeUsmanAssets(sourceScript.getAttribute("src") || sourceScript.src);
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
      return;
    }

    script.text = localizeUsmanAssets(sourceScript.textContent || "");
    document.body.appendChild(script);
    resolve();
  });
}

function triggerWordPressReadyEvents() {
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event("load"));
  document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));

  try {
    window.jQuery?.(window)?.trigger?.("elementor/frontend/init");
    window.jQuery?.(document)?.trigger?.("ready");
    window.elementorFrontend?.init?.();
  } catch (error) {
    console.warn("Homepage plugin init skipped", error);
  }
}