import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
  breadcrumb?: Array<{ label: string; to?: string }>;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0a0a0e] text-white">
      <div className="mx-auto max-w-5xl px-6 py-24">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-6 text-sm text-white/60">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {b.to ? (
                  <Link to={b.to} className="hover:text-white">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            {eyebrow}
          </p>
        )}
        <h1 className="bg-gradient-to-r from-[#ff6ec4] via-[#7873f5] to-[#1fd1f9] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{description}</p>
        )}
        {children && <div className="mt-12">{children}</div>}
        <div className="mt-16">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 hover:border-white/40 hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </div>
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
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/30 hover:bg-white/[0.06]"
        >
          <h3 className="text-lg font-semibold text-white group-hover:text-[#1fd1f9]">
            {it.title}
          </h3>
          {it.desc && <p className="mt-2 text-sm text-white/60">{it.desc}</p>}
        </Link>
      ))}
    </div>
  );
}
