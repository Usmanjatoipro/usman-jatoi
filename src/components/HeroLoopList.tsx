import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/**
 * Vertical looping highlight list: shows a window of items that scroll
 * bottom-to-top with a smooth fade, then loops forever.
 */
export default function HeroLoopList({
  items,
  visible = 3,
  interval = 2200,
  tone = "dark",
}: {
  items: string[];
  visible?: number;
  interval?: number;
  tone?: "dark" | "light";
}) {
  const [i, setI] = useState(0);
  const list = items.length ? items : ["Strategy", "Delivery", "Support"];

  useEffect(() => {
    if (list.length <= visible) return;
    const id = setInterval(() => setI((v) => (v + 1) % list.length), interval);
    return () => clearInterval(id);
  }, [list.length, visible, interval]);

  const window_ = Array.from({ length: Math.min(visible, list.length) }, (_, k) => ({
    text: list[(i + k) % list.length],
    key: `${(i + k) % list.length}-${k}`,
    k,
  }));

  return (
    <ul
      className="mt-7 space-y-3"
      style={{ minHeight: visible * 34 }}
      aria-label="Service highlights"
    >
      {window_.map((it) => (
        <li
          key={it.key}
          className="flex items-start gap-3 animate-[uj-loop-in_600ms_ease-out_both]"
          style={{ animationDelay: `${it.k * 90}ms` }}
        >
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40">
            <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />
          </span>
          <span
            className={
              tone === "dark"
                ? "text-[15px] leading-6 text-white/80"
                : "text-[15px] leading-6 text-neutral-700"
            }
          >
            {it.text}
          </span>
        </li>
      ))}
      <style>{`@keyframes uj-loop-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ul>
  );
}
