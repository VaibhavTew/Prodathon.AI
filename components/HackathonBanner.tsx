import Link from "next/link";

/**
 * Homepage hackathon banner. Built in HTML (not an <img>) so it uses the site fonts,
 * reflows on mobile and has real, clickable CTAs. Animations respect prefers-reduced-motion
 * via the global rule in globals.css.
 */
export default function HackathonBanner({ dateLabel }: { dateLabel: string }) {
  return (
    <section
      aria-label="Prodathon — the AI hackathon for college students"
      className="relative isolate overflow-hidden rounded-[1.5rem] border border-accent/15 bg-gradient-to-br from-[#F4F2FF] via-[#FBF7FF] to-[#FFF1F7] shadow-glow sm:rounded-[2rem]"
    >
      {/* Background: grid + soft colour blobs */}
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(122,99,255,.40),transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,.28),transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(122,99,255,.22),transparent_65%)]" />

      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:p-14">
        {/* Copy */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-ink-800 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-accent">
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-[#EC4899]" />
              Free · Online · India
            </span>
            <span className="rounded-full bg-white/[.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-zinc-400">
              {dateLabel}
            </span>
          </div>

          <h2 className="mt-5 bg-gradient-to-r from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899] bg-clip-text font-display text-6xl font-extrabold leading-[.95] tracking-[-0.04em] text-transparent sm:text-7xl lg:text-8xl">
            Prodathon
          </h2>
          <p className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">The AI Hackathon for College Students</p>
          <p className="mt-2 text-lg text-muted">Build a real AI product. Demo it to judges. Win big.</p>

          {/* Prize chips */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            <li className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899] p-5 text-[#fff] shadow-glow">
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-[#fff]/25 to-transparent" />
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#fff]/85">
                <span aria-hidden>🏆</span> 1st prize
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold sm:text-[2rem]">₹2,00,000</p>
            </li>
            <li className="rounded-2xl border border-line bg-ink-800 p-5 shadow-[0_8px_24px_-12px_rgba(91,61,245,.25)]">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-accent">
                <span aria-hidden>🥈</span> 2nd prize
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-white sm:text-[2rem]">₹50,000</p>
            </li>
            <li className="rounded-2xl border border-line bg-ink-800 p-5 shadow-[0_8px_24px_-12px_rgba(91,61,245,.25)]">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-accent">
                <span aria-hidden>🎓</span> Every participant
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-white sm:text-[1.6rem]">Certificate</p>
            </li>
          </ul>

          {/* Facts */}
          <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-zinc-300">
            {["👥 Teams of 1–4", "🎓 Any branch, any year", "✅ 100% free to register"].map((f) => (
              <li key={f} className="rounded-full border border-line bg-ink-800/70 px-3 py-1.5">{f}</li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/hackathon#register" className="btn-primary py-3.5 text-[15px]">Register free →</Link>
            <Link href="/hackathon" className="btn-ghost py-3.5 text-[15px]">Prizes, rules &amp; format</Link>
          </div>
        </div>

        {/* Animated neural-network visual */}
        <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden>
          <div className="absolute right-0 top-0 z-10 grid h-20 w-20 animate-float place-items-center rounded-3xl bg-ink-800 text-4xl shadow-glow lg:h-24 lg:w-24 lg:text-5xl">
            🏆
          </div>
          <NetworkArt />
        </div>
      </div>
    </section>
  );
}

const IN = [[40, 60], [40, 200], [40, 340]] as const;
const MID = [[180, 120], [180, 220], [180, 320]] as const;
const OUT = [[320, 70], [320, 220], [320, 360]] as const;
const EDGES: [readonly [number, number], readonly [number, number]][] = [
  ...IN.flatMap((a) => MID.map((b) => [a, b] as [typeof a, typeof b])),
  ...MID.flatMap((a) => OUT.map((b) => [a, b] as [typeof a, typeof b])),
];
// A few edges carry a travelling "signal" dot, all converging on the highlighted output node.
const SIGNALS = [
  { path: "M40 60 L180 120 L320 220", dur: "3.2s", begin: "0s" },
  { path: "M40 200 L180 220 L320 220", dur: "2.6s", begin: "0.8s" },
  { path: "M40 340 L180 320 L320 220", dur: "3s", begin: "1.6s" },
  { path: "M40 200 L180 120 L320 70", dur: "3.4s", begin: "2.2s" },
];

function NetworkArt() {
  return (
    <svg viewBox="0 0 360 420" className="h-auto w-full">
      <defs>
        <linearGradient id="hb-brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5B3DF5" />
          <stop offset=".55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <radialGradient id="hb-halo">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity=".35" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke="#5B3DF5" strokeOpacity=".22" strokeWidth="1.5">
        {EDGES.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}
      </g>

      {SIGNALS.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill="none" stroke="url(#hb-brand)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 10" opacity=".7">
            <animate attributeName="stroke-dashoffset" from="64" to="0" dur="1.6s" repeatCount="indefinite" />
          </path>
          <circle r="5" fill="#EC4899">
            <animateMotion dur={s.dur} begin={s.begin} repeatCount="indefinite" path={s.path} />
          </circle>
        </g>
      ))}

      {/* Output halo */}
      <circle cx="320" cy="220" r="46" fill="url(#hb-halo)">
        <animate attributeName="r" values="34;50;34" dur="2.4s" repeatCount="indefinite" />
      </circle>

      <g fill="#FFFFFF" stroke="url(#hb-brand)" strokeWidth="3.5">
        {IN.map(([x, y]) => <circle key={`i${y}`} cx={x} cy={y} r="13" />)}
        {MID.map(([x, y]) => <circle key={`m${y}`} cx={x} cy={y} r="17" />)}
        {OUT.map(([x, y]) => <circle key={`o${y}`} cx={x} cy={y} r={y === 220 ? 22 : 13} />)}
      </g>
      <circle cx="320" cy="220" r="8" fill="url(#hb-brand)" />
    </svg>
  );
}
