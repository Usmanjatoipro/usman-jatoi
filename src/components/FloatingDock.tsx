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
      <div className="flex items-center gap-2 rounded-full border border-white/12 bg-neutral-950/90 p-2 pl-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <Link to="/" aria-label="Usman Jatoi — home" className="shrink-0">
          <img
            src="/site-assets/cropped-Imagee-Character-2-192x192.webp"
            alt="Usman Jatoi"
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
          />
        </Link>
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:border-white/40 hover:text-white md:px-4 md:text-xs"
          >
            {it.label}
          </Link>
        ))}
        <Link
          to="/contact-me"
          className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-neutral-200 md:px-4 md:text-xs"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
