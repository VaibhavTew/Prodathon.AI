"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProgressData } from "@/lib/progress";

/**
 * Animated registration progress bar. Fills when it enters the viewport and
 * counts the % up. Data comes from /admin → Progress (see lib/progress.ts).
 */
export default function ProgressBar({
  data,
  variant = "full",
  className = "",
}: {
  data: ProgressData;
  variant?: "full" | "compact";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Server HTML shows the real % (crawlers, link previews, slow phones never see "0%").
  const [shown, setShown] = useState(data.percent);
  const reduce = useRef(false);

  // Before first client paint: rewind to 0 so the bar can fill up when scrolled into view.
  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce.current) setShown(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce.current) return setShown(data.percent);
    // Only the bar animates (CSS width transition). The label always shows the real number,
    // so nobody ever catches a "0% to launch" frame mid-animation.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(data.percent);
        io.disconnect();
      }
    });
    io.observe(el);
    // Safety net: if the observer never fires (throttled tab, odd browser), fill anyway.
    const t = window.setTimeout(() => setShown(data.percent), 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [data.percent]);

  const label = data.label;
  const compact = variant === "compact";

  return (
    <div ref={ref} className={`${compact ? "" : "card p-5 sm:p-6"} ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Registrations live
          </p>
          <p className={`mt-1.5 font-display font-bold text-white ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`} aria-live="polite">
            {label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[.16em] text-zinc-500">Event date</p>
          <p className="mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            {data.dateLabel}
          </p>
        </div>
      </div>

      <div
        className="relative mt-4 h-3.5 overflow-hidden rounded-full bg-white/[.07] sm:h-4"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={data.percent}
        aria-label="Registration progress toward launch"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-soft shadow-[0_0_20px_rgba(91,61,245,.35)]"
          style={{ width: `${shown}%`, transition: "width 1.4s cubic-bezier(.2,.7,.2,1)" }}
        >
          <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-[rgba(255,255,255,.5)] to-transparent" />
        </div>
        {[25, 50, 75].map((m) => (
          <span key={m} className="absolute top-0 h-full w-px bg-ink/60" style={{ left: `${m}%` }} aria-hidden />
        ))}
      </div>

      <p className="mt-3 text-sm text-zinc-400">
        <span className="text-accent">↗</span> {data.momentum}
      </p>
    </div>
  );
}
