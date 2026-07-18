import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur";
const DESC =
  "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog, tools and resources.";
const URL = "https://usman-connects-us.lovable.app";

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
    links: [{ rel: "canonical", href: URL }],
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
  return (
    <>
      <style>{`html,body,#root{margin:0;padding:0;height:100%;overflow:hidden;background:#000}`}</style>
      {/* SEO-only content block (visible to crawlers, hidden from users) */}
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
        aria-hidden="true"
      >
        <h1>Usman Jatoi — Top 0.1% Full-Stack Digital Expert &amp; Entrepreneur</h1>
        <p>{DESC}</p>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <iframe
        src="/site-mirror.html"
        title={TITLE}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          border: 0,
          display: "block",
          background: "#000",
        }}
      />
    </>
  );
}
