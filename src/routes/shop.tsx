import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop & Digital Products — Usman Jatoi" },
      {
        name: "description",
        content: "Themes, boilerplates, automation templates, and development resources.",
      },
      { property: "og:title", content: "Shop & Digital Products — Usman Jatoi" },
      {
        property: "og:description",
        content: "Themes, boilerplates, automation templates, and development resources.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/shop" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/shop" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Store"
      title="Shop"
      description="Digital products, studio packages, and development resources designed to scale your online presence."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Shop" }]}
    >
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-neutral-950">
          Featured Creative Shop
        </h2>

        <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 text-white shadow-lg transition hover:border-[#FF6A00]">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6A00]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                <Sparkles className="h-3.5 w-3.5" />
                Etsy Creative Shop
              </span>
              <span className="text-xs text-neutral-400">Digital & Physical Goods</span>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Nuvox Digital Studio
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-300">
              Creative digital & physical products made to be useful, unique, and beautiful. Premium
              digital downloads, templates, printable designs, and print-on-demand goods.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/shop/NuvoxDigitalStudio"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e55f00]"
              >
                View Shop & Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://www.etsy.com/shop/NuvoxDigitalStudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Visit on Etsy
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  ),
});
