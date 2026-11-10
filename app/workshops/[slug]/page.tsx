import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import ModuleTile from "@/components/ModuleTile";
import ShowMore from "@/components/ShowMore";
import Reveal from "@/components/Reveal";
import { Check, FAQ } from "@/components/ui";
import type { Instructor } from "@/lib/types";
import { formatSessionDate, formatSessionTime, googleCalendarUrl, sortedSessions } from "@/lib/sessions";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const content = await getContent();
  const w = content.workshops.find((x) => x.slug === slug && x.published);
  return { content, w };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { w } = await load((await params).slug);
  if (!w) return { title: "Workshop not found" };
  return { title: `${w.title} — Live Program`, description: `${w.tagline} ${w.description.slice(0, 120)}` };
}

export default async function WorkshopDetail({ params }: Props) {
  const { slug } = await params;
  const { content, w } = await load(slug);
  if (!w) notFound();
  const cur = content.site.currency;
  const others = content.workshops.filter((x) => x.published && x.slug !== w.slug).slice(0, 3);
  const sessions = sortedSessions(w.sessions);
  const agenda = (w.agenda ?? []).filter((a) => a.title.trim());
  const tools = (w.tools ?? []).filter(Boolean);
  const instructor = w.instructor?.name.trim() ? w.instructor : undefined;

  const included = [
    "Live classes on Zoom with industry practitioners",
    "Hands-on assignments applied to real products",
    `A finished deliverable: ${w.project.toLowerCase()}`,
    "Certificate of completion",
    "Session recordings for revision",
    "Feedback on your work and mock interviews",
  ];
  const highlights = (w.highlights ?? []).filter((h) => h.value.trim());
  const comparison = (w.comparison ?? []).filter((r) => r.benefit.trim());
  const projects = (w.projects ?? []).filter((p) => p.title.trim());

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-[40rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="container relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <Link href="/workshops" className="text-sm text-zinc-400 hover:text-white">← All workshops</Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-500" /> Live on Zoom
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300">{w.level}</span>
              {w.tag && <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">{w.tag}</span>}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">{w.title}</h1>
            <p className="mt-4 font-display text-xl text-accent sm:text-2xl">{w.tagline}</p>
            <p className="lead mt-5 max-w-2xl">{w.description}</p>
            {tools.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-zinc-500">Tools you&apos;ll get hands-on with</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 bg-ink-800 px-3.5 py-1.5 text-sm font-medium text-zinc-200">{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {instructor && (
              <a href="#instructor" className="mt-8 inline-flex items-center gap-3 text-sm text-zinc-300 hover:text-white">
                <Avatar i={instructor} size="h-9 w-9 text-sm" />
                <span>
                  Taught by <span className="font-semibold text-white">{instructor.name}</span>
                  {instructor.company && <span className="text-zinc-400"> · {instructor.company}</span>}
                </span>
              </a>
            )}
          </div>

          {/* Sticky purchase card */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-accent/30 bg-ink-800 p-6 shadow-glow sm:p-8">
              <p className="font-display text-4xl font-bold text-white">{formatPrice(w.price, cur)}</p>
              {w.compareAtPrice && w.compareAtPrice > w.price && (
                <p className="mt-1 text-sm text-zinc-400">
                  <span className="line-through">{formatPrice(w.compareAtPrice, cur)}</span>{" "}
                  <span className="font-semibold text-accent">Save {formatPrice(w.compareAtPrice - w.price, cur)}</span>
                </p>
              )}
              {w.emiPerMonth && (
                <p className="mt-2 text-sm text-zinc-300">
                  or <span className="font-semibold text-white">{formatPrice(w.emiPerMonth, cur)}/month</span> with EMI
                </p>
              )}
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Duration</dt><dd className="text-right text-white">{w.duration}</dd></div>
                {sessions.length > 0 ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Starts</dt>
                    <dd className="text-right text-white">
                      {formatSessionDate(sessions[0].start)}
                      <a href="#schedule" className="block text-xs text-accent hover:underline">Full schedule ↓</a>
                    </dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-4"><dt className="text-zinc-500">Schedule</dt><dd className="text-right text-white">{w.schedule}</dd></div>
                )}
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Delivery</dt><dd className="text-right text-white">Live on Zoom</dd></div>
              </dl>
              <Link href={`/enroll/${w.slug}`} className="btn-primary mt-7 w-full py-4 text-base">Enroll now →</Link>
              <p className="mt-3 text-center text-xs text-zinc-500">Secure checkout · Zoom link emailed after enrollment</p>
            </div>
          </aside>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="border-b border-line bg-ink-900">
          <div className="container grid grid-cols-2 gap-px lg:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.label} className="px-2 py-8 text-center sm:py-10">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">{h.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{h.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container grid gap-6 lg:grid-cols-3">
          <Reveal className="card p-7">
            <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">{w.learn.map((l) => <Check key={l}>{l}</Check>)}</ul>
          </Reveal>
          <Reveal delay={80} className="card p-7">
            <h2 className="text-2xl font-bold">Who it&apos;s for</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">{w.forWho.map((l) => <Check key={l}>{l}</Check>)}</ul>
          </Reveal>
          <Reveal delay={160} className="rounded-3xl border border-accent/40 bg-accent/[.07] p-7">
            <h2 className="text-2xl font-bold">You walk away with</h2>
            <p className="mt-5 font-display text-xl font-semibold text-white">{w.project}</p>
            <p className="mt-3 text-zinc-300">Plus a completion certificate you can add to LinkedIn and your résumé.</p>
          </Reveal>
        </div>
      </section>

      {(agenda.length > 0 || sessions.length > 0) && (
        <section className="section border-t border-line" id="agenda">
          <div className={`container grid gap-12 ${agenda.length > 0 && sessions.length > 0 ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
            {agenda.length > 0 && (
              <div>
                <p className="eyebrow">Curriculum</p>
                <h2 className="h-section mt-3">Session by session</h2>
                <ShowMore
                  className={`mt-8 grid gap-4 sm:grid-cols-2 ${sessions.length > 0 ? "" : "lg:grid-cols-3"}`}
                  initial={6}
                  label="See full curriculum"
                  items={agenda.map((a, i) => {
                    const hands = a.topics.filter((t) => /^hands-on:/i.test(t));
                    const rest = a.topics.filter((t) => !/^hands-on:/i.test(t));
                    return (
                      <Reveal as="li" key={i} delay={(i % 3) * 60} className="card flex h-full flex-col p-6">
                        <span className="self-start rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-accent">
                          {agenda.length > 4 ? "Week" : "Session"} {i + 1}
                        </span>
                        <h3 className="mt-4 text-lg font-bold leading-snug text-white">{a.title}</h3>
                        {rest.length > 0 && <ul className="mt-4 space-y-2 text-[15px] text-zinc-300">{rest.map((t) => <Check key={t}>{t}</Check>)}</ul>}
                        {hands.length > 0 && (
                          <div className="mt-auto pt-5">
                            <div className="rounded-2xl border border-accent/30 bg-accent/[.07] p-4">
                              <p className="text-xs font-semibold uppercase tracking-[.14em] text-accent">Hands-on learning</p>
                              {hands.map((t) => <p key={t} className="mt-1 text-sm text-zinc-200">{t.replace(/^hands-on:\s*/i, "")}</p>)}
                            </div>
                          </div>
                        )}
                      </Reveal>
                    );
                  })}
                />
              </div>
            )}
            {sessions.length > 0 && (
              <div id="schedule" className="scroll-mt-24">
                <p className="eyebrow">Schedule</p>
                <h2 className="h-section mt-3">Block your calendar</h2>
                <ul className="mt-8 grid gap-3">
                  {sessions.map(({ s, start }, i) => (
                    <li key={i} className="card flex flex-wrap items-center justify-between gap-3 p-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-zinc-500">
                          Session {i + 1}{s.title ? ` · ${s.title}` : ""}
                        </p>
                        <p className="mt-1 font-semibold text-white">{formatSessionDate(start)}</p>
                        <p className="text-sm text-zinc-400">{formatSessionTime(start, s.durationMins)}</p>
                      </div>
                      <a
                        href={googleCalendarUrl(start, s.durationMins, `${w.title}: Session ${i + 1}`, `Live on Zoom. Prodathon workshop: ${w.title}. The Zoom link is emailed after enrollment.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost btn-sm"
                      >
                        + Calendar
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-zinc-500">All times in IST. Can&apos;t make one? Every session is recorded.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {instructor && (
        <section className="section border-t border-line" id="instructor">
          <div className="container max-w-4xl">
            <p className="eyebrow">Your instructor</p>
            <Reveal className="card mt-6 flex flex-col gap-6 p-7 sm:flex-row sm:items-start sm:p-10">
              <Avatar i={instructor} size="h-24 w-24 text-3xl" />
              <div>
                <h2 className="text-2xl font-bold">{instructor.name}</h2>
                <p className="mt-1 text-accent">
                  {instructor.role}
                  {instructor.company && <span className="text-zinc-300"> · {instructor.company}</span>}
                </p>
                {instructor.bio && <p className="mt-4 leading-relaxed text-zinc-300">{instructor.bio}</p>}
                {instructor.linkedin && (
                  <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold text-accent hover:underline">
                    View LinkedIn ↗
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section border-t border-line" id="projects">
          <div className="container">
            <p className="eyebrow">Learn by doing</p>
            <h2 className="h-section mt-3">Work on real-world projects</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((p, i) => (
                <Reveal key={p.title} delay={i * 80} className="card p-6">
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-zinc-400">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {comparison.length > 0 && (
        <section className="section border-t border-line bg-ink-900" id="compare">
          <div className="container">
            <p className="eyebrow">Why this program</p>
            <h2 className="h-section mt-3">How it compares</h2>
            <Reveal className="mt-8 overflow-x-auto rounded-3xl border border-line">
              <table className="w-full min-w-[640px] text-left text-[15px]">
                <thead className="bg-ink-800 text-xs uppercase tracking-[.14em]">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-zinc-500">Benefit</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Other courses</th>
                    <th className="px-6 py-4 font-semibold text-accent">{w.title}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((r) => (
                    <tr key={r.benefit} className="border-t border-line">
                      <td className="px-6 py-4 font-semibold text-white">{r.benefit}</td>
                      <td className="px-6 py-4 text-zinc-500">{r.others}</td>
                      <td className="bg-accent/[.06] px-6 py-4 text-zinc-100">{r.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section border-t border-line">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Fees</p>
            <h2 className="h-section mt-3">Everything in one fee.</h2>
            <p className="lead mt-4">
              One price covers every live class, assignment review, recording and your certificate.
              {w.emiPerMonth ? ` Prefer to spread it out? EMI starts at ${formatPrice(w.emiPerMonth, cur)} a month.` : ""}
            </p>
          </div>
          <Reveal>
            <h3 className="text-xl font-bold">Everything included</h3>
            <ul className="mt-5 grid gap-3 text-zinc-300">{included.map((l) => <Check key={l}>{l}</Check>)}</ul>
            <Link href={`/enroll/${w.slug}`} className="btn-primary mt-8">Enroll in {w.title} →</Link>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container max-w-4xl">
          <h2 className="h-section">Workshop FAQ</h2>
          <div className="mt-8">
            <FAQ
              items={[
                { q: "Is this live or recorded?", a: "Live on Zoom with industry practitioners. You'll also get the recordings afterward for revision." },
                { q: "How much time does it take?", a: `${w.duration}. Live classes plus hands-on work you can start during the sessions.` },
                { q: "What do I need?", a: "A laptop, a stable internet connection and Zoom. Setup instructions are emailed before the first session." },
                { q: "When do I get the Zoom link?", a: "Right after payment we confirm by email. The Zoom link and schedule are sent before the first session." },
                { q: "Can I get a refund?", a: "See our Terms of Service for the refund policy. If something's wrong, contact us and we'll sort it." },
              ]}
            />
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section border-t border-line">
          <div className="container">
            <h2 className="h-section">Stack your skills</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {others.map((o, i) => <ModuleTile key={o.slug} w={o} currency={cur} index={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky enroll bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 p-3 backdrop-blur-xl lg:hidden">
        <div className="container flex items-center justify-between gap-4 px-2">
          <div>
            <p className="text-xs text-zinc-400">{w.title}</p>
            <p className="font-display text-lg font-bold text-white">{formatPrice(w.price, cur)}</p>
          </div>
          <Link href={`/enroll/${w.slug}`} className="btn-primary btn-sm">Enroll →</Link>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </>
  );
}

function Avatar({ i, size }: { i: Instructor; size: string }) {
  if (i.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={i.image} alt="" className={`${size} shrink-0 rounded-full object-cover`} />;
  }
  return <span className={`${size} grid shrink-0 place-items-center rounded-full bg-accent/15 font-display font-bold text-accent`}>{i.name.trim()[0]}</span>;
}
