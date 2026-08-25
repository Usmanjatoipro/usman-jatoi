import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-certifications")({
  beforeLoad: () => {
    throw redirect({ to: "/certifications", statusCode: 301 });
  },
  component: () => null,
});
