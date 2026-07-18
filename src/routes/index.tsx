import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import homeBody from "@/data/homeBody.html?raw";
import homeStyles from "@/data/homeStyles.css?raw";
import homeLinks from "@/data/homeLinks.json";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const URL = "https://usman-connects-us.lovable.app";

// Only keep stylesheet links; skip anything referencing external unavailable domains
const stylesheetLinks = (homeLinks as { rel: string; href: string }[])
  .filter((l) => l.rel === "stylesheet")
  .map((l) => ({ rel: "stylesheet", href: l.href }));

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
      { rel: "canonical", href: URL },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
      },
      ...stylesheetLinks,
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
  useEffect(() => {
    // Chatway
    if (!document.getElementById("chatway")) {
      const s = document.createElement("script");
      s.id = "chatway";
      s.async = true;
      s.src =
        "https://cdn.chatway.app/widget.js?id=L0xfLqShglJm";
      document.body.appendChild(s);
    }
    // VideoAsk
    if (!document.getElementById("videoask-embed")) {
      const s = document.createElement("script");
      s.id = "videoask-embed";
      s.async = true;
      (window as unknown as { VIDEOASK_EMBED_CONFIG: unknown }).VIDEOASK_EMBED_CONFIG = {
        kind: "widget",
        url: "https://www.videoask.com/fbxgry0wo",
        options: {
          widgetType: "VideoThumbnailExtraLarge",
          text: "",
          backgroundColor: "#7D00FE",
          position: "bottom-right",
          dismissible: false,
          videoPosition: "center center",
        },
      };
      s.src = "https://www.videoask.com/embed/embed.js";
      document.body.appendChild(s);
    }
  }, []);

  return (
    <>
      {/* Inline captured stylesheet blob from the original site for pixel parity */}
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `html,body,#root{margin:0;padding:0;background:#fff}#root{min-height:100vh}`,
        }}
      />
      <div
        id="usmanjatoi-home"
        dangerouslySetInnerHTML={{ __html: homeBody }}
      />
    </>
  );
}
