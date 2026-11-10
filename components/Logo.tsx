import Link from "next/link";
import { useId } from "react";

/**
 * Prodathon mark: a bold, forward-leaning "P" launched by a rocket trail
 * (learn → build → launch). Keep in sync with app/icon.svg (favicon).
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3F22D1" />
          <stop offset=".55" stopColor="#5B3DF5" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset=".45" stopColor="#A855F7" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        transform="translate(9 1) skewX(-14)"
        fill={`url(#${id}p)`}
        fillRule="evenodd"
        d="M6 7H21A11 11 0 0 1 21 29H15.5V41H6Z M15.5 14.5H20.5A3.75 3.75 0 0 1 20.5 22H15.5Z"
      />
      <path
        d="M1 45.5Q31 41 38.5 15L42.5 16.5Q36 43.5 1 45.5Z"
        fill={`url(#${id}t)`}
        stroke="#fff"
        strokeWidth="2.2"
        paintOrder="stroke"
        strokeLinejoin="round"
      />
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <g transform="translate(41.5 10.5) rotate(25)">
          <path d="M0 -8.5C3.6 -5.2 3.6 1.8 2.7 5H-2.7C-3.6 1.8 -3.6 -5.2 0 -8.5Z" fill="#EC4899" stroke="#fff" strokeWidth="1.8" paintOrder="stroke" />
          <path d="M-2.7 1.2L-5.4 6.4L-2.7 5Z M2.7 1.2L5.4 6.4L2.7 5Z" fill="#A855F7" />
          <circle cy="-2" r="1.5" fill="#fff" />
        </g>
      </g>
    </svg>
  );
}

/** "PRODATHON" with the A drawn as a crossbar-less peak (Λ) in the brand gradient. */
export function Wordmark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`inline-flex items-center font-display font-extrabold uppercase leading-none tracking-[.14em] text-white ${className}`}>
      PROD
      <svg viewBox="0 0 20 20" className="mx-[.06em] h-[.74em] w-[.78em]" aria-hidden>
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#5B3DF5" />
            <stop offset=".6" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path d="M0 20L7.4 0H12.6L20 20H15.2L10 5.6L4.8 20Z" fill={`url(#${id}a)`} />
        <path d="M10 13L12.2 19.5H7.8Z" fill="#EC4899" />
      </svg>
      THON
    </span>
  );
}

export default function Logo({ className = "", tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Prodathon home">
      <LogoMark className="h-10 w-10" />
      <span className="flex flex-col gap-1.5">
        <Wordmark className="text-[1.15rem]" />
        {tagline && <span className="text-[11px] font-medium tracking-wide text-zinc-500">Learn product. Build with AI. Compete.</span>}
      </span>
    </Link>
  );
}
