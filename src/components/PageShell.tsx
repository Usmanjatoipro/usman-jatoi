import { Link, useLocation, useMatches } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import PageHero from "@/components/PageHero";

type Crumb = { label: string; to?: string };
type LocalPage = {
  post?: {
    title?: string | null;
    excerpt?: string | null;
    content?: string | null;
    seo_description?: string | null;
    post_modified?: string | null;
  };
  children?: Array<{
    title?: string | null;
    path?: string | null;
    excerpt?: string | null;
  }>;
};

type SnapshotItem = {
  id?: number;
  status?: string;
  slug?: string;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  path?: string | null;
  seo_description?: string | null;
  post_modified?: string | null;
};

const PAGE_DATA_ALIASES: Record<string, string> = {
  legal: "legals",
  awards: "my-awards",
  certifications: "my-certifications",
  testimonials: "my-testimonials",
};

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function stripHtml(value: string | null | undefined) {
  if (!value) return "";
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function cleanContentHtml(value: string | null | undefined) {
  if (!value) return "";
  return decodeHtml(value)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/https?:\/\/(?:www\.)?usmanjatoi\.com/g, "")
    .replace(/\s(?:style|class|id|data-[\w-]+|aria-[\w-]+|role|srcset|sizes|decoding|fetchpriority)=("[^"]*"|'[^']*')/gi, "")
    .replace(/\son\w+=("[^"]*"|'[^']*')/gi, "")
    .replace(/<\/?(?:div|section|article|main|header|footer|span|font)[^>]*>/gi, "")
    .replace(/<h1\b/gi, "<h2")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<img([^>]*?)>/gi, '<img$1 loading="lazy">')
    .replace(/<a\s+href="\/([^"#?]*?)\/?"/gi, (_m, path: string) => `<a href="/${path}"`)
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fallbackCrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];
  parts.forEach((part, index) => {
    const label = decodeHtml(part.replace(/-/g, " ")).replace(/\b\w/g, (m) => m.toUpperCase());
    const to = `/${parts.slice(0, index + 1).join("/")}`;
    crumbs.push(index === parts.length - 1 ? { label } : { label, to });
  });
  return crumbs;
}

function asLocalPage(data: unknown): LocalPage | null {
  if (!data || typeof data !== "object" || !("post" in data)) return null;
  const candidate = data as LocalPage;
  return candidate.post && typeof candidate.post === "object" ? candidate : null;
}

function normalizePath(value: string | null | undefined) {
  return `/${(value || "").replace(/^\/+|\/+$/g, "")}`;
}

async function responseTextMaybeGzip(response: Response) {
  const buffer = await response.arrayBuffer();

  try {
    const streamCtor = (globalThis as unknown as {
      DecompressionStream?: new (format: "gzip") => TransformStream<Uint8Array, Uint8Array>;
    }).DecompressionStream;
    if (streamCtor) {
      const stream = new Blob([buffer]).stream().pipeThrough(new streamCtor("gzip"));
      const decompressed = await new Response(stream).text();
      if (decompressed.trim().startsWith("[")) return decompressed;
    }
  } catch {
    /* Some dev servers already decode gzip responses. */
  }

  return new TextDecoder().decode(buffer);
}

async function loadPublicSnapshotPage(path: string): Promise<LocalPage | null> {
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return null;

  const bucket = PAGE_DATA_ALIASES[parts[0]] || parts[0];
  const response = await fetch(`/wp-data/pages/${bucket}.json.gz`);
  if (!response.ok) return null;

  const raw = await responseTextMaybeGzip(response);
  if (!raw.trim().startsWith("[")) return null;

  const items = JSON.parse(raw) as SnapshotItem[];
  const wanted = normalizePath(path);
  const current =
    items.find((item) => normalizePath(item.path) === wanted) ||
    items.find((item) => normalizePath(item.slug) === wanted);
  if (!current) return null;

  const prefix = `${wanted}/`;
  const segCount = wanted.split("/").filter(Boolean).length;
  const childItems = items
    .filter((item) => {
      const childPath = normalizePath(item.path);
      return (
        item.status === "publish" &&
        childPath.startsWith(prefix) &&
        childPath.split("/").filter(Boolean).length === segCount + 1
      );
    })
    .map((item) => ({
      title: item.title || item.slug || "Page",
      path: normalizePath(item.path),
      excerpt: stripHtml(item.excerpt).slice(0, 140),
    }));

  return {
    post: {
      title: current.title || "",
      excerpt: current.excerpt || "",
      content: current.content || "",
      seo_description: current.seo_description || current.excerpt || "",
      post_modified: current.post_modified || null,
    },
    children: childItems,
  };
}

export function PageShell({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  const location = useLocation();
  const matches = useMatches();
  const [snapshotPage, setSnapshotPage] = useState<LocalPage | null>(null);

  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const crumbs = breadcrumb?.length ? breadcrumb : fallbackCrumbs(location.pathname);
  const loaderPage =
    [...matches]
      .reverse()
      .map((match) => asLocalPage(match.loaderData))
      .find((data) => data !== null) ?? null;
  const localPage = loaderPage || snapshotPage;

  useEffect(() => {
    let active = true;
    setSnapshotPage(null);
    if (!path || loaderPage) return;

    loadPublicSnapshotPage(path)
      .then((page) => {
        if (active) setSnapshotPage(page);
      })
      .catch(() => {
        if (active) setSnapshotPage(null);
      });

    return () => {
      active = false;
    };
  }, [loaderPage, path]);

  const wpTitle = stripHtml(localPage?.post?.title);
  const wpDescription = stripHtml(localPage?.post?.seo_description || localPage?.post?.excerpt);
  const bodyHtml = useMemo(() => cleanContentHtml(localPage?.post?.content), [localPage]);
  const bodyText = stripHtml(bodyHtml);
  const childPages = (localPage?.children || []).filter(
    (item: NonNullable<LocalPage["children"]>[number]) => item.path && item.title,
  );

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <PageHero
        title={wpTitle || title}
        eyebrow={eyebrow}
        description={wpDescription || description}
        size="sm"
        crumbs={crumbs.map((crumb) => ({ label: crumb.label, href: crumb.to }))}
      />

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[minmax(0,1fr)_280px] md:px-8 md:py-16">
          <div className="min-w-0">
            {children && <div className="mb-10">{children}</div>}

            {bodyText.length > 80 ? (
              <article
                className="usman-page-content max-w-none"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                <p className="text-sm leading-7 text-neutral-700">
                  {description ||
                    "This page is part of the Usman Jatoi site archive. Explore the linked sections for the detailed content."}
                </p>
              </section>
            )}
          </div>

          <aside className="md:sticky md:top-28 md:self-start">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Page Map
              </p>
              <nav className="mt-4 space-y-2 text-sm">
                {crumbs.map((crumb, index) =>
                  crumb.to ? (
                    <Link
                      key={`${crumb.label}-${index}`}
                      to={crumb.to as never}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-neutral-700 hover:bg-white hover:text-black"
                    >
                      {crumb.label}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span
                      key={`${crumb.label}-${index}`}
                      className="block rounded-md bg-black px-3 py-2 font-medium text-white"
                    >
                      {crumb.label}
                    </span>
                  ),
                )}
              </nav>
            </div>

            {childPages.length > 0 && (
              <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  More Here
                </p>
                <div className="mt-4 space-y-2">
                  {childPages
                    .slice(0, 12)
                    .map((item: NonNullable<LocalPage["children"]>[number]) => (
                    <Link
                      key={item.path || item.title || ""}
                      to={(item.path || "/") as never}
                      className="group block rounded-md border border-neutral-200 p-3 text-sm hover:border-black"
                    >
                      <span className="flex items-center justify-between gap-3 font-medium text-neutral-950">
                        {stripHtml(item.title)}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                      </span>
                      {item.excerpt && (
                        <span className="mt-1 block text-xs leading-5 text-neutral-500">
                          {stripHtml(item.excerpt).slice(0, 100)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Need a clearer next step?
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Let’s turn the idea into a shipped page.</h2>
          </div>
          <Link
            to="/contact-me"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Contact Me
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <style>{`
        .usman-page-content {
          color: #171717;
          font-size: 16px;
          line-height: 1.82;
        }
        .usman-page-content > * + * { margin-top: 1rem; }
        .usman-page-content h2 {
          margin-top: 2.6rem;
          margin-bottom: 1rem;
          font-size: clamp(1.75rem, 4vw, 2.6rem);
          line-height: 1.15;
          letter-spacing: 0;
          font-weight: 650;
        }
        .usman-page-content h3 {
          margin-top: 2rem;
          margin-bottom: .75rem;
          font-size: 1.35rem;
          line-height: 1.25;
          font-weight: 650;
        }
        .usman-page-content p,
        .usman-page-content li {
          color: #404040;
        }
        .usman-page-content a {
          color: #111;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }
        .usman-page-content ul,
        .usman-page-content ol {
          margin: 1.25rem 0;
          padding-left: 1.4rem;
        }
        .usman-page-content li + li { margin-top: .45rem; }
        .usman-page-content img {
          width: min(100%, 760px);
          height: auto;
          display: block;
          margin: 1.5rem 0;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          background: #f5f5f5;
        }
        .usman-page-content blockquote {
          margin: 2rem 0;
          border-left: 4px solid #111;
          background: #f5f5f5;
          padding: 1rem 1.25rem;
          color: #262626;
        }
        .usman-page-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: .92rem;
        }
        .usman-page-content th,
        .usman-page-content td {
          border: 1px solid #e5e5e5;
          padding: .85rem;
          vertical-align: top;
        }
        .usman-page-content th {
          background: #111;
          color: #fff;
          font-weight: 650;
        }
        @media (max-width: 760px) {
          .usman-page-content { font-size: 15px; }
          .usman-page-content img { width: 100%; }
        }
      `}</style>
    </main>
  );
}

export function LinkGrid({
  items,
}: {
  items: Array<{ title: string; desc?: string; to: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((it, index) => (
        <Link
          key={it.to}
          to={it.to as never}
          className="group rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 transition hover:-translate-y-0.5 hover:border-black hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs font-mono text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 transition group-hover:text-black" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-neutral-950">{it.title}</h3>
          {it.desc && <p className="mt-2 text-sm leading-6 text-neutral-600">{it.desc}</p>}
        </Link>
      ))}
    </div>
  );
}
