import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-testimonials")({
  beforeLoad: () => {
    throw redirect({ to: "/testimonials", statusCode: 301 });
  },
  component: () => null,
});
