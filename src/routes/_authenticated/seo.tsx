import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getAuditSnapshot,
  listAuditFindings,
  resolveFinding,
  runSeoAudit,
  scanBrokenLinks,
  listBrokenLinks,
  type AuditFinding,
  type AuditSnapshot,
} from "@/lib/seo-audit.functions";
import {
  applyEnrichment,
  listEnrichmentQueue,
  previewEnrichment,
  type EnrichmentPreview,
} from "@/lib/seo-enrich.functions";

export const Route = createFileRoute("/_authenticated/seo")({
  loader: () => getAuditSnapshot(),
  head: () => ({
    meta: [
      { title: "SEO Command Center — Usman Jatoi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SeoPage,
});

const ORANGE = "#FF6A00";

const LABELS: Record<string, string> = {
  missing_seo_title: "Missing SEO title",
  missing_seo_description: "Missing meta description",
  duplicate_title: "Duplicate titles",
  duplicate_description: "Duplicate descriptions",
  thin_content: "Thin content",
  noindex: "Blocked from search (noindex)",
  no_featured_image: "No featured image",
  canonical_mismatch: "Canonical mismatch",
};

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-neutral-200 bg-white p-5">{children}</div>;
}

function SeoPage() {
  const initial = Route.useLoaderData() as AuditSnapshot;
  const [snapshot, setSnapshot] = useState<AuditSnapshot>(initial);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [activeKind, setActiveKind] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkStatus, setLinkStatus] = useState<string>("");
  const [queue, setQueue] = useState<Array<{ path: string; title: string | null }>>([]);
  const [preview, setPreview] = useState<EnrichmentPreview | null>(null);
  const [manualPath, setManualPath] = useState("");

  const run = useServerFn(runSeoAudit);
  const list = useServerFn(listAuditFindings);
  const resolve = useServerFn(resolveFinding);
  const scan = useServerFn(scanBrokenLinks);
  const brokenList = useServerFn(listBrokenLinks);
  const queueFn = useServerFn(listEnrichmentQueue);
  const previewFn = useServerFn(previewEnrichment);
  const applyFn = useServerFn(applyEnrichment);

  async function guard(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  const totals = Object.entries(snapshot.totals ?? {}).sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">SEO Command Center</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {snapshot.audited.toLocaleString()} URLs audited ·{" "}
            {snapshot.total_issues.toLocaleString()} open issues
            {snapshot.generated_at
              ? ` · last run ${new Date(snapshot.generated_at).toISOString().slice(0, 16).replace("T", " ")} UTC`
              : ""}
          </p>
        </div>
        <button
          className="rounded-full px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ background: ORANGE }}
          disabled={busy !== null}
          onClick={() =>
            guard("audit", async () => {
              const next = await run();
              setSnapshot(next);
              setFindings([]);
              setActiveKind(null);
            })
          }
        >
          {busy === "audit" ? "Auditing…" : "Run full audit"}
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {totals.length === 0 && (
          <p className="text-sm text-neutral-500">Run the audit to populate the issue list.</p>
        )}
        {totals.map(([kind, count]) => (
          <button
            key={kind}
            className={`rounded-xl border p-4 text-left transition ${
              activeKind === kind ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
            }`}
            onClick={() =>
              guard("list", async () => {
                setActiveKind(kind);
                setFindings(await list({ data: { kind, limit: 100 } }));
              })
            }
          >
            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              {LABELS[kind] ?? kind}
            </div>
            <div className="mt-2 text-2xl font-semibold">{count.toLocaleString()}</div>
          </button>
        ))}
      </section>

      {findings.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">
            {LABELS[activeKind ?? ""] ?? activeKind} — fixable list
          </h2>
          <div className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {findings.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <a
                  className="font-medium underline decoration-neutral-300"
                  href={f.target_path}
                  target="_blank"
                  rel="noreferrer"
                >
                  {f.target_path}
                </a>
                <span className="text-neutral-500">{f.detail}</span>
                <div className="ml-auto flex gap-2">
                  <button
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
                    onClick={() =>
                      guard("preview", async () => {
                        setPreview(await previewFn({ data: { path: f.target_path } }));
                      })
                    }
                  >
                    Research fix
                  </button>
                  <button
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
                    onClick={() =>
                      guard("resolve", async () => {
                        await resolve({ data: { id: f.id } });
                        setFindings((prev) => prev.filter((x) => x.id !== f.id));
                      })
                    }
                  >
                    Mark done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Internal link health</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Scans post bodies in batches and records internal links that no longer resolve.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm"
              disabled={busy !== null}
              onClick={() =>
                guard("links", async () => {
                  let offset = 0;
                  let broken = 0;
                  for (let i = 0; i < 8; i += 1) {
                    const res = await scan({ data: { offset, batch: 150 } });
                    offset = res.nextOffset;
                    broken += res.broken;
                    setLinkStatus(`Scanned ${offset} posts · ${broken} broken links found`);
                    if (res.done) break;
                  }
                })
              }
            >
              {busy === "links" ? "Scanning…" : "Scan next 1,200 posts"}
            </button>
            <button
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm"
              onClick={() =>
                guard("brokenlist", async () => {
                  const rows = await brokenList();
                  setLinkStatus(
                    rows.length
                      ? `${rows.length} recorded: ${rows.slice(0, 6).map((r) => r.path).join(", ")}`
                      : "No broken internal links recorded.",
                  );
                })
              }
            >
              Show recorded
            </button>
          </div>
          {linkStatus && <p className="mt-3 text-sm text-neutral-600">{linkStatus}</p>}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">you.com enrichment queue</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Service pages first — research runs on your own you.com keys, never Lovable AI credits.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["services", "posts"] as const).map((scope) => (
              <button
                key={scope}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm capitalize"
                onClick={() =>
                  guard("queue", async () => {
                    setQueue(await queueFn({ data: { scope } }));
                  })
                }
              >
                Load {scope}
              </button>
            ))}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualPath.trim()) return;
                void guard("preview", async () => {
                  setPreview(await previewFn({ data: { path: manualPath.trim() } }));
                });
              }}
            >
              <input
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm"
                placeholder="/services/ai/"
                value={manualPath}
                onChange={(e) => setManualPath(e.target.value)}
              />
              <button className="rounded-full px-4 py-2 text-sm text-white" style={{ background: ORANGE }}>
                Research
              </button>
            </form>
          </div>
          {queue.length > 0 && (
            <ul className="mt-4 max-h-64 space-y-1 overflow-auto text-sm">
              {queue.map((row) => (
                <li key={row.path} className="flex items-center gap-2">
                  <button
                    className="text-left underline decoration-neutral-300"
                    onClick={() =>
                      guard("preview", async () => {
                        setPreview(await previewFn({ data: { path: row.path } }));
                      })
                    }
                  >
                    {row.title || row.path}
                  </button>
                  <span className="text-xs text-neutral-400">{row.path}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {preview && (
        <section className="mt-10">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Enrichment preview — {preview.path}</h2>
                <p className="text-xs text-neutral-500">
                  {preview.research.ok
                    ? `Research source: ${preview.research.provider}`
                    : `Research unavailable: ${preview.research.error}`}
                </p>
              </div>
              <button
                className="rounded-full px-4 py-2 text-sm text-white disabled:opacity-50"
                style={{ background: ORANGE }}
                disabled={busy !== null}
                onClick={() =>
                  guard("apply", async () => {
                    await applyFn({
                      data: {
                        path: preview.path,
                        seo_title: preview.suggested.seo_title,
                        seo_description: preview.suggested.seo_description,
                        keywords: preview.suggested.keywords,
                        faqs: preview.faqs,
                        citations: preview.citations,
                      },
                    });
                    setPreview(null);
                  })
                }
              >
                {busy === "apply" ? "Applying…" : "Apply to page"}
              </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-neutral-500">Current title</dt>
                <dd>{preview.current.seo_title || "—"}</dd>
                <dt className="mt-3 text-neutral-500">Suggested title</dt>
                <dd className="font-medium">{preview.suggested.seo_title}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Current description</dt>
                <dd>{preview.current.seo_description || "—"}</dd>
                <dt className="mt-3 text-neutral-500">Suggested description</dt>
                <dd className="font-medium">{preview.suggested.seo_description}</dd>
              </div>
            </dl>
            {preview.suggested.keywords.length > 0 && (
              <p className="mt-4 text-sm">
                <span className="text-neutral-500">Keywords: </span>
                {preview.suggested.keywords.join(", ")}
              </p>
            )}
            {preview.faqs.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm">
                {preview.faqs.map((f) => (
                  <li key={f.question}>
                    <strong>{f.question}</strong>
                    <div className="text-neutral-600">{f.answer}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}
    </main>
  );
}
