import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import Reveal from "@/components/Reveal";
import TeamCard from "@/components/TeamCard";
import { PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "About", description: "Why we built Prodathon — and who's behind it." };

export default async function AboutPage() {
  const content = await getContent();
  const combinedYears = content.team.reduce((n, m) => n + (parseInt(m.experience ?? "", 10) || 0), 0);
  const values = [
    { t: "Build > watch", b: "You learn AI by shipping something, not by watching another tutorial." },
    { t: "Open door", b: "The hackathon is free for every student. Talent is everywhere; access isn't." },
    { t: "Real outcomes", b: "Projects, certificates and skills that show up on a résumé and in an interview." },
  ];
  return (
    <>
      <PageHero
        eyebrow="About Prodathon"
        title={<>We&apos;re here to turn students into <span className="text-gradient">AI builders.</span></>}
        sub="Prodathon exists because college students are hungry to work with AI, and most never get the chance to build something real with it."
      />

      {/* FOUNDERS: first thing after the hero */}
      <section className="section" id="team">
        <div className="container">
          <SectionHeading
            eyebrow={content.team.length === 1 ? "The founder" : "The founders"}
            title={content.team.length === 1 ? "The person behind Prodathon" : "The people behind Prodathon"}
            sub={combinedYears > 0 ? `Product and engineering, with AI at the centre of both. ${combinedYears}+ years of combined industry experience.` : undefined}
          />
          <div className={`mt-12 grid gap-6 ${content.team.length === 1 ? "max-w-xl" : "lg:grid-cols-2"}`}>
            {content.team.map((m, i) => (
              <Reveal key={m.name + i} delay={i * 100}>
                <TeamCard m={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Our mission" title="Make building with AI the normal thing students do." />
          <Reveal className="space-y-5 text-lg leading-relaxed text-zinc-300">
            <p>
              AI is changing every industry, but most college curricula haven&apos;t caught up. Students are left piecing it together from
              YouTube and hoping it adds up to something.
            </p>
            <p>
              So we built Prodathon. It&apos;s a free hackathon that gives students a reason, a deadline and a stage to build. Alongside it we
              run live workshops that teach the skills to do it well.
            </p>
            <p>
              The hackathon is always free. The workshops are for students who want to prepare properly: live instruction, a real project,
              and a certificate to show for it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line bg-ink-900">
        <div className="container">
          <SectionHeading eyebrow="What we believe" title="Our values" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="card h-full p-7">
                  <h3 className="text-2xl font-bold text-accent">{v.t}</h3>
                  <p className="mt-2 text-zinc-300">{v.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container">
          <Reveal className="flex flex-col gap-3 sm:flex-row">
            <Link href="/hackathon#register" className="btn-primary">Register for the Hackathon — Free</Link>
            <Link href="/workshops" className="btn-ghost">Explore Workshops</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
