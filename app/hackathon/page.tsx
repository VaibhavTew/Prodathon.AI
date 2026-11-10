import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { getProgress } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import RegisterForm from "@/components/RegisterForm";
import Reveal from "@/components/Reveal";
import SectionNav from "@/components/SectionNav";
import { Check, FAQ, NudgeBox, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Hackathon — Free AI Hackathon for Students",
  description: "Format, eligibility, prizes, rules and FAQ for the Prodathon AI hackathon. Registration is free.",
};

const SECTIONS = [
  { id: "register", label: "Register" },
  { id: "format", label: "Format" },
  { id: "prizes", label: "Prizes" },
  { id: "rules", label: "Eligibility & rules" },
  { id: "faq", label: "FAQ" },
];

// Clears the sticky site header (64/72px) + section nav (~52px) when jumping to an anchor.
const ANCHOR = "scroll-mt-32 sm:scroll-mt-36";

export default async function HackathonPage() {
  const [content, progress] = await Promise.all([getContent(), getProgress()]);
  const h = content.hackathon;
  // "₹2,00,000 — Grand prize" → "₹2,00,000" for the hero fact strip.
  const topPrize = h.prizes[0]?.reward.split(" — ")[0];

  const facts = [
    { label: "Date", value: h.dateLabel },
    ...(topPrize ? [{ label: "Top prize", value: topPrize }] : []),
    { label: "Entry", value: "Free" },
    { label: "Open to", value: "Any college student" },
  ];

  return (
    <>
      <PageHero
        eyebrow={`The Hackathon · ${h.dateLabel}`}
        title={<>One sprint. One AI build. <span className="text-gradient">Your demo in front of real judges.</span></>}
        sub="Free for every college student. Bring an idea, or don't — themes drop at kickoff. Build a working AI product and demo it to real judges."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#register" className="btn-primary py-4 text-base">Register for the Hackathon — Free</a>
          <a href="#prizes" className="btn-ghost py-4 text-base">See the prizes</a>
        </div>
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-ink-800 px-4 py-3">
              <dt className="text-xs uppercase tracking-[.16em] text-zinc-500">{f.label}</dt>
              <dd className="mt-1 font-display font-semibold text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <SectionNav items={SECTIONS} />

      {/* Banner */}
      <section className="pt-8 sm:pt-12">
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hackathon-banner.svg"
            alt="Prodathon — the AI hackathon for college students. ₹2,00,000 first prize, ₹50,000 second prize, certificates for every participant."
            width={1600}
            height={600}
            decoding="async"
            fetchPriority="high"
            className="h-auto w-full rounded-[1.25rem] border border-line shadow-glow sm:rounded-[2rem]"
          />
        </div>
      </section>

      {/* Register + progress. On mobile the form comes straight after the heading. */}
      <section className={`section ${ANCHOR}`} id="register">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-x-16">
          <div className="lg:col-start-1 lg:row-start-1">
            <SectionHeading eyebrow="Free registration" title="Lock your spot." sub="Four fields. No fee. You'll be first to get dates and rules." />
          </div>
          <Reveal delay={100} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[2rem] border border-accent/30 bg-ink-800 p-6 shadow-glow sm:p-8">
              <p className="eyebrow">100% free</p>
              <h2 className="mt-2 text-3xl font-bold">Register for Prodathon</h2>
              <div className="mt-6"><RegisterForm source="hackathon-page" /></div>
            </div>
          </Reveal>
          <Reveal className="lg:col-start-1 lg:row-start-2"><ProgressBar data={progress} /></Reveal>
        </div>
      </section>

      {/* Format */}
      <section className={`section border-t border-line ${ANCHOR}`} id="format">
        <div className="container">
          <SectionHeading eyebrow="Format" title="How the hackathon runs" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {h.format.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="card h-full p-6">
                  <span className="font-display text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-zinc-400">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes — full width so the headline prize gets room */}
      <section className={`section border-t border-line bg-ink-900 ${ANCHOR}`} id="prizes">
        <div className="container">
          <SectionHeading eyebrow="Prizes" title="What you're playing for" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {h.prizes.map((p, i) => (
              <Reveal key={p.place} delay={i * 60}>
                <div
                  className={`flex h-full flex-col rounded-3xl border p-6 sm:p-7 ${
                    i === 0 ? "border-accent/50 bg-accent/[.07] shadow-glow" : "border-line bg-ink-800/70"
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl font-display text-base font-bold ${
                      i === 0 ? "bg-accent text-ink-800" : "bg-white/5 text-white"
                    }`}
                  >
                    {p.place}
                  </span>
                  <p className={`mt-5 font-display font-bold text-white ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{p.reward}</p>
                  {p.note && <p className="mt-2 text-zinc-400">{p.note}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility + rules side by side */}
      <section className={`section border-t border-line ${ANCHOR}`} id="rules">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Who can participate" title="If you're a student, you're in." />
            <Reveal><ul className="mt-8 space-y-3 text-lg text-zinc-300">{h.eligibility.map((e) => <Check key={e}>{e}</Check>)}</ul></Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Rules" title="Keep it fair. Keep it real." />
            <Reveal>
              <ol className="mt-8 divide-y divide-line rounded-3xl border border-line bg-ink-800/60">
                {h.rules.map((r, i) => (
                  <li key={i} className="flex gap-4 p-5 text-zinc-300">
                    <span className="font-display font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {r}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ — heading + CTAs stay pinned beside the questions on desktop */}
      <section className={`section border-t border-line bg-ink-900 ${ANCHOR}`} id="faq">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" sub="Still stuck? Register anyway — you'll get the full rulebook before kickoff." />
            <a href="#register" className="btn-primary mt-8">Register for the Hackathon — Free</a>
          </div>
          <Reveal><FAQ items={h.faq} /></Reveal>
        </div>
        <div className="container mt-12">
          <NudgeBox title="New to AI tools? Our live workshops build the skills →" body="Optional, paid training with a real instructor. Learn the tools and build a project you can keep. Registration and judging are the same for everyone." />
        </div>
      </section>
    </>
  );
}
