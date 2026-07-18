import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur" },
      {
        name: "description",
        content:
          "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur. Courses, services, blog and resources.",
      },
      { property: "og:title", content: "Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur" },
      {
        property: "og:description",
        content:
          "Official site of Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur.",
      },
    ],
  }),
});

function Home() {
  return (
    <>
      <style>{`html,body,#root{margin:0;padding:0;height:100%;overflow:hidden;background:#000}`}</style>
      <iframe
        src="/site-mirror.html"
        title="Usman Jatoi — Top 0.1% Full-Stack Digital Expert & Entrepreneur"
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
