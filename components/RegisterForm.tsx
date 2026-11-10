"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Free hackathon registration. 4 fields, one tap. On success → /thank-you,
 * which immediately cross-sells the paid workshops.
 */
export default function RegisterForm({ source = "site", compact = false }: { source?: string; compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, source }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Something went wrong.");
      router.push(`/thank-you?name=${encodeURIComponent(json.firstName || "")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again?");
      setLoading(false);
    }
  }

  const id = (n: string) => `${source}-${n}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-3" noValidate={false}>
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label htmlFor={id("name")} className="label">Full name</label>
          <input id={id("name")} name="name" required maxLength={100} autoComplete="name" className="field" placeholder="Aanya Sharma" />
        </div>
        <div>
          <label htmlFor={id("email")} className="label">Email</label>
          <input id={id("email")} name="email" type="email" required maxLength={160} autoComplete="email" className="field" placeholder="you@college.edu" />
        </div>
        <div>
          <label htmlFor={id("college")} className="label">College</label>
          <input id={id("college")} name="college" required maxLength={160} autoComplete="organization" className="field" placeholder="Your college / university" />
        </div>
        <div>
          <label htmlFor={id("phone")} className="label">Phone</label>
          <input id={id("phone")} name="phone" type="tel" required inputMode="tel" autoComplete="tel" className="field" placeholder="+91 98765 43210" />
        </div>
      </div>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
      <button type="submit" className="btn-primary mt-1 w-full py-4 text-base" disabled={loading}>
        {loading ? "Locking your spot…" : "Register for the Hackathon — Free"}
      </button>
      <p className="text-center text-xs text-zinc-500">
        Free forever. No card needed. By registering you agree to our{" "}
        <a href="/terms" className="underline hover:text-white">Terms</a> &{" "}
        <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
      </p>
    </form>
  );
}
