import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { siteUrl } from "./format";
import type { Enrollment } from "./types";

/**
 * Modular payment gateway. Pick a provider with PAYMENT_PROVIDER, or leave it
 * empty and it's auto-detected from whichever keys you've set.
 *
 *  - razorpay: in-page Razorpay Checkout (UPI, cards, netbanking). Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET.
 *  - stripe:   redirect to Stripe Checkout. Needs STRIPE_SECRET_KEY.
 *  - mock:     no money moves; instantly "paid". For local testing only.
 *
 * Add a provider by extending `createPayment` and `verifyPayment` below.
 */
export type Provider = "razorpay" | "stripe" | "mock";

export function activeProvider(): Provider | null {
  const forced = process.env.PAYMENT_PROVIDER as Provider | undefined;
  let p: Provider;
  if (forced) p = forced;
  else if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) p = "razorpay";
  else if (process.env.STRIPE_SECRET_KEY) p = "stripe";
  else p = "mock";
  if (p === "mock" && process.env.NODE_ENV === "production" && process.env.ALLOW_MOCK_PAYMENTS !== "true") {
    return null; // never hand out free enrollments in production by accident
  }
  return p;
}

export type CreatedPayment =
  | { provider: "razorpay"; keyId: string; orderId: string; amount: number; currency: string }
  | { provider: "stripe"; url: string; sessionId: string }
  | { provider: "mock" };

const minor = (amount: number) => Math.round(amount * 100);

export async function createPayment(enr: Enrollment): Promise<CreatedPayment & { providerOrderId?: string }> {
  const provider = activeProvider();
  if (!provider) throw new Error("Payments are not configured.");

  if (provider === "razorpay") {
    const keyId = process.env.RAZORPAY_KEY_ID!;
    const auth = Buffer.from(`${keyId}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: minor(enr.amount),
        currency: enr.currency,
        receipt: enr.id.slice(0, 40),
        notes: { enrollmentId: enr.id, workshop: enr.workshopSlug },
      }),
    });
    if (!res.ok) throw new Error(`Razorpay order failed: ${res.status} ${await res.text()}`);
    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { provider, keyId, orderId: order.id, amount: order.amount, currency: order.currency, providerOrderId: order.id };
  }

  if (provider === "stripe") {
    const form = new URLSearchParams({
      mode: "payment",
      customer_email: enr.email,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": enr.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(minor(enr.amount)),
      "line_items[0][price_data][product_data][name]": `${enr.workshopTitle} — Live on Zoom`,
      "metadata[enrollmentId]": enr.id,
      success_url: `${siteUrl}/enroll/success?id=${enr.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/enroll/${enr.workshopSlug}?cancelled=1`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) throw new Error(`Stripe session failed: ${res.status} ${await res.text()}`);
    const session = (await res.json()) as { id: string; url: string };
    return { provider, url: session.url, sessionId: session.id, providerOrderId: session.id };
  }

  return { provider: "mock" };
}

/** Returns the provider payment id when the payment is genuinely complete, else null. */
export async function verifyPayment(
  enr: Enrollment,
  proof: Record<string, string | undefined>,
): Promise<string | null> {
  if (enr.provider === "razorpay") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = proof;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return null;
    if (razorpay_order_id !== enr.providerOrderId) return null;
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(razorpay_signature);
    return a.length === b.length && timingSafeEqual(a, b) ? razorpay_payment_id : null;
  }

  if (enr.provider === "stripe") {
    const sessionId = proof.session_id;
    if (!sessionId || sessionId !== enr.providerOrderId) return null;
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const s = (await res.json()) as { payment_status: string; payment_intent?: string; metadata?: { enrollmentId?: string } };
    if (s.payment_status !== "paid" || s.metadata?.enrollmentId !== enr.id) return null;
    return s.payment_intent || sessionId;
  }

  if (enr.provider === "mock") {
    return activeProvider() === "mock" ? `mock_${Date.now()}` : null;
  }
  return null;
}
