"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ZoomDetailsForm({ id, defaultEmail, done = false }: { id: string; defaultEmail: string; done?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done">(done ? "done" : "idle");
  const [error, setError] = useState("");
  const [tz, setTz] = useState("");
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || ""), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/enrollment/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(e.currentTarget)), id }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setState("done");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Couldn't save. Try again?");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status">
        <p className="rounded-2xl border border-accent/40 bg-accent/10 p-5 text-zinc-200">
          <span className="font-semibold text-accent">Saved.</span> Your Zoom invite will go to the email you gave us. See you live!
        </p>
        <Link href="/workshops" className="btn-ghost mt-5 w-full">Stack another workshop →</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <label className="label" htmlFor="z-email">Email for the Zoom invite</label>
        <input id="z-email" name="zoomEmail" type="email" required defaultValue={defaultEmail} className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="z-tz">Time zone</label>
          <input id="z-tz" name="timezone" value={tz} onChange={(e) => setTz(e.target.value)} maxLength={60} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="z-exp">Coding experience</label>
          <select id="z-exp" name="experience" className="field" defaultValue="Some">
            <option>None yet</option>
            <option>Some</option>
            <option>Comfortable</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="z-goal">What do you want to build? <span className="text-zinc-500">(optional)</span></label>
        <textarea id="z-goal" name="goal" rows={3} maxLength={1000} className="field resize-y" placeholder="Your hackathon idea, or what you're curious about" />
      </div>
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={state === "loading"}>{state === "loading" ? "Saving…" : "Save Zoom details"}</button>
    </form>
  );
}
