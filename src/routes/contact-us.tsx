import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-us")({
  beforeLoad: () => {
    throw redirect({ to: "/contact-me", statusCode: 301 });
  },
  component: () => null,
});
