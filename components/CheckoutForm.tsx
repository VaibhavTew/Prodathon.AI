"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Provider = "razorpay" | "stripe" | "mock";

type CreateResponse =
  | { ok: false; error: string }
  | {
      ok: true;
      enrollmentId: string;
      payment:
        | { provider: "razorpay"; keyId: string; orderId: string; amount: number; currency: string }
        | { provider: "stripe"; url: string }
        | { provider: "mock" };
    };

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: () => void) => void };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutForm({ slug, provider, priceLabel }: { slug: string; provider: Provider; priceLabel: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verify(body: Record<string, string>) {
    const res = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error);
    router.push(`/enroll/success?id=${encodeURIComponent(body.enrollmentId)}`);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const details = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      if (provider === "razorpay" && !(await loadRazorpay())) throw new Error("Couldn't load the payment window. Check your connection.");
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, slug }),
      });
      const json = (await res.json()) as CreateResponse;
      if (!json.ok) throw new Error(json.error);
      const { payment, enrollmentId } = json;

      if (payment.provider === "stripe") {
        window.location.href = payment.url;
        return;
      }
      if (payment.provider === "mock") {
        await verify({ enrollmentId });
        return;
      }
      // Razorpay in-page checkout
      const rzp = new window.Razorpay!({
        key: payment.keyId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Prodathon",
        description: "Live workshop enrollment",
        prefill: { name: details.name, email: details.email, contact: details.phone },
        theme: { color: "#5B3DF5" },
        handler: (r: RazorpayResponse) => {
          verify({ enrollmentId, ...r }).catch((err) => {
            setError(err.message || "Payment verification failed.");
            setLoading(false);
          });
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. No money was taken — try again or use another method.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <label className="label" htmlFor="co-name">Full name</label>
        <input id="co-name" name="name" required maxLength={100} autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="co-email">Email</label>
        <input id="co-email" name="email" type="email" required maxLength={160} autoComplete="email" className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="co-phone">Phone</label>
          <input id="co-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="co-college">College</label>
          <input id="co-college" name="college" required maxLength={160} autoComplete="organization" className="field" />
        </div>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
      <button className="btn-primary mt-2 w-full py-4 text-base" disabled={loading}>
        {loading ? "Opening secure checkout…" : `Pay ${priceLabel} & enroll`}
      </button>
      <p className="text-center text-xs text-zinc-500">
        {provider === "mock"
          ? "Test mode — no real payment will be taken."
          : `Payments processed securely by ${provider === "razorpay" ? "Razorpay" : "Stripe"}.`}{" "}
        By enrolling you agree to our <a href="/terms" className="underline hover:text-white">Terms</a>.
      </p>
    </form>
  );
}
