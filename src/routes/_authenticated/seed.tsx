import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/seed")({
  beforeLoad: () => {
    throw redirect({ to: "/import" });
  },
});
