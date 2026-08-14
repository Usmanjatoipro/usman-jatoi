import silkDark from "@/assets/silk-dark.jpg.asset.json";
import silkLight from "@/assets/silk-light.jpg.asset.json";

/** Stable hash so the same post always renders the same variant. */
export function coverVariant(seed: string): "dark" | "light" {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "dark" : "light";
}

export function coverImageUrl(seed: string) {
  return coverVariant(seed) === "dark" ? silkDark.url : silkLight.url;
}

/**
 * Auto-generated featured cover used when a post has no featured image.
 * Alternates black / white silk templates and composes the post's own data
 * (title, excerpt, categories) plus the site favicon over it.
 */
export default function PostCover({
  title,
  excerpt,
  categories = [],
  seed,
  className = "",
}: {
  title: string;
  excerpt?: string;
  categories?: string[];
  seed: string;
  className?: string;
}) {
  const dark = coverVariant(seed) === "dark";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      role="img"
      aria-label={`${title} — cover image`}
    >
      <img
        src={dark ? silkDark.url : silkLight.url}
        alt=""
        aria-hidden
        width={1536}
        height={864}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={`relative px-6 py-10 md:px-12 md:py-16 ${dark ? "text-white" : "text-neutral-900"}`}
      >
        <h2 className="max-w-3xl text-[clamp(26px,4.2vw,48px)] font-black leading-[1.08] tracking-tight">
          {title}
        </h2>
        {excerpt && (
          <p
            className={`mt-5 max-w-2xl text-sm leading-relaxed md:text-base ${
              dark ? "text-white/75" : "text-neutral-700"
            }`}
          >
            {excerpt.length > 180 ? `${excerpt.slice(0, 180)}…` : excerpt}
          </p>
        )}
        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium md:text-sm ${
                  dark ? "border-white/60" : "border-neutral-900/60"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <img
          src="/site-assets/cropped-Imagee-Character-2-192x192.webp"
          alt=""
          aria-hidden
          width={44}
          height={44}
          loading="lazy"
          className="absolute bottom-4 right-5 h-9 w-9 md:h-11 md:w-11"
        />
      </div>
    </div>
  );
}
