import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function AuthGate() {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setState("in");
        return;
      }
      setState("out");
      window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`;
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (active && session) setState("in");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state !== "in") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        {state === "out" ? "Redirecting to sign in…" : "Checking access…"}
      </div>
    );
  }

  return <Outlet />;
}

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});
