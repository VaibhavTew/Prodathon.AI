"use client";

import { useEffect, useState } from "react";

/**
 * Sticky in-page tab bar that sits under the site header and highlights the
 * section currently in view. Scrolls horizontally on small screens.
 */
export default function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // A thin band just below the sticky bars: whichever section crosses it is "current".
      { rootMargin: "-140px 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 border-b border-line bg-ink/85 backdrop-blur-xl sm:top-[72px]"
    >
      <div className="container">
        <ul className="-mx-1 flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "true" : undefined}
                className={`block rounded-full px-4 py-2 text-sm font-medium transition ${
                  active === i.id ? "bg-accent/10 text-accent" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
