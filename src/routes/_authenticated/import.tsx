import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  getImportState,
  importChunk,
  resetImport,
  claimAdminRole,
} from "@/lib/wp-import.functions";
import {
  getMediaSyncStatus,
  syncMediaChunk,
  resetMediaSync,
} from "@/lib/wp-media-sync.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/import")({
  component: ImportPage,
  head: () => ({ meta: [{ title: "Import — Usman Jatoi" }] }),
});

type State = {
  content_kind: string;
  last_page: number;
  total_pages: number | null;
  total_items: number | null;
  imported_items: number;
  status: string;
  last_error: string | null;
};

function ImportPage() {
  const router = useRouter();
  const fetchState = useServerFn(getImportState);
  const runChunk = useServerFn(importChunk);
  const doReset = useServerFn(resetImport);
  const claim = useServerFn(claimAdminRole);
  const fetchMediaStatus = useServerFn(getMediaSyncStatus);
  const runMediaChunk = useServerFn(syncMediaChunk);
  const doResetMedia = useServerFn(resetMediaSync);
  const [state, setState] = useState<State[]>([]);
  const [runningKind, setRunningKind] = useState<string | null>(null);
  const [autoKind, setAutoKind] = useState<string | null>(null);
  const stopRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaStatus, setMediaStatus] = useState<{
    total: number;
    imported: number;
    cursor: number;
    status: string;
    last_error: string | null;
  } | null>(null);
  const [mediaAuto, setMediaAuto] = useState(false);
  const mediaStopRef = useRef(false);

  async function refresh() {
    try {
      const d = (await fetchState()) as any as State[];
      setState(d);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, []);

  async function onClaim() {
    try {
      await claim();
      toast.success("Admin role granted");
      router.invalidate();
      refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function runOne(kind: string) {
    setRunningKind(kind);
    try {
      const r = (await runChunk({ data: { kind: kind as any } })) as any;
      toast.success(`${kind}: page ${r.page} (+${r.pageCount ?? 0})`);
      refresh();
    } catch (e: any) {
      toast.error(`${kind}: ${e.message}`);
    } finally {
      setRunningKind(null);
    }
  }

  async function runAll(kind: string) {
    setAutoKind(kind);
    stopRef.current = false;
    try {
      while (!stopRef.current) {
        const r = (await runChunk({ data: { kind: kind as any } })) as any;
        await refresh();
        if (r.done) {
          toast.success(`${kind}: complete`);
          break;
        }
      }
    } catch (e: any) {
      toast.error(`${kind}: ${e.message}`);
    } finally {
      setAutoKind(null);
    }
  }

  function stopAuto() {
    stopRef.current = true;
  }

  async function onReset(kind: string) {
    if (!confirm(`Reset progress for ${kind}?`)) return;
    await doReset({ data: { kind: kind as any } });
    refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">WordPress Import</h1>
            <p className="text-sm text-muted-foreground">
              Pulls posts, pages, media, and taxonomies from usmanjatoi.com into Lovable Cloud.
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm text-destructive">{error}</p>
              {error.includes("admin") && (
                <Button onClick={onClaim} size="sm">
                  Claim admin role (first user)
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {state.map((s) => {
          const pct = s.total_items
            ? Math.min(100, Math.round((s.imported_items / s.total_items) * 100))
            : 0;
          const busy = runningKind === s.content_kind || autoKind === s.content_kind;
          return (
            <Card key={s.content_kind}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base capitalize">{s.content_kind}</CardTitle>
                <Badge
                  variant={
                    s.status === "done"
                      ? "default"
                      : s.status === "error"
                        ? "destructive"
                        : s.status === "running"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {s.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {s.imported_items.toLocaleString()} / {s.total_items?.toLocaleString() ?? "?"}
                  </span>
                  <span className="text-muted-foreground">
                    page {s.last_page}
                    {s.total_pages ? ` / ${s.total_pages}` : ""}
                  </span>
                </div>
                <Progress value={pct} />
                {s.last_error && (
                  <p className="text-xs text-destructive break-words">{s.last_error}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => runOne(s.content_kind)}
                    disabled={busy || autoKind !== null}
                  >
                    Import next page
                  </Button>
                  {autoKind === s.content_kind ? (
                    <Button size="sm" variant="secondary" onClick={stopAuto}>
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => runAll(s.content_kind)}
                      disabled={busy || autoKind !== null || s.status === "done"}
                    >
                      Auto-run until done
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReset(s.content_kind)}
                    disabled={busy}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <p className="text-xs text-muted-foreground">
          Auto-run pulls chunks of 50 items at a time. Leave this tab open until done — nothing
          runs in the background.
        </p>
      </div>
    </div>
  );
}
