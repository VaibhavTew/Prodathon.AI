import type { TeamMember } from "@/lib/types";

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/** Profile card for the About page: gradient header, overlapping photo, stats, companies, education and AI expertise. */
export default function TeamCard({ m }: { m: TeamMember }) {
  const companies = m.companies ?? [];
  const stats = [
    m.experience && { k: m.experience, v: "Years of experience" },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      {/* Header band */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#fff]/20 blur-2xl" />
        {m.tag && (
          <span className="absolute left-6 top-5 inline-flex items-center gap-1.5 rounded-full bg-ink-800/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-accent shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
            {m.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-7 sm:px-8">
        {/* Photo + identity */}
        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-ink-700 shadow-[0_10px_30px_-10px_rgba(91,61,245,.55)] ring-[5px] ring-ink-800">
            {m.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.image} alt={`${m.name}, ${m.role}`} className="h-full w-full scale-[1.06] object-cover object-[50%_20%]" loading="lazy" />
            ) : (
              <div className="grid h-full w-full place-items-center font-display text-4xl font-bold text-accent">{initials(m.name)}</div>
            )}
          </div>
          <div className="pb-1">
            <h3 className="text-2xl font-bold leading-tight sm:text-[1.7rem]">{m.name}</h3>
            <p className="mt-1 text-sm font-semibold text-accent">{m.role}</p>
          </div>
        </div>

        {/* Stats */}
        <dl className={`mt-6 grid divide-x divide-line overflow-hidden rounded-2xl border border-line bg-ink-900/70 ${stats.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {stats.map((s) => (
            <div key={s.v} className="px-3 py-3.5 text-center">
              <dt className="sr-only">{s.v}</dt>
              <dd>
                <span className="block bg-gradient-to-r from-[#5B3DF5] to-[#EC4899] bg-clip-text font-display text-2xl font-extrabold text-transparent sm:text-[1.7rem]">
                  {s.k}
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-zinc-500">{s.v}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[15px] leading-relaxed text-zinc-300">{m.bio}</p>

        {/* Companies */}
        {companies.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-zinc-500">Experience at</p>
            <ul className={`mt-3 grid gap-2.5 ${companies.length > 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
              {companies.map((c) => (
                <li
                  key={c.name}
                  className="flex h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-ink-800 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
                >
                  {c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logo} alt="" className="h-9 w-full object-contain" loading="lazy" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent/15 to-[#EC4899]/15 font-display text-base font-bold text-accent">
                      {c.name[0].toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-full truncate text-xs font-semibold text-zinc-300">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {m.education && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-accent/30 bg-accent/[.04] px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c3 2 9 2 12 0v-5" />
              </svg>
            </span>
            <p className="text-sm">
              <span className="text-[11px] font-bold uppercase tracking-[.14em] text-zinc-500">Education</span>
              <span className="ml-2 font-semibold text-white">{m.education}</span>
            </p>
          </div>
        )}

        {/* AI expertise */}
        {m.highlights && m.highlights.length > 0 && (
          <div className="mt-auto pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-zinc-500">AI expertise</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {m.highlights.map((h) => (
                <li key={h} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <path d="M8 0Q8.6 6.4 16 8Q8.6 9.6 8 16Q7.4 9.6 0 8Q7.4 6.4 8 0Z" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
