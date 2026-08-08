import { useEffect, useRef } from "react";

const AD_KEY = "d671d4b77224cce9cc7de327793a1444";

/** Native banner ad slot (effectivecpmnetwork invoke.js). */
export default function AdSlot({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || host.dataset.loaded === "1") return;
    host.dataset.loaded = "1";
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = `https://pl27907607.effectivecpmnetwork.com/${AD_KEY}/invoke.js`;
    host.appendChild(s);
  }, []);
  return (
    <div ref={ref} className={className}>
      <div id={`container-${AD_KEY}`} />
    </div>
  );
}
