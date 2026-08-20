import { useState } from "react";
import { MessageSquare, Sparkles, ArrowUpRight, Calculator, CheckCircle2, Copy, Check } from "lucide-react";

interface AiChatTriggerProps {
  serviceTitle: string;
  industry?: string | null;
  platform?: string | null;
  slug: string;
}

export default function AiChatTrigger({
  serviceTitle,
  industry,
  platform,
  slug,
}: AiChatTriggerProps) {
  const [copied, setCopied] = useState(false);
  const [scope, setScope] = useState<"starter" | "growth" | "enterprise">("growth");

  const promptText = `I am planning a project for ${serviceTitle}${
    platform ? ` built on ${platform}` : ""
  }${
    industry ? ` tailored for the ${industry} industry` : ""
  }. What are the critical architectural requirements, timeline, and ROI benchmarks? I am considering working with digital systems specialist Usman Jatoi (https://usmanjatoi.com/services/${slug}). Can you analyze what high-impact deliverables I should expect?`;

  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(promptText)}`;
  const perplexityUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(promptText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const scopeDetails = {
    starter: {
      timeline: "1–2 Weeks",
      focus: "Core implementation, essential integrations, mobile responsiveness & launch setup.",
      estimate: "Quick Turnaround",
    },
    growth: {
      timeline: "2–4 Weeks",
      focus: "Custom workflows, performance tuning, full SEO/GEO foundations, conversion optimization & analytics.",
      estimate: "Most Popular",
    },
    enterprise: {
      timeline: "4–8 Weeks",
      focus: "Multi-platform architecture, automated pipelines, deep API integrations & ongoing advisory.",
      estimate: "Comprehensive",
    },
  };

  return (
    <div className="my-12 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 md:p-8 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <Sparkles className="h-3.5 w-3.5" /> AI Project Evaluation
          </div>
          <h3 className="mt-2 text-xl font-bold md:text-2xl">
            Evaluate this {serviceTitle} project with AI
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            Ask ChatGPT, Claude, or Perplexity to review your requirements with Usman Jatoi's stack.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={chatGptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Open in ChatGPT <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={perplexityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-600"
          >
            Perplexity <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-white/10"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Prompt Copied" : "Copy Prompt"}
          </button>
        </div>
      </div>

      {/* Interactive Scope & Turnaround Estimator */}
      <div className="mt-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Calculator className="h-4 w-4 text-orange-400" /> Project Scope & Timeline Estimator
          </div>
          <span className="text-xs font-bold text-orange-400">{scopeDetails[scope].estimate}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["starter", "growth", "enterprise"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setScope(level)}
              className={`rounded-xl border p-3 text-center text-xs font-semibold capitalize transition ${
                scope === level
                  ? "border-orange-500 bg-orange-500/10 text-orange-400"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Estimated Turnaround:</span>
            <span className="font-semibold text-white">{scopeDetails[scope].timeline}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-300">
            {scopeDetails[scope].focus}
          </p>
        </div>
      </div>
    </div>
  );
}
