import silkDark from "@/assets/silk-dark.jpg.asset.json";
import silkLight from "@/assets/silk-light.jpg.asset.json";

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function serviceCoverUrl(slug: string) {
  return hash(slug) % 2 === 0 ? silkDark.url : silkLight.url;
}

/**
 * Auto-composed featured image for a service card: alternating black / white
 * silk template + the service name, an orange accent rule and the site mark.
 */
export default function ServiceCover({
  title,
  kicker,
  slug,
  eager = false,
}: {
  title: string;
  kicker?: string;
  slug: string;
  eager?: boolean;
}) {
  const dark = hash(slug) % 2 === 0;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <img
        src={dark ? silkDark.url : silkLight.url}
        alt={`${title} services by Usman Jatoi — cover image`}
        width={1536}
        height={864}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div
        className={`relative flex h-full flex-col justify-end p-5 ${
          dark ? "text-white" : "text-neutral-900"
        }`}
      >
        {kicker && (
          <span
            className={`mb-2 w-fit rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${
              dark ? "border-white/50 text-white/80" : "border-neutral-900/40 text-neutral-700"
            }`}
          >
            {kicker}
          </span>
        )}
        <span className="text-[clamp(20px,2.4vw,28px)] font-black leading-tight tracking-tight">
          {title}
        </span>
        <span className="mt-3 block h-1 w-14 rounded-full bg-[#ff6a00]" />
      </div>
      <img
        src="/site-assets/cropped-Imagee-Character-2-192x192.webp"
        alt=""
        aria-hidden
        width={32}
        height={32}
        loading="lazy"
        decoding="async"
        className="absolute right-4 top-4 h-8 w-8 rounded-full"
      />
    </div>
  );
}
