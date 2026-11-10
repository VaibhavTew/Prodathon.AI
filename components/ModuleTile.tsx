import Link from "next/link";
import type { Workshop } from "@/lib/types";
import { formatPrice } from "@/lib/format";

/**
 * Reusable workshop "banner" tile. Add new modules in /admin → Workshops —
 * every tile, grid and detail page picks them up automatically.
 */
export default function ModuleTile({ w, currency, index = 0 }: { w: Workshop; currency: string; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-800 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow">
      <Link href={`/workshops/${w.slug}`} className="absolute inset-0 z-10" aria-label={`${w.title} — details`} />
      <div className="relative aspect-[16/9] overflow-hidden">
        {w.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={w.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <TileArt seed={index} title={w.title} />
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-500" /> Live on Zoom
          </span>
          {w.tag && <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">{w.tag}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-accent">{w.level}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug">{w.title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{w.duration}</p>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-zinc-400">{w.tagline}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="font-display">
            <span className="text-2xl font-bold text-white">{formatPrice(w.price, currency)}</span>
            {w.compareAtPrice && w.compareAtPrice > w.price && (
              <span className="ml-2 text-sm text-zinc-500 line-through">{formatPrice(w.compareAtPrice, currency)}</span>
            )}
          </p>
          {w.emiPerMonth && <p className="-mt-1 text-xs text-zinc-400">or {formatPrice(w.emiPerMonth, currency)}/month EMI</p>}
          <Link href={`/enroll/${w.slug}`} className="btn-primary btn-sm relative z-20">
            Enroll →
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Generated cover art when a workshop has no image — unique per tile, on-brand. */
function TileArt({ seed, title }: { seed: number; title: string }) {
  const variants = [
    "radial-gradient(circle at 20% 30%, rgba(91,61,245,.40), transparent 45%), radial-gradient(circle at 85% 80%, rgba(236,72,153,.22), transparent 50%)",
    "radial-gradient(circle at 80% 20%, rgba(139,92,246,.45), transparent 40%), linear-gradient(160deg, #EEF0FF, #E4E6F5)",
    "conic-gradient(from 210deg at 70% 60%, rgba(91,61,245,.35), transparent 30%, transparent 70%, rgba(14,165,233,.25))",
    "radial-gradient(ellipse at 50% 120%, rgba(91,61,245,.45), transparent 60%)",
  ];
  const initials = title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="relative h-full w-full bg-ink-700" style={{ backgroundImage: variants[seed % variants.length] }} aria-hidden>
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:none]" />
      <span className="absolute bottom-2 right-4 font-display text-[5.5rem] font-bold leading-none text-white/10 transition duration-500 group-hover:text-white/20">
        {initials}
      </span>
    </div>
  );
}
