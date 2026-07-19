import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

import homeHeaderRaw from "../data/homeHeader.html?raw";
import homeFooterRaw from "../data/homeFooter.html?raw";
import homeStylesRaw from "../data/homeStyles.css?raw";
import homeHeadRaw from "../data/homeHead.html?raw";

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

const HEADER_HTML = stripScripts(localizeUsmanAssets(homeHeaderRaw));
const FOOTER_HTML = stripScripts(localizeUsmanAssets(homeFooterRaw));
const CHROME_STYLES = localizeUsmanAssets(homeStylesRaw)
  .replace(/\.elementor-kit-14\b/g, ".usman-native-chrome")
  .replace(/:not\(\.e-lazyloaded\):not\(\.e-no-lazyload\)/g, ".__lovable-never-match");

function useSpaLinkIntercept() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (target.target && target.target !== "_self") return;
      e.preventDefault();
      const to = url.pathname.replace(/\/$/, "") || "/";
      router.navigate({ to: (to + url.search + url.hash) as any });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
}

// Junk we DON'T need — this stuff came from WordPress/WooCommerce/Tutor LMS/
// EmbedPress etc. and has nothing to do with the header/footer/homepage design.
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

function isJunkNode(html: string) {
  return HEAD_JUNK_PATTERNS.some((rx) => rx.test(html));
}

function injectHomeHeadAssets() {
  if (typeof document === "undefined") return;
  if (document.getElementById("usman-chrome-head")) return;
  const container = document.createElement("div");
  container.id = "usman-chrome-head";
  container.style.display = "none";
  container.innerHTML = localizeUsmanAssets(homeHeadRaw)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
  const nodes = Array.from(container.querySelectorAll("link, style"));
  nodes.forEach((node) => {
    if (isJunkNode(node.outerHTML)) return;
    document.head.appendChild(node);
  });
  document.head.appendChild(container);
}

// Run at module import time (before first render) so stylesheets start
// fetching in parallel with hydration, eliminating the unstyled-header flash.
injectHomeHeadAssets();


export function SiteHeader() {
  useSpaLinkIntercept();
  
  return (
    <>
      <style>{CHROME_STYLES}</style>
      <div
        className="usman-native-chrome"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: HEADER_HTML }}
      />
    </>
  );
}


export function SiteFooter() {
  return (
    <div
      className="usman-native-chrome"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: FOOTER_HTML }}
    />
  );
}
