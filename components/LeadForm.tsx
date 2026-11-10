"use client";

import { useState } from "react";

type LeadType = "partner" | "sponsor" | "contact";

const COPY: Record<LeadType, { org?: string; role?: string; message: string; placeholder: string; button: string; doneTitle: string; doneBody: string }> = {
  partner: {
    org: "College / company name",
    role: "e.g. TPO, HoD, HR, Talent lead, Founder",
    message: "Anything we should know?",
    placeholder: "Number of students or team size, timelines, what you'd like to do together…",
    button: "Partner with us →",
    doneTitle: "Let's build this together.",
    doneBody: "Our partnerships team will reach out within 2 working days.",
  },
  sponsor: {
    org: "Company / organization",
    role: "e.g. Talent lead, DevRel, Marketing",
    message: "What are you looking for?",
    placeholder: "Hiring goals, tier you're interested in, tools you'd like students to use…",
    button: "Talk to us about sponsoring →",
    doneTitle: "Thanks, we'll be in touch.",
    doneBody: "We'll send our sponsorship deck and reach out within 2 working days.",
  },
  contact: {
    message: "Message",
    placeholder: "How can we help?",
    button: "Send message →",
    doneTitle: "Message received.",
    doneBody: "We usually reply within one working day.",
  },
};

/** Shared lead form: "Partner with us" (partner), sponsor enquiries (sponsor) and Contact (contact). */
export default function LeadForm({ type }: { type: LeadType }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const c = COPY[type];
  const business = type !== "contact";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      if (type === "partner") {
        // The lead API stores a fixed set of fields, so the partner type travels at the start of the message.
        const who = data.partnerType === "company" ? "Company" : "College";
        data.message = `[${who}] ${data.message ?? ""}`.trim();
        delete data.partnerType;
      }
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
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
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl text-ink">✓</div>
        <h3 className="mt-5 text-2xl font-bold">{c.doneTitle}</h3>
        <p className="mt-2 text-muted">{c.doneBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${type}-name`}>Your name</label>
          <input id={`${type}-name`} name="name" required maxLength={100} autoComplete="name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor={`${type}-email`}>{business ? "Work email" : "Email"}</label>
          <input id={`${type}-email`} name="email" type="email" required maxLength={160} autoComplete="email" className="field" />
        </div>
        {type === "partner" && (
          <fieldset className="sm:col-span-2">
            <legend className="label">I&apos;m partnering as a</legend>
            <div className="mt-1 grid grid-cols-2 gap-3">
              {[["college", "🎓 College"], ["company", "🏢 Company"]].map(([v, l], i) => (
                <label key={v} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm font-semibold text-white transition has-[:checked]:border-accent has-[:checked]:bg-accent/[.07]">
                  <input type="radio" name="partnerType" value={v} defaultChecked={i === 0} className="h-4 w-4 accent-[#5B3DF5]" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {business && (
          <>
            <div>
              <label className="label" htmlFor={`${type}-organization`}>{c.org}</label>
              <input id={`${type}-organization`} name="organization" required maxLength={160} autoComplete="organization" className="field" />
            </div>
            <div>
              <label className="label" htmlFor={`${type}-role`}>Your role</label>
              <input id={`${type}-role`} name="role" maxLength={100} className="field" placeholder={c.role} />
            </div>
          </>
        )}
        <div className="sm:col-span-2">
          <label className="label" htmlFor={`${type}-phone`}>Phone <span className="text-zinc-500">(optional)</span></label>
          <input id={`${type}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor={`${type}-message`}>
            {c.message} {business && <span className="text-zinc-500">(optional)</span>}
          </label>
          <textarea
            id={`${type}-message`}
            name="message"
            required={!business}
            maxLength={3000}
            rows={4}
            className="field resize-y"
            placeholder={c.placeholder}
          />
        </div>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
      <button className="btn-primary w-full sm:w-auto sm:justify-self-start" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : c.button}
      </button>
    </form>
  );
}
