import Link from "next/link";
import { getContent } from "@/lib/store";
import { getProgress } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import ModuleTile from "@/components/ModuleTile";
import Reveal from "@/components/Reveal";
import HackathonBanner from "@/components/HackathonBanner";
import { SectionHeading } from "@/components/ui";
import { CTABand, HowItWorks, SocialProof, WhyProdathon } from "@/components/sections";

export default async function Home() {
  const [content, progress] = await Promise.all([getContent(), getProgress()]);
  const workshops = content.workshops.filter((w) => w.published);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/[.16] blur-3xl" />
        <div className="container relative grid gap-12 pb-20 pt-12 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-28">
          {/* Above the fold: rendered immediately (no Reveal) so the headline and CTA paint on first frame. */}
          <div>
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-ink-800 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <span className="rounded-full bg-accent px-2 py-0.5 font-bold text-ink">FREE</span>
              The AI hackathon for college students
            </p>
            <h1 className="h-display mt-6">
              Build something <span className="text-gradient">real</span> with AI.
              <br />
              Compete to win.
            </h1>
            <p className="lead mt-6 max-w-xl">
              Prodathon is a free, online AI hackathon for students of any branch, any year. Join for free, sharpen your skills in live
              workshops, and ship a project you can actually show off.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/hackathon#register" className="btn-primary py-3.5 text-[15px]">
                Register for the Hackathon — Free
              </Link>
              <Link href="/workshops" className="btn-ghost py-3.5 text-[15px]">
                Explore Workshops
              </Link>
            </div>
            <p className="mt-5 text-sm text-zinc-500">No fee. No experience needed. 30-second sign-up.</p>
            <p className="mt-2 text-sm text-zinc-400">
              Not a student?{" "}
              <Link href="/workshops" className="font-semibold text-accent hover:underline">Our live AI workshops are open to professionals too →</Link>
            </p>
          </div>

          <div className="relative">
            <ProgressBar data={progress} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[.16em] text-zinc-500">Format</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">Online · Teams of 1–4</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[.16em] text-zinc-500">Prep</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{workshops.length} live workshops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="pb-4">
        <div className="container">
          <HackathonBanner dateLabel={content.hackathon.dateLabel} />
        </div>
      </section>

      <HowItWorks />

      {/* WORKSHOP MODULES */}
      <section className="section border-t border-line" id="workshops">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Live training modules"
              title={<>Learn AI skills that <span className="text-accent">outlast the hackathon</span>.</>}
              sub="Live on Zoom with a real instructor, open to students and professionals. Each workshop ends with a working project and a certificate."
            />
            <Reveal><Link href="/workshops" className="btn-ghost btn-sm shrink-0">All workshops →</Link></Reveal>
          </div>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3 xl:grid-cols-4">
            {workshops.map((w, i) => (
              <Reveal key={w.slug} delay={i * 80} className="w-[82%] shrink-0 snap-start sm:w-[55%] md:w-auto">
                <ModuleTile w={w} currency={content.site.currency} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SocialProof content={content} progress={progress} />
      <WhyProdathon />
      <CTABand progress={progress} />
    </>
  );
}
