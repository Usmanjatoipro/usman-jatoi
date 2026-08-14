import { useEffect, useRef } from "react";

export type FlagEntry = { code: string; flag: string; country: string; note: string };

function Row({ entries, dir, slug }: { entries: FlagEntry[]; dir: "up" | "down"; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--uj-dir", dir === "up" ? "-50%" : "50%");
  }, [dir]);

  const doubled = [...entries, ...entries];
  return (
    <div className="relative h-[330px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_14%,#000_86%,transparent)]">
      <div
        ref={ref}
        className="flex flex-col gap-4"
        style={{
          animation: `uj-marquee-${dir} 22s linear infinite`,
        }}
      >
        {doubled.map((e, i) => (
          <a
            key={`${e.code}-${i}`}
            href={`/services/${slug}/${e.country.toLowerCase().replace(/\s+/g, "-")}/`}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg"
          >
            <img
              src={`/site-assets/${e.code}.svg`}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-7 w-10 flex-none rounded-sm object-cover shadow-sm"
            />

            <span>
              <span className="block font-bold text-neutral-950">{e.country}</span>
              <span className="block text-sm text-neutral-500">{e.note}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Two opposing marquee columns of country cards linking to the
 * location-specific version of this service.
 */
export default function GlobalFlags({ entries, slug }: { entries: FlagEntry[]; slug: string }) {
  const half = Math.ceil(entries.length / 2);
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Row entries={entries.slice(0, half)} dir="up" slug={slug} />
      <Row entries={entries.slice(half)} dir="down" slug={slug} />
      <style>{`
        @keyframes uj-marquee-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
        @keyframes uj-marquee-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
        @media (prefers-reduced-motion: reduce){
          [style*="uj-marquee"]{animation:none !important}
        }
      `}</style>
    </div>
  );
}
