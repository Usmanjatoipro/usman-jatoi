import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/legal/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Usman Jatoi" },
      { name: "description", content: "How this site collects, uses and safeguards your data." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we handle your data with care and transparency."
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Legal", to: "/legal" },
        { label: "Privacy Policy" },
      ]}
    >
      <div className="space-y-6 text-white/70 leading-relaxed">
        <p>
          We collect only the data required to run this site and its services — analytics,
          contact form submissions and account data if you sign in.
        </p>
        <p>
          We never sell your data. Cookies are used for essential functionality and anonymous
          analytics. You can request deletion of your data at any time via the contact page.
        </p>
      </div>
    </PageShell>
  ),
});
