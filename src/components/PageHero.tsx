import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp.asset.json";

export type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  crumbs?: Crumb[];
  eyebrow?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
};

const SIZE = {
  sm: "pt-36 pb-10 md:pt-40 md:pb-12",
  md: "pt-40 pb-14 md:pt-48 md:pb-20",
  lg: "pt-44 pb-20 md:pt-52 md:pb-28",
};

const SITE_ORIGIN = "https://usmanjatoi.com";

/**
 * Global dark hero used across every non-home route.
 * Emits BreadcrumbList JSON-LD when crumbs are provided.
 */
export default function PageHero({
  title,
  crumbs = [],
  eyebrow,
  description,
  size = "md",
  children,
}: Props) {
  const breadcrumbSchema =
    crumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${SITE_ORIGIN}${c.href}` } : {}),
          })),
        }
      : null;

  return (
    <header
      className={`relative overflow-hidden text-white ${SIZE[size]}`}
      style={{
        backgroundImage: `url(${heroBg.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#050505",
      }}
    >
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.85) 100%), radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center">
        {eyebrow && (
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 border border-white/20 rounded-full px-3 py-1 mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight leading-tight max-w-4xl mx-auto text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {crumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mt-6 flex items-center justify-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-white/60 flex-wrap"
          >
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />}
                  {c.href && !last ? (
                    <Link to={c.href as any} className="hover:text-white transition">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={last ? "text-white font-medium max-w-[70vw] truncate" : ""}>
                      {c.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
