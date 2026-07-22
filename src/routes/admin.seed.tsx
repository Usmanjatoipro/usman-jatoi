import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getSeedStatus, seedMedia, seedTerms, seedPostsBatch } from "@/lib/wp-seeder.server";

export const Route = createFileRoute("/admin/seed")({
  loader: async () => {
    return await getSeedStatus();
  },
  head: () => ({
    meta: [{ title: "WP Data Seeder — Admin" }],
  }),
  component: SeedPage,
});

type Status = { media: number; posts: number; pages: number; terms: number };

function SeedPage() {
  const initial = Route.useLoaderData() as Status;
  const [status, setStatus] = useState<Status>(initial);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog((l) => [...l, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  async function refreshStatus() {
    const s = await getSeedStatus();
    setStatus(s as Status);
  }

  async function runSeedMedia() {
    addLog("Seeding media…");
    const { count } = await seedMedia();
    addLog(`✓ Media: ${count} items seeded`);
    await refreshStatus();
  }

  async function runSeedTerms() {
    addLog("Seeding terms/categories/tags…");
    const { count } = await seedTerms();
    addLog(`✓ Terms: ${count} items seeded`);
    await refreshStatus();
  }

  async function runSeedPosts(postType: "posts" | "pages") {
    const label = postType === "posts" ? "Posts" : "Pages";
    addLog(`Seeding ${label}… (this may take a while)`);
    let offset = 0;
    let total = 0;
    let batchNum = 0;
    while (true) {
      batchNum++;
      const result = await seedPostsBatch({ data: { offset, postType } });
      total += result.count;
      addLog(`  Batch ${batchNum}: ${total} ${label.toLowerCase()} written (offset ${result.offset})`);
      if (result.done) break;
      offset = result.offset;
    }
    addLog(`✓ ${label} done: ${total} total`);
    await refreshStatus();
  }

  async function runFullSeed() {
    setRunning(true);
    setLog([]);
    try {
      addLog("=== Starting full WordPress data seed ===");
      await runSeedMedia();
      await runSeedTerms();
      await runSeedPosts("posts");
      await runSeedPosts("pages");
      addLog("=== All done! Refresh page to verify counts. ===");
    } catch (e: any) {
      addLog(`❌ Error: ${e?.message || String(e)}`);
    } finally {
      setRunning(false);
    }
  }

  const statCard = (label: string, val: number, color: string) => (
    <div key={label} className={`rounded-2xl p-6 ${color}`}>
      <div className="text-4xl font-black font-mono">{val.toLocaleString()}</div>
      <div className="text-sm mt-1 font-medium opacity-80">{label} in Supabase</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-neutral-500 hover:text-white text-sm">← Back to site</Link>
          <h1 className="text-4xl font-black mt-4">WordPress Data Seeder</h1>
          <p className="text-neutral-400 mt-2">
            Upload all WordPress content from local JSON manifests into Supabase.
            Run once to populate the database — after that, all pages load from Supabase directly.
          </p>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCard("Media", status.media, "bg-violet-900/40 border border-violet-700")}
          {statCard("Terms", status.terms, "bg-blue-900/40 border border-blue-700")}
          {statCard("Posts", status.posts, "bg-emerald-900/40 border border-emerald-700")}
          {statCard("Pages", status.pages, "bg-amber-900/40 border border-amber-700")}
        </div>

        {/* Local data counts */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8">
          <h2 className="text-lg font-bold mb-3">Local JSON Manifest Counts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-neutral-400">Media:</span> <span className="font-mono font-bold">609</span></div>
            <div><span className="text-neutral-400">Posts:</span> <span className="font-mono font-bold">16,919</span></div>
            <div><span className="text-neutral-400">Pages:</span> <span className="font-mono font-bold">21,607</span></div>
            <div><span className="text-neutral-400">Terms:</span> <span className="font-mono font-bold">~2,500+</span></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runFullSeed}
            disabled={running}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white disabled:opacity-50 hover:opacity-90 transition"
          >
            {running ? "⏳ Seeding…" : "🚀 Seed Everything (Full Run)"}
          </button>
          <button
            onClick={runSeedMedia}
            disabled={running}
            className="px-5 py-3 bg-violet-900/50 border border-violet-700 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-violet-900/70 transition"
          >
            Seed Media Only
          </button>
          <button
            onClick={runSeedTerms}
            disabled={running}
            className="px-5 py-3 bg-blue-900/50 border border-blue-700 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-blue-900/70 transition"
          >
            Seed Terms Only
          </button>
          <button
            onClick={() => runSeedPosts("posts")}
            disabled={running}
            className="px-5 py-3 bg-emerald-900/50 border border-emerald-700 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-emerald-900/70 transition"
          >
            Seed Posts Only
          </button>
          <button
            onClick={() => runSeedPosts("pages")}
            disabled={running}
            className="px-5 py-3 bg-amber-900/50 border border-amber-700 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-amber-900/70 transition"
          >
            Seed Pages Only
          </button>
          <button
            onClick={refreshStatus}
            disabled={running}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-white/10 transition"
          >
            Refresh Counts
          </button>
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Seed Log</h3>
            <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {log.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.includes("✓")
                      ? "text-emerald-400"
                      : line.includes("❌")
                      ? "text-red-400"
                      : line.includes("===")
                      ? "text-fuchsia-400 font-bold"
                      : "text-neutral-300"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-neutral-600">
          ⚠️ This page should be protected in production. Add authentication before deploying.
        </p>
      </div>
    </div>
  );
}
