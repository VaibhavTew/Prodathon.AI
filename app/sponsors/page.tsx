import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { Check, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sponsors & Hiring Partners",
  description: "Sponsor the Prodathon AI hackathon. Reach AI-curious college students, put your tools in their hands, and meet early talent.",
};

export default async function SponsorsPage() {
  const content = await getContent();

  const why = [
    { t: "Meet early AI talent", b: "See students build working AI products under time pressure. That tells you more than a résumé does." },
    { t: "Get your tools used", b: "Sponsor a track or challenge built on your API, model or platform. Students learn your product by shipping with it." },
    { t: "Brand on campuses", b: "Your logo across our site, partner colleges, socials and the live demo day." },
    { t: "Impact you can report", b: "After the event we share participation numbers, project highlights and reach." },
  ];

  const tiers = [
    {
      t: "Supporter",
      b: "For startups and communities that want to back student builders.",
      items: ["Logo on the sponsor wall", "Social media shout-out", "Mention at demo day"],
    },
    {
      t: "Track sponsor",
      b: "Own a challenge track built around your product or problem.",
      items: ["Everything in Supporter", "A named prize track", "Judge seat at demo day", "Workshop or talk slot"],
      highlight: true,
    },
    {
      t: "Hiring partner",
      b: "For companies that want to meet and hire from the best teams.",
      items: ["Everything in Track sponsor", "Résumés of opted-in participants", "Interview day with top teams", "Headline branding"],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Sponsors & hiring partners"
        title={<>Back the next wave of <span className="text-gradient">AI builders.</span></>}
        sub="Prodathon brings college students from every branch together to ship real AI products. Sponsor a track, get your tools used and meet early talent."
      >
        <a href="#sponsor" className="btn-primary mt-8 py-4 text-base">Get the sponsorship deck →</a>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Why sponsor" title="What your company gets" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.t} delay={i * 80}>
                <div className="card h-full p-6">
                  <h3 className="text-xl font-bold">{w.t}</h3>
                  <p className="mt-2 text-zinc-400">{w.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-ink-900">
        <div className="container">
          <SectionHeading eyebrow="Tiers" title="Pick how involved you want to be" sub="Pricing depends on the event and reach. Tell us your goals and we'll send a proposal." />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.t} delay={i * 80}>
                <div className={`flex h-full flex-col rounded-3xl border p-7 ${t.highlight ? "border-accent/60 bg-gradient-to-b from-accent/[.10] to-ink-800" : "border-line bg-ink-800/70"}`}>
                  <h3 className="text-2xl font-bold">{t.t}</h3>
                  <p className="mt-2 text-zinc-400">{t.b}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-[15px] text-zinc-300">{t.items.map((it) => <Check key={it}>{it}</Check>)}</ul>
                  <a href="#sponsor" className={`mt-6 ${t.highlight ? "btn-primary" : "btn-ghost"}`}>Ask about {t.t} →</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section scroll-mt-16 border-t border-line" id="sponsor">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow="Let's talk"
              title="Sponsor Prodathon."
              sub="Talent teams, DevRel, marketing and founders are all welcome. We'll send the deck and set up a short call."
            />
            {content.sponsors.length > 0 && (
              <Reveal className="mt-8">
                <p className="text-sm text-zinc-500">Already supporting us:</p>
                <p className="mt-2 text-zinc-300">{content.sponsors.map((s) => s.name).join(" · ")}</p>
              </Reveal>
            )}
            <Reveal className="mt-8">
              <p className="text-sm text-zinc-500">Prefer email?</p>
              <a href={`mailto:${content.site.email}?subject=Sponsorship`} className="mt-1 inline-block font-semibold text-white hover:text-accent">
                {content.site.email}
              </a>
            </Reveal>
          </div>
          <Reveal delay={100}><LeadForm type="sponsor" /></Reveal>
        </div>
      </section>
    </>
  );
}
