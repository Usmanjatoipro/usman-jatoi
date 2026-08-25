import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/media-kit")({
    head: () => ({
    meta: [
      { title: "Media Kit & Brand Assets — Usman Jatoi" },
      { name: "description", content: "Official bios, headshots, brand logos, and press resources for Usman Jatoi." },
      { property: "og:title", content: "Media Kit & Brand Assets — Usman Jatoi" },
      { property: "og:description", content: "Official bios, headshots, brand logos, and press resources for Usman Jatoi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/media-kit" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/media-kit" }],
  }),
  component: MediaKitPage,
});

const assets = [
  ["Usman Jatoi Official", "/site-assets/Usman-Jatoi-Official.webp"],
  ["Usman Jatoi Pro", "/site-assets/Usman-Jatoi-Pro.webp"],
  ["Redsglow Logo", "/site-assets/Redsglow-Logo.png"],
  ["RabbitFlare Logo", "/site-assets/RabbitFlare-Logo.png"],
  ["UJ Online Logo", "/site-assets/UJonline-Minimal-Logo.png"],
  ["Usama 2.0 Logo", "/site-assets/Usama-2.0-Logo.png"],
];

function MediaKitPage() {
  return (
    <PageShell
      eyebrow="Others"
      title="Media Kit"
      description="Approved photos, logos and press details for interviews, features and collaborations."
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Media Kit" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map(([name, src]) => (
          <a
            key={src}
            href={src}
            download
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-black"
          >
            <div className="flex aspect-[16/10] items-center justify-center rounded-md bg-neutral-50 p-4">
              <img src={src} alt={name} className="max-h-full max-w-full object-contain" loading="lazy" />
            </div>
            <span className="mt-3 block text-sm font-semibold">{name}</span>
            <span className="text-xs text-neutral-500">Download asset</span>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
