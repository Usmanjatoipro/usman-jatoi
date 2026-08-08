import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProcessStep = { n: string; t: string; d: string };

/**
 * Horizontal snap slider for the process steps, with prev/next arrows and dots.
 */
export default function ProcessSlider({ steps }: { steps: ProcessStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    const card = el.children[clamped] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, idx) => {
        const d = Math.abs(c.offsetLeft - el.offsetLeft - left);
        if (d < bestD) {
          bestD = d;
          best = idx;
        }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((p) => (
          <article
            key={p.n}
            className="group w-[85%] shrink-0 snap-start rounded-3xl border border-neutral-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-neutral-300 sm:w-[48%] lg:w-[31.5%]"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Step {p.n}
            </span>
            <h3 className="mt-5 text-xl font-bold text-neutral-950">{p.t}</h3>
            <p className="mt-2 leading-relaxed text-neutral-600">{p.d}</p>
            <span className="mt-6 block h-1 w-12 rounded-full bg-[#FF6A00] transition-all group-hover:w-20" />
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <button
              key={s.n}
              aria-label={`Go to step ${s.n}`}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-7 bg-[#FF6A00]" : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Previous step"
            onClick={() => scrollTo(active - 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next step"
            onClick={() => scrollTo(active + 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition hover:bg-neutral-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
