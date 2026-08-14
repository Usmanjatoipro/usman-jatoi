import { Link } from "@tanstack/react-router";

const items = [
  { label: "Services", to: "/services" },
  { label: "About", to: "/about-me" },
  { label: "Portfolio", to: "/portfolio" },
];

/**
 * Floating pill dock — avatar + primary pillar links + white CONTACT pill.
 * Fixed to the bottom on mobile, bottom-centered on desktop.
 */
export default function FloatingDock() {
  return (
    <nav
      aria-label="Quick navigation"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 print:hidden"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/12 bg-neutral-950/90 p-1 pl-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-2 sm:p-2 sm:pl-2.5">
        <Link to="/" aria-label="Usman Jatoi — home" className="shrink-0">
          <img
            src="/site-assets/cropped-Imagee-Character-2-192x192.webp"
            alt="Usman Jatoi"
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9 md:h-10 md:w-10"
          />
        </Link>
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="rounded-full border border-white/15 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-white/85 transition hover:border-white/40 hover:text-white sm:px-3 sm:text-[11px] sm:tracking-[0.14em] md:px-4 md:text-xs"
          >
            {it.label}
          </Link>
        ))}
        <Link
          to="/contact-me"
          className="rounded-full bg-white px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-neutral-950 transition hover:bg-neutral-200 sm:px-3 sm:text-[11px] sm:tracking-[0.14em] md:px-4 md:text-xs"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
