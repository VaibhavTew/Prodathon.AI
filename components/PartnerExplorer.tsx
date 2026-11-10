"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AUDIENCES, STEPS, type Audience, type PartnerPlan } from "@/lib/partners";

const ORDER: Audience[] = ["college", "company"];
const HASH: Record<string, Audience> = { "#colleges": "college", "#companies": "company" };

function CheckIcon() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] text-accent" aria-hidden>
      ✓
    </span>
  );
}

export default function PartnerExplorer({ email, partnerColleges }: { email: string; partnerColleges: string[] }) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [planId, setPlanId] = useState<string>("");
  const detailsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Hero buttons link to #colleges / #companies: open that path.
  useEffect(() => {
    const fromHash = () => {
      const a = HASH[window.location.hash];
      if (a) {
        setAudience(a);
        setPlanId("");
        requestAnimationFrame(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function choose(a: Audience) {
    setAudience(a);
    setPlanId("");
    requestAnimationFrame(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function pickPlan(a: Audience, p: PartnerPlan) {
    setAudience(a);
    setPlanId(p.id);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const info = audience ? AUDIENCES[audience] : null;

  return (
    <>
      {/* PATH PICKER (acts as tabs) */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Choose your path</p>
          <h2 className="h-section mt-3">Who are you partnering as?</h2>
          <div role="tablist" aria-label="Partner type" className="mt-8 grid gap-5 md:grid-cols-2">
            {ORDER.map((a) => {
              const x = AUDIENCES[a];
              const active = audience === a;
              return (
                <button
                  key={a}
                  role="tab"
                  id={`tab-${a}`}
                  aria-selected={active}
                  aria-controls="partner-details"
                  onClick={() => choose(a)}
                  className={`group relative flex h-full flex-col rounded-3xl border p-7 text-left transition duration-300 ${
                    active
                      ? "border-accent bg-gradient-to-b from-accent/[.10] to-ink-800 shadow-glow"
                      : "border-line bg-ink-800 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow"
                  }`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${active ? "bg-accent/20" : "bg-accent/10"}`} aria-hidden>
                      {x.icon}
                    </span>
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border-2 text-xs font-bold transition ${
                        active ? "border-accent bg-accent text-ink-800" : "border-line text-transparent group-hover:border-accent/50"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                  </span>
                  <span className="mt-5 block text-2xl font-bold text-white">{x.title}</span>
                  <span className="mt-2 block text-zinc-400">{x.blurb}</span>
                  <span className="mt-5 flex flex-1 flex-col gap-2 text-[15px] text-zinc-300">
                    {x.points.map((p) => (
                      <span key={p} className="flex gap-3"><CheckIcon />{p}</span>
                    ))}
                  </span>
                  <span className="mt-6 text-sm font-semibold text-accent">
                    {active ? "Showing details below ↓" : "View benefits & packages →"}
                  </span>
                </button>
              );
            })}
          </div>
          {!audience && (
            <p className="mt-6 text-center text-sm text-zinc-500">Select a card to see benefits, packages and pricing.</p>
          )}
        </div>
      </section>

      {/* DETAILS PANEL */}
      <div ref={detailsRef} className="scroll-mt-24">
        {info && audience && (
          <section
            key={audience}
            id="partner-details"
            role="tabpanel"
            aria-labelledby={`tab-${audience}`}
            className="animate-fadeUp border-t border-line bg-ink-900 py-16 sm:py-20"
          >
            <div className="container">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">For {info.label.toLowerCase()}</p>
                  <h2 className="h-section mt-3">{info.benefitsTitle}</h2>
                </div>
                <button
                  onClick={() => choose(audience === "college" ? "company" : "college")}
                  className="btn-ghost btn-sm"
                >
                  Switch to {AUDIENCES[audience === "college" ? "company" : "college"].label.toLowerCase()} ⇄
                </button>
              </div>

              <ul className={`mt-8 grid gap-3 sm:grid-cols-2 ${info.benefits.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                {info.benefits.map((b) => (
                  <li key={b.t} className="flex gap-3 rounded-2xl border border-line bg-ink-800 p-5">
                    <CheckIcon />
                    <span>
                      <span className="block font-semibold text-white">{b.t}</span>
                      <span className="mt-1 block text-sm text-zinc-400">{b.b}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-14 text-2xl font-bold">Packages</h3>
              <p className="mt-1 text-zinc-400">
                {audience === "college"
                  ? "Partnering is always free. Add paid training only if you want it."
                  : "Every package is tailored. Request a quote and we'll reply with a proposal within 2 working days."}
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {info.plans.map((p) => (
                  <PlanCard key={p.id} p={p} onPick={() => pickPlan(audience, p)} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* STEPS */}
      <section className="section border-t border-line">
        <div className="container">
          <p className="eyebrow">How partnering works</p>
          <h2 className="h-section mt-3">Three steps. That&apos;s it.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map(([t, b], i) => (
              <li key={t} className="flex h-full gap-4 rounded-2xl border border-line bg-ink-800/60 p-6">
                <span className="font-display text-3xl font-bold text-accent">0{i + 1}</span>
                <div><p className="font-semibold text-white">{t}</p><p className="mt-1 text-zinc-400">{b}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORM */}
      <section className="section border-t border-line bg-ink-900" id="partner">
        <div ref={formRef} className="container grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Partner with us</p>
            <h2 className="h-section mt-3">Tell us how you&apos;d like to work together.</h2>
            <p className="lead mt-4">
              TPOs, HoDs, faculty coordinators and club leads, as well as HR, L&amp;D, talent and DevRel teams and founders, are all welcome.
            </p>
            {partnerColleges.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-zinc-500">Already partnering:</p>
                <p className="mt-2 text-zinc-300">{partnerColleges.join(" · ")}</p>
              </div>
            )}
            <div className="mt-8">
              <p className="text-sm text-zinc-500">Prefer email?</p>
              <a href={`mailto:${email}?subject=Partnership`} className="mt-1 inline-block font-semibold text-white hover:text-accent">{email}</a>
            </div>
          </div>
          <PartnerForm
            audience={audience ?? "college"}
            planId={planId}
            onAudience={(a) => { setAudience(a); setPlanId(""); }}
            onPlan={setPlanId}
          />
        </div>
      </section>
    </>
  );
}

function PlanCard({ p, onPick }: { p: PartnerPlan; onPick: () => void }) {
  const price =
    p.price === "free" ? { k: "Free", s: "No cost, ever" }
    : p.price === "quote" ? { k: "Custom pricing", s: `Quote based on ${p.quoteBasis}` }
    : { k: "Tiered", s: "Supporter, track and hiring tiers" };
  const cta = p.price === "free" ? "Partner free →" : p.price === "quote" ? "Request a quote →" : "See sponsorship tiers →";
  const btn = p.highlight ? "btn-primary" : "btn-ghost";

  return (
    <div className={`relative flex h-full flex-col rounded-3xl border p-7 ${p.highlight ? "border-accent/60 bg-gradient-to-b from-accent/[.10] to-ink-800 shadow-glow" : "border-line bg-ink-800"}`}>
      {p.highlight && (
        <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink-800">Most requested</span>
      )}
      <h4 className="text-xl font-bold text-white">{p.t}</h4>
      <div className="mt-4 rounded-2xl border border-line bg-ink-900/70 px-4 py-3">
        <p className={`font-display text-2xl font-bold ${p.price === "free" ? "text-[#16A34A]" : "text-white"}`}>{price.k}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{price.s}</p>
      </div>
      <p className="mt-4 text-[15px] text-zinc-400">{p.b}</p>
      <ul className="mt-5 flex-1 space-y-2 text-[15px] text-zinc-300">
        {p.items.map((it) => <li key={it} className="flex gap-3"><CheckIcon />{it}</li>)}
      </ul>
      {p.price === "link" && p.href ? (
        <Link href={p.href} className={`mt-6 ${btn}`}>{cta}</Link>
      ) : (
        <button onClick={onPick} className={`mt-6 ${btn}`}>{cta}</button>
      )}
    </div>
  );
}

function PartnerForm({
  audience, planId, onAudience, onPlan,
}: { audience: Audience; planId: string; onAudience: (a: Audience) => void; onPlan: (id: string) => void }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const info = AUDIENCES[audience];
  const plans = info.plans.filter((p) => p.price !== "link");
  const plan = plans.find((p) => p.id === planId);
  const isQuote = plan?.price === "quote";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    // The lead API stores a fixed set of fields, so partner type, package and quote details travel in the message.
    const lines = [
      `[${audience === "college" ? "College" : "Company"}] ${isQuote ? "Quote request" : "Partnership enquiry"}: ${plan ? plan.t : "Not sure yet"}`,
      isQuote && f.size ? `${info.sizeLabel}: ${f.size}` : "",
      isQuote && f.format ? `Format: ${f.format}` : "",
      isQuote && f.timeline ? `Timeline: ${f.timeline}` : "",
      f.message ? `\n${f.message}` : "",
    ].filter(Boolean);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner", name: f.name, email: f.email, phone: f.phone, organization: f.organization, role: f.role,
          website: f.website, message: lines.join("\n"),
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setState("done");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center" role="status">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl text-ink-800">✓</div>
        <h3 className="mt-5 text-2xl font-bold">{isQuote ? "Quote request received." : "Let's build this together."}</h3>
        <p className="mt-2 text-muted">
          {isQuote ? "We'll send a tailored proposal within 2 working days." : "Our partnerships team will reach out within 2 working days."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:p-8">
      {isQuote && plan && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/[.07] px-4 py-3">
          <p className="text-sm">
            <span className="text-xs font-bold uppercase tracking-[.14em] text-accent">Quote request</span>
            <span className="ml-2 font-semibold text-white">{plan.t}</span>
          </p>
          <button type="button" onClick={() => onPlan("")} className="text-xs font-semibold text-zinc-500 hover:text-accent">Clear</button>
        </div>
      )}

      <fieldset>
        <legend className="label">I&apos;m partnering as a</legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {ORDER.map((a) => (
            <label
              key={a}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold text-white transition ${
                audience === a ? "border-accent bg-accent/[.07]" : "border-line bg-ink-800 hover:border-accent/40"
              }`}
            >
              <input type="radio" name="partnerType" value={a} checked={audience === a} onChange={() => onAudience(a)} className="h-4 w-4 accent-[#5B3DF5]" />
              {AUDIENCES[a].icon} {a === "college" ? "College" : "Company"}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="label" htmlFor="pf-plan">Interested in</label>
        <select id="pf-plan" className="field" value={planId} onChange={(e) => onPlan(e.target.value)}>
          <option value="">Not sure yet / general partnership</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.t} ({p.price === "free" ? "Free" : "Custom quote"})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="pf-name">Your name</label>
          <input id="pf-name" name="name" required maxLength={100} autoComplete="name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="pf-email">Work email</label>
          <input id="pf-email" name="email" type="email" required maxLength={160} autoComplete="email" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="pf-org">{audience === "college" ? "College / institution" : "Company"}</label>
          <input id="pf-org" name="organization" required maxLength={160} autoComplete="organization" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="pf-role">Your role</label>
          <input id="pf-role" name="role" maxLength={100} className="field" placeholder={audience === "college" ? "e.g. TPO, HoD, Club lead" : "e.g. HR, L&D, Talent lead, Founder"} />
        </div>
      </div>

      {isQuote && (
        <div className="grid gap-4 rounded-2xl border border-line bg-ink-900/60 p-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="pf-size">{info.sizeLabel}</label>
            <input id="pf-size" name="size" required inputMode="numeric" maxLength={20} className="field" placeholder="e.g. 60" />
          </div>
          <div>
            <label className="label" htmlFor="pf-format">Preferred format</label>
            <select id="pf-format" name="format" className="field" defaultValue={info.formats[0]}>
              {info.formats.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="pf-timeline">When</label>
            <select id="pf-timeline" name="timeline" className="field" defaultValue="In 1–3 months">
              {["This month", "In 1–3 months", "Later / just exploring"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="pf-phone">Phone <span className="text-zinc-500">(optional)</span></label>
        <input id="pf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="pf-message">Anything we should know? <span className="text-zinc-500">(optional)</span></label>
        <textarea
          id="pf-message"
          name="message"
          maxLength={2500}
          rows={4}
          className="field resize-y"
          placeholder={isQuote ? "Topics you want covered, dates, budget range…" : "What you'd like to do together, timelines…"}
        />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
      <button className="btn-primary w-full sm:w-auto sm:justify-self-start" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : isQuote ? "Request quote →" : "Send partnership enquiry →"}
      </button>
    </form>
  );
}
