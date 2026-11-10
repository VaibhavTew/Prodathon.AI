"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
    });
    if (res.ok) router.refresh();
    else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <form onSubmit={onSubmit} className="container card grid max-w-sm gap-4 p-8">
        <h1 className="text-2xl font-bold">Prodathon admin</h1>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" required autoFocus autoComplete="current-password" className="field" />
        </div>
        {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Checking…" : "Sign in"}</button>
      </form>
    </section>
  );
}
