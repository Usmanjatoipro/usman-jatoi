import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap_index.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 301,
          headers: {
            Location: "/sitemap.xml",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
