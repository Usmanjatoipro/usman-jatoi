import { useEffect } from "react";

/** Cal.com inline booking embed (30 min). */
export default function CalEmbed({ className = "" }: { className?: string }) {
  useEffect(() => {
    const w = window as any;
    const init = () => {
      const C = w;
      const A = "https://app.cal.com/embed/embed.js";
      const L = "init";
      (function (C: any, A: string, L: string) {
        const p = function (a: any, ar: any) {
          a.q.push(ar);
        };
        const d = C.document;
        C.Cal =
          C.Cal ||
          function (this: any) {
            const cal = C.Cal;
            const ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api: any = function () {
                p(api, arguments);
              };
              const namespace = ar[1];
              api.q = api.q || [];
              if (typeof namespace === "string") {
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
              } else p(cal, ar);
              return;
            }
            p(cal, ar);
          };
      })(C, A, L);

      w.Cal("init", "30min", { origin: "https://app.cal.com" });
      w.Cal.ns["30min"]("inline", {
        elementOrSelector: "#my-cal-inline-30min",
        config: { layout: "month_view", theme: "dark" },
        calLink: "usman-jatoi-official/30min",
      });
      w.Cal.ns["30min"]("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };
    init();
  }, []);

  return (
    <div
      id="my-cal-inline-30min"
      className={className}
      style={{ width: "100%", minHeight: 620, overflow: "auto" }}
    />
  );
}
