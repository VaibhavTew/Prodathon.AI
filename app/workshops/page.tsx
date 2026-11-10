import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import ModuleTile from "@/components/ModuleTile";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Live Programs & Workshops",
  description: "A 16-week Product Management Fellowship plus short live workshops on AI agents, Claude, MCP and POC development. Instructor-led on Zoom.",
};

export default async function WorkshopsPage() {
  const content = await getContent();
  const workshops = content.workshops.filter((w) => w.published);
  const cur = content.site.currency;

  const pillars = [
    { t: "Live & interactive", b: "Not pre-recorded videos. Real-time sessions on Zoom where you ask, build and get unstuck on the spot." },
    { t: "Real practitioners", b: "Taught by people who work in product — not slide readers. Small enough to get your questions answered." },
    { t: "Walk away with a portfolio", b: "Every week ends with applied work on a real product. Finish with case studies you can show in interviews." },
    { t: "Certificate included", b: "A completion certificate — ready for LinkedIn and your résumé." },
  ];

  return (
    <>
      <PageHero
        eyebrow="Programs & workshops · Live on Zoom"
        title={<>Learn product and AI skills. <span className="text-gradient">Live.</span></>}
        sub="A 16-week Product Management Fellowship, plus short hands-on sessions on AI agents, Claude, MCP and building a POC. Instructor-led, project-based and open to everyone."
      >
        <p className="mt-6 flex flex-wrap gap-2 text-sm">
          {["College students", "Working professionals", "Career switchers"].map((a) => (
            <span key={a} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-zinc-300">{a}</span>
          ))}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#modules" className="btn-primary py-4 text-base">Browse programs</a>
          <Link href="/hackathon#register" className="btn-ghost py-4 text-base">Register for the hackathon — free</Link>
        </div>
      </PageHero>

      <section className="section" id="pillars">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="card h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 font-display font-bold text-accent">{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{p.t}</h3>
                <p className="mt-2 text-zinc-400">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section scroll-mt-16 border-t border-line" id="modules">
        <div className="container">
          <SectionHeading eyebrow="All programs" title="Pick a program" sub="Start with a short workshop, or commit to the full fellowship. Each is live and ends with something you built." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workshops.map((w, i) => (
              <Reveal key={w.slug} delay={i * 80}><ModuleTile w={w} currency={cur} index={i} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
