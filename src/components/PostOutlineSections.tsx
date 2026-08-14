import { useState } from "react";
import {
  BarChart3,
  Quote as QuoteIcon,
  Lightbulb,
  Layers,
  AlertTriangle,
  Wrench,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import type { PostOutline } from "@/lib/wp-outline.functions";

function splitStat(line: string) {
  const match = line.match(/^([^:]{2,60}):\s*(.+)$/);
  if (match) return { label: match[1].trim(), value: match[2].trim() };
  const num = line.match(/(\$?\d[\d.,]*\s?(?:%|B|M|K|x|bn|billion|million)?)/i);
  return { label: num ? num[1] : "", value: line };
}

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="nofollow noopener"
        className="text-orange-600 underline underline-offset-2 break-all"
      >
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

const RESOURCE_DOMAINS: Record<string, string> = {
  ahrefs: "ahrefs.com",
  anthropic: "anthropic.com",
  canva: "canva.com",
  chatgpt: "openai.com",
  cloudflare: "cloudflare.com",
  figma: "figma.com",
  github: "github.com",
  google: "google.com",
  hubspot: "hubspot.com",
  linkedin: "linkedin.com",
  openai: "openai.com",
  semrush: "semrush.com",
  wordpress: "wordpress.org",
  youtube: "youtube.com",
};

function resourceInfo(value: string) {
  const url = value.match(/https?:\/\/[^\s)]+/i)?.[0];
  let domain = "";
  if (url) {
    try {
      domain = new URL(url).hostname.replace(/^www\./, "");
    } catch {}
  }
  if (!domain) {
    const lower = value.toLowerCase();
    const match = Object.keys(RESOURCE_DOMAINS).find((name) => lower.includes(name));
    if (match) domain = RESOURCE_DOMAINS[match];
  }
  return {
    label:
      value
        .replace(/https?:\/\/[^\s)]+/i, "")
        .replace(/[-–—:\s]+$/, "")
        .trim() || domain,
    href: url || (domain ? `https://${domain}` : ""),
    domain,
  };
}

function SectionHead({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof BarChart3;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-900 text-orange-400">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
        {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
    </div>
  );
}

export default function PostOutlineSections({ outline }: { outline: PostOutline | null }) {
  const [showAllCitations, setShowAllCitations] = useState(false);
  if (!outline) return null;

  const stats = outline.stats.slice(0, 6);
  const insights = outline.insights.slice(0, 6);
  const examples = outline.examples.slice(0, 6);
  const risks = outline.risks.slice(0, 6);
  const tools = outline.tools.slice(0, 12);
  const quote = outline.quotes[0];
  const moreQuotes = outline.quotes.slice(1, 4);
  const citations = outline.citations;

  const hasAny =
    stats.length ||
    insights.length ||
    examples.length ||
    risks.length ||
    tools.length ||
    quote ||
    citations.length;
  if (!hasAny) return null;

  return (
    <section className="mt-12 space-y-12" aria-label="Research and key data">
      {stats.length > 0 && (
        <div>
          <SectionHead icon={BarChart3} title="Key numbers" hint="Data points behind this topic" />
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((line, index) => {
              const { label, value } = splitStat(line);
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-900 transition"
                >
                  {label && (
                    <div className="text-2xl font-semibold tracking-tight text-neutral-900">
                      {label}
                    </div>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {quote && (
        <figure className="rounded-2xl bg-neutral-950 text-white p-7 md:p-9">
          <QuoteIcon className="h-7 w-7 text-orange-500" />
          <blockquote className="mt-4 text-xl md:text-2xl font-medium leading-snug tracking-tight">
            {quote}
          </blockquote>
          {moreQuotes.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm text-white/70">
              {moreQuotes.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          )}
        </figure>
      )}

      {insights.length > 0 && (
        <div>
          <SectionHead icon={Lightbulb} title="What it means" hint="Analyst takeaways" />
          <ul className="space-y-3">
            {insights.map((line, index) => (
              <li
                key={index}
                className="rounded-xl border-l-4 border-orange-500 bg-orange-50/60 px-5 py-4 text-[15px] leading-relaxed text-neutral-800"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {examples.length > 0 && (
        <div>
          <SectionHead icon={Layers} title="Real-world examples" />
          <div className="grid gap-3 md:grid-cols-2">
            {examples.map((line, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-[15px] leading-relaxed text-neutral-800"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <SectionHead icon={AlertTriangle} title="Risks and trade-offs" />
          <ul className="space-y-2">
            {risks.map((line, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl border border-red-100 bg-red-50/70 px-5 py-3.5 text-[15px] leading-relaxed text-neutral-800"
              >
                <AlertTriangle className="mt-1 h-4 w-4 flex-none text-red-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(tools.length > 0 || citations.length > 0) && (
        <div>
          <SectionHead
            icon={Wrench}
            title="Resources and citations"
            hint="Tools and source material for this topic"
          />
          {tools.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {tools.map((line, index) => {
                const resource = resourceInfo(line);
                const body = (
                  <>
                    {resource.domain ? (
                      <img
                        src={`https://www.google.com/s2/favicons?sz=64&domain=${resource.domain}`}
                        alt=""
                        className="h-9 w-9 rounded-lg border border-neutral-200 bg-white p-1"
                      />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-900 text-white">
                        <BookOpen className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0 text-sm font-medium text-neutral-800">
                      {resource.label}
                    </span>
                  </>
                );
                return resource.href ? (
                  <a
                    key={index}
                    href={resource.href}
                    target="_blank"
                    rel="nofollow noopener"
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition hover:border-neutral-900"
                  >
                    {body}
                  </a>
                ) : (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
                  >
                    {body}
                  </div>
                );
              })}
            </div>
          )}
          {citations.length > 0 && (
            <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <BookOpen className="h-4 w-4" /> Sources
              </div>
              <ol className="space-y-2 text-sm leading-relaxed text-neutral-700 list-decimal pl-5">
                {(showAllCitations ? citations : citations.slice(0, 5)).map((line, index) => (
                  <li key={index}>{linkify(line)}</li>
                ))}
              </ol>
              {citations.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllCitations((value) => !value)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-orange-600"
                >
                  {showAllCitations ? "Show fewer sources" : `Show all ${citations.length} sources`}
                  <ChevronDown
                    className={`h-4 w-4 transition ${showAllCitations ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
