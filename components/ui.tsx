import Link from "next/link";
import type { ReactNode } from "react";
import type { FAQItem } from "@/lib/types";
import Reveal from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h-section mt-3">{title}</h2>
      {sub && <p className="lead mt-4">{sub}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      <div className="container relative py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.08] sm:text-5xl">{title}</h1>
        {sub && <p className="lead mt-5 max-w-2xl">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-ink-800/60">
      {items.map((f) => (
        <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-white">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-accent transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-zinc-400">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Optional cross-sell box linking to workshops. */
export function NudgeBox({ title = "Want to learn AI tools live?", body, cta = "See live workshops →" }: { title?: string; body?: string; cta?: string }) {
  return (
    <Reveal>
      <Link
        href="/workshops"
        className="group relative block overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 via-ink-800 to-ink-800 p-6 transition hover:border-accent sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <p className="eyebrow">Live on Zoom</p>
        <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h3>
        <p className="mt-2 max-w-xl text-zinc-300">
          {body ?? "Optional, instructor-led workshops for anyone who wants to go deeper. Learn practical AI tools and build a project you keep."}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-semibold text-accent">
          {cta}
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </Reveal>
  );
}

export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-xs text-accent" aria-hidden>✓</span>
      <span>{children}</span>
    </li>
  );
}
