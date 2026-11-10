import Link from "next/link";
import type { Content, Logo as LogoT } from "@/lib/types";
import type { ProgressData } from "@/lib/progress";
import Reveal from "./Reveal";
import ProgressBar from "./ProgressBar";
import RegisterForm from "./RegisterForm";
import { SectionHeading, Check } from "./ui";

// ---------------- How it works ----------------

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Register free",
      body: "Lock your spot at the hackathon in 30 seconds. Zero cost, zero catch.",
      cta: { href: "/hackathon#register", label: "Register" },
    },
    {
      n: "02",
      title: "Level up live (optional)",
      body: "Want to learn first? Join a live Zoom workshop, pick up practical AI tools, and build alongside an instructor. Totally optional.",
      cta: { href: "/workshops", label: "See workshops" },
      highlight: true,
    },
    {
      n: "03",
      title: "Build & compete",
      body: "Show up ready. Ship a real AI product, demo it to judges, and compete for prizes.",
      cta: { href: "/hackathon", label: "Hackathon details" },
    },
  ];
  return (
    <section className="section" id="how">
      <div className="container">
        <SectionHeading eyebrow="How it works" title={<>Three steps from sign-up to <span className="text-accent">demo day</span>.</>} />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                  s.highlight ? "border-accent/60 bg-gradient-to-b from-accent/[.12] to-ink-800 shadow-glow" : "border-line bg-ink-800/70"
                }`}
              >
                {s.highlight && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                    Learn with an instructor
                  </span>
                )}
                <span className={`font-display text-5xl font-bold ${s.highlight ? "text-accent" : "text-white/15"}`}>{s.n}</span>
                <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-zinc-400">{s.body}</p>
                <Link href={s.cta.href} className="mt-6 text-sm font-semibold text-accent hover:underline">
                  {s.cta.label} →
                </Link>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------- Social proof ----------------

function LogoChip({ l }: { l: LogoT }) {
  const inner = l.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={l.image} alt={l.name} className="max-h-10 w-auto max-w-[140px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
  ) : (
    <span className="font-display text-lg font-semibold text-zinc-300">{l.name}</span>
  );
  const cls = "flex h-24 items-center justify-center rounded-2xl border border-line bg-ink-800/60 px-6 text-center";
  return l.url ? (
    <a href={l.url} target="_blank" rel="noopener noreferrer" className={cls} title={l.name}>{inner}</a>
  ) : (
    <div className={cls} title={l.name}>{inner}</div>
  );
}

/** Logo wall that never looks empty: 0 → invite card, 1–5 → grid + "you next?" tile, 6+ → marquee. */
function LogoWall({
  title,
  logos,
  inviteHref,
  inviteLabel,
  emptyText,
}: {
  title: string;
  logos: LogoT[];
  inviteHref: string;
  inviteLabel: string;
  emptyText: string;
}) {
  if (logos.length === 0) {
    return (
      <Link href={inviteHref} className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-dashed border-white/15 p-6 transition hover:border-accent sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-zinc-500">{title}</p>
          <p className="mt-1 font-display text-xl font-semibold text-white">{emptyText}</p>
        </div>
        <span className="font-semibold text-accent">{inviteLabel} <span className="inline-block transition group-hover:translate-x-1">→</span></span>
      </Link>
    );
  }
  if (logos.length >= 6) {
    return (
      <div>
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[.16em] text-zinc-500">{title}</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((l, i) => (
              <div key={i} className="w-48 shrink-0" aria-hidden={i >= logos.length}><LogoChip l={l} /></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-zinc-500">{title}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {logos.map((l) => <LogoChip key={l.name} l={l} />)}
        <Link href={inviteHref} className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 text-center text-sm font-semibold text-zinc-400 transition hover:border-accent hover:text-accent">
          {inviteLabel} →
        </Link>
      </div>
    </div>
  );
}

export function SocialProof({ content, progress }: { content: Content; progress: ProgressData }) {
  const { colleges, sponsors, testimonials, workshops } = content;
  const stats = [
    { k: `${progress.percent}%`, v: "to launch goal" },
    colleges.length >= 5 ? { k: `${colleges.length}+`, v: "partner colleges" } : { k: "Any", v: "college can join" },
    { k: String(workshops.filter((w) => w.published).length), v: "live workshops" },
    { k: "₹0", v: "to compete. Ever." },
  ];
  if (content.site.currency !== "INR") stats[3].k = "$0";

  return (
    <section className="section border-y border-line bg-ink-900" id="proof">
      <div className="container">
        <SectionHeading eyebrow="The movement" title="Students are already lining up." />
        <Reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.v} className="bg-ink-900 p-6 sm:p-8">
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">{s.k}</p>
              <p className="mt-1 text-sm text-muted">{s.v}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 grid gap-6">
          <Reveal><LogoWall title="Partner colleges" logos={colleges} inviteHref="/colleges" inviteLabel="Your college next?" emptyText="Bring Prodathon to your campus as a founding college partner." /></Reveal>
          <Reveal><LogoWall title="Sponsors & supporters" logos={sponsors} inviteHref="/sponsors" inviteLabel="Become a sponsor" emptyText="Put your brand in front of India's next AI builders." /></Reveal>
        </div>

        {testimonials.length === 1 && (
          <Reveal className="mt-10">
            <figure className="card relative overflow-hidden p-8 sm:p-12">
              <span className="absolute -top-6 right-6 font-display text-[10rem] leading-none text-accent/10" aria-hidden>“</span>
              <blockquote className="relative max-w-3xl font-display text-2xl font-medium leading-snug text-white sm:text-3xl">
                “{testimonials[0].quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted">
                <span className="font-semibold text-white">{testimonials[0].name}</span> · {testimonials[0].role}
              </figcaption>
            </figure>
          </Reveal>
        )}
        {testimonials.length > 1 && (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 80}>
                <figure className="card flex h-full flex-col p-7">
                  <blockquote className="flex-1 leading-relaxed text-zinc-200">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-sm">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 font-semibold text-accent">{t.name[0]}</span>
                    )}
                    <span><span className="block font-semibold text-white">{t.name}</span><span className="text-muted">{t.role}</span></span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------- Why Prodathon / value gap ----------------

export function WhyProdathon() {
  const rows: [string, boolean, boolean][] = [
    ["Compete in the hackathon", true, true],
    ["Participation certificate", true, true],
    ["Live instruction from a real AI builder", false, true],
    ["A working project built before day one", false, true],
    ["Your questions answered live, bugs fixed live", false, true],
    ["Workshop completion certificate", false, true],
    ["Skills you keep after the hackathon", false, true],
  ];
  return (
    <section className="section" id="why">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Why Prodathon"
            title={<>Competing is free. <span className="text-gradient">Learning live</span> is optional.</>}
            sub="The hackathon is free and judged the same for everyone. If you want to go deeper, our workshops teach practical AI skills with a real instructor. You keep the project, the certificate and the skills, whether or not you compete."
          />
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <Link href="/workshops" className="btn-primary">Explore workshops →</Link>
            <Link href="/hackathon#register" className="btn-ghost">Just register free</Link>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl border border-line">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line bg-ink-800 px-5 py-4 text-xs font-semibold uppercase tracking-[.14em] sm:gap-x-8 sm:px-6">
              <span className="text-zinc-500">What you get</span>
              <span className="w-14 text-center text-zinc-400">Free</span>
              <span className="w-24 whitespace-nowrap text-center text-accent">+ Workshop</span>
            </div>
            <ul>
              {rows.map(([label, free, paid]) => (
                <li key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line px-5 py-4 last:border-0 sm:gap-x-8 sm:px-6">
                  <span className="text-[15px] text-zinc-200">{label}</span>
                  <span className="w-14 text-center">{free ? <span className="text-zinc-300">✓</span> : <span className="text-zinc-600">—</span>}</span>
                  <span className="w-24 text-center">{paid && <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-ink">✓</span>}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------- Final CTA band ----------------

export function CTABand({ progress, withForm = true }: { progress: ProgressData; withForm?: boolean }) {
  return (
    <section className="section relative overflow-hidden" id="join">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(ellipse_at_bottom,rgba(91,61,245,.12),transparent_65%)]" />
      <div className="container relative">
        <div className="grid items-start gap-10 rounded-[2rem] border border-line bg-ink-800/80 p-6 backdrop-blur sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="eyebrow">Free registration</p>
            <h2 className="h-section mt-3">Your spot is free. <br className="hidden sm:block" />The goal isn&apos;t far.</h2>
            <p className="lead mt-4">Dates drop the moment we hit 100%. Register now and you&apos;re first in line — for the hackathon and for workshop seats.</p>
            <ul className="mt-6 space-y-2.5 text-zinc-300">
              <Check>100% free to register and compete</Check>
              <Check>Solo or teams of up to 4</Check>
              <Check>Beginner-friendly — any branch, any year</Check>
            </ul>
            <ProgressBar data={progress} className="mt-8" />
          </div>
          {withForm ? (
            <div className="rounded-3xl border border-line bg-ink p-5 sm:p-7">
              <h3 className="text-xl font-bold">Lock your spot in 30 seconds</h3>
              <div className="mt-5"><RegisterForm source="cta-band" /></div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:pt-12">
              <Link href="/hackathon#register" className="btn-primary py-4 text-base">Register for the Hackathon — Free</Link>
              <Link href="/workshops" className="btn-ghost py-4 text-base">Explore Workshops</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
