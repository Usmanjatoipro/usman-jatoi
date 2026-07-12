import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Usman Jatoi — Educator, Entrepreneur, Strategist" },
      {
        name: "description",
        content:
          "Official site of Usman Jatoi — courses, blog posts, services and resources spanning entrepreneurship, education and strategy.",
      },
      { property: "og:title", content: "Usman Jatoi" },
      {
        property: "og:description",
        content:
          "Official site of Usman Jatoi — courses, blog posts, services and resources.",
      },
    ],
  }),
});

type Progress = {
  content_kind: string;
  imported_items: number;
  total_items: number | null;
  status: string;
};

function Home() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [postCount, setPostCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("wp_import_state")
      .select("content_kind,imported_items,total_items,status")
      .order("content_kind")
      .then(({ data }) => setProgress(data ?? []));
    supabase
      .from("wp_posts")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setPostCount(count ?? 0));
  }, []);

  const totalImported = progress.reduce((s, p) => s + p.imported_items, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Usman Jatoi</div>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/auth" className="hover:text-primary">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Site rebuild in progress</h1>
          <p className="text-muted-foreground text-lg">
            Content from usmanjatoi.com is being imported into Lovable Cloud. Once the import
            completes, the full site — posts, services, locations and media — will render here
            with proper templates.
          </p>
        </div>

        {postCount !== null && postCount > 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm">
              <span className="font-semibold">{postCount.toLocaleString()}</span> items imported so
              far.
            </p>
          </div>
        )}

        <div className="rounded-lg border p-4 space-y-2">
          <h2 className="font-semibold">Import progress</h2>
          <div className="space-y-1 text-sm">
            {progress.map((p) => (
              <div key={p.content_kind} className="flex justify-between">
                <span className="capitalize">{p.content_kind}</span>
                <span className="text-muted-foreground">
                  {p.imported_items.toLocaleString()} / {p.total_items?.toLocaleString() ?? "?"}
                  {p.status === "done" && " ✓"}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t font-medium">
              <span>Total</span>
              <span>{totalImported.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            <Link to="/auth" className="underline">
              Sign in
            </Link>{" "}
            as admin to run or resume imports.
          </p>
        </div>
      </main>
    </div>
  );
}
