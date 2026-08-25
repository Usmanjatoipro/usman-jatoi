import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/legal/our-terms")({
    head: () => ({
    meta: [
      { title: "Terms of Service — Usman Jatoi" },
      { name: "description", content: "Terms and conditions governing services and digital assets on UsmanJatoi.com." },
      { property: "og:title", content: "Terms of Service — Usman Jatoi" },
      { property: "og:description", content: "Terms and conditions governing services and digital assets on UsmanJatoi.com." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://usmanjatoi.com/legal/our-terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://usmanjatoi.com/legal/our-terms" }],
  }),
  component: () => (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="By using this site you agree to these terms. Full text below."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Legal", to: "/legal" },
        { label: "Terms of Service" },
      ]}
    >
      <div className="space-y-6 leading-relaxed text-neutral-700">
        <p>
          These terms govern your use of this website, its content and any services offered. By
          continuing to browse or transact, you accept them.
        </p>
        <p>
          Content is provided as-is; consult a professional before acting on any advice. All
          trademarks belong to their respective owners. For questions, contact us via the
          contact page.
        </p>
      </div>
    </PageShell>
  ),
});
