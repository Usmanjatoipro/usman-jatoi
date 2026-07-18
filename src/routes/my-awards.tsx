import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-awards")({
  beforeLoad: () => {
    throw redirect({ to: "/awards" });
  },
});
