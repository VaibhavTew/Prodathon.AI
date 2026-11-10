import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import ModuleTile from "@/components/ModuleTile";
import Reveal from "@/components/Reveal";
import { Check } from "@/components/ui";

export const metadata: Metadata = { title: "You're in!", robots: { index: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const content = await getContent();
  const workshops = content.workshops.filter((w) => w.published);
  const first = (name || "").slice(0, 40);
  const starter = workshops[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="container relative py-16 text-center sm:py-24">
          <Reveal>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl font-bold text-ink shadow-glow">✓</div>
            <h1 className="h-display mt-8">You&apos;re in{first ? `, ${first}` : ""}!</h1>
            <p className="lead mx-auto mt-5 max-w-xl">
              Your free hackathon spot is locked. Check your inbox — we&apos;ll email you the moment dates drop.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-accent/40 bg-ink-800/80 p-6 text-left sm:p-8">
              <p className="eyebrow">Now get ready to win</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Registered is step one. Ready is step two.</h2>
              <p className="mt-3 text-zinc-300">
                The teams that place don&apos;t learn the tools during the hackathon. They walk in knowing them. Our live Zoom workshops get you there:
              </p>
              <ul className="mt-5 grid gap-2.5 text-zinc-200 sm:grid-cols-2">
                <Check>Live instructor, real-time help</Check>
                <Check>A built project before day one</Check>
                <Check>Certificate of completion</Check>
                <Check>A real shot at the podium</Check>
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/workshops" className="btn-primary">See workshops →</Link>
                {starter && <Link href={`/enroll/${starter.slug}`} className="btn-ghost">Start with {starter.title}</Link>}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h-section">Pick your edge</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workshops.map((w, i) => (
              <Reveal key={w.slug} delay={i * 80}><ModuleTile w={w} currency={content.site.currency} index={i} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
