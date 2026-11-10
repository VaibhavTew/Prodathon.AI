import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Contact", description: "Questions about the hackathon, workshops or sponsorship? Get in touch." };

export default async function ContactPage() {
  const { site } = await getContent();
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us." sub="Questions about the hackathon, a workshop, sponsoring or anything else? We read everything." />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-8">
            <div>
              <p className="text-sm text-zinc-500">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 inline-block font-display text-2xl font-semibold text-white hover:text-accent">{site.email}</a>
            </div>
            {site.phone && (
              <div>
                <p className="text-sm text-zinc-500">Phone</p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-1 inline-block text-lg text-white">{site.phone}</a>
              </div>
            )}
            {site.location && (
              <div>
                <p className="text-sm text-zinc-500">Where</p>
                <p className="mt-1 text-lg text-white">{site.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-zinc-500">Socials</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-accent hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line p-5 text-sm text-zinc-400">
              Representing a college? Use the <Link href="/colleges#partner" className="font-semibold text-accent">partnership form</Link> for a faster response.
            </div>
          </Reveal>
          <Reveal delay={100}><LeadForm type="contact" /></Reveal>
        </div>
      </section>
    </>
  );
}
