import Link from "next/link";
import Logo from "./Logo";
import type { Content } from "@/lib/types";

export default function Footer({ site }: { site: Content["site"] }) {
  const year = new Date().getFullYear();
  const cols = [
    {
      title: "Compete",
      links: [
        { href: "/hackathon", label: "The Hackathon" },
        { href: "/hackathon#register", label: "Register free" },
        { href: "/hackathon#faq", label: "FAQ" },
      ],
    },
    {
      title: "Learn",
      links: [
        { href: "/workshops", label: "All workshops" },
        { href: "/workshops#why", label: "Why train with us" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/colleges", label: "Partner with us" },
        { href: "/sponsors", label: "Sponsor us" },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-ink-900">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo tagline />
          <p className="mt-4 text-sm leading-relaxed text-muted">{site.tagline}</p>
          <a href={`mailto:${site.email}`} className="mt-5 inline-block text-sm font-medium text-white hover:text-accent">
            {site.email}
          </a>
          {site.phone && <p className="mt-1 text-sm text-muted">{site.phone}</p>}
          <ul className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-accent hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-zinc-500">{c.title}</h3>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-300 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-3 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
