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
    <iframe
      src="/site-mirror.html"
      title="Usman Jatoi"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
      }}
    />
  );
}
