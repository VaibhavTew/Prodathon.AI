"use client";

import { useState, type ReactNode } from "react";

/**
 * Shows the first `initial` items. The rest are behind a fade-out overlay with a
 * centered "See full …" link; once expanded, a "See less" button collapses it again.
 */
export default function ShowMore({
  items,
  initial = 6,
  className,
  label = "See full curriculum",
}: {
  items: ReactNode[];
  initial?: number;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const collapsible = items.length > initial;
  const collapsed = collapsible && !open;

  return (
    <div className="relative">
      <ol className={className}>{collapsed ? items.slice(0, initial) : items}</ol>

      {collapsed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-56 items-end justify-center bg-gradient-to-b from-transparent via-ink/80 to-ink pb-6">
          <button
            type="button"
            aria-expanded={false}
            onClick={() => setOpen(true)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold text-white transition hover:text-accent"
          >
            {label}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}

      {collapsible && open && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            aria-expanded
            onClick={() => {
              setOpen(false);
              document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold text-zinc-300 transition hover:text-accent"
          >
            See less
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
