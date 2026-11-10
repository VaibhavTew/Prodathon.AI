import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { confirmEnrollment, markEnrollmentPaid } from "@/lib/enrollments";
import { getRecord } from "@/lib/store";

/**
 * Server-to-server payment confirmation, so an enrollment is still marked paid
 * if the student closes the tab before the browser calls /api/checkout/verify.
 *
 * Point your provider's webhook at  https://<your-domain>/api/payments/webhook
 *  - Razorpay: event "order.paid", secret in RAZORPAY_WEBHOOK_SECRET
 *  - Stripe:   event "checkout.session.completed", secret in STRIPE_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  const raw = await req.text();

  const rzpSig = req.headers.get("x-razorpay-signature");
  if (rzpSig) return handleRazorpay(raw, rzpSig);

  const stripeSig = req.headers.get("stripe-signature");
  if (stripeSig) return handleStripe(raw, stripeSig);

  return NextResponse.json({ ok: false, error: "Unknown webhook source." }, { status: 400 });
}

function safeEqualHex(expected: string, given: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handleRazorpay(raw: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Webhook not configured." }, { status: 500 });

  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  if (!safeEqualHex(expected, signature)) return NextResponse.json({ ok: false }, { status: 401 });

  const event = JSON.parse(raw) as {
    event: string;
    payload?: {
      order?: { entity?: { id: string; amount_paid?: number; notes?: { enrollmentId?: string } } };
      payment?: { entity?: { id: string } };
    };
  };
  if (event.event !== "order.paid") return NextResponse.json({ ok: true, ignored: event.event });

  const order = event.payload?.order?.entity;
  const paymentId = event.payload?.payment?.entity?.id;
  const id = order?.notes?.enrollmentId;
  if (!order || !paymentId || !id) return NextResponse.json({ ok: true, ignored: "missing fields" });

  const enr = await getRecord("enrollments", id);
  // Only accept the order we created for this enrollment, for the full amount.
  if (!enr || enr.provider !== "razorpay" || enr.providerOrderId !== order.id) {
    return NextResponse.json({ ok: true, ignored: "no matching enrollment" });
  }
  if (order.amount_paid !== undefined && order.amount_paid < Math.round(enr.amount * 100)) {
    return NextResponse.json({ ok: true, ignored: "partial payment" });
  }
  await markEnrollmentPaid(id, paymentId);
  return NextResponse.json({ ok: true });
}

async function handleStripe(raw: string, header: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Webhook not configured." }, { status: 500 });

  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts.t;
  const v1s = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || v1s.length === 0) return NextResponse.json({ ok: false }, { status: 400 });
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return NextResponse.json({ ok: false }, { status: 400 });

  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  if (!v1s.some((v) => safeEqualHex(expected, v))) return NextResponse.json({ ok: false }, { status: 401 });

  const event = JSON.parse(raw) as { type: string; data?: { object?: { id: string; metadata?: { enrollmentId?: string } } } };
  if (event.type !== "checkout.session.completed") return NextResponse.json({ ok: true, ignored: event.type });

  const session = event.data?.object;
  const id = session?.metadata?.enrollmentId;
  if (!session || !id) return NextResponse.json({ ok: true, ignored: "missing fields" });

  // Re-checks payment_status with Stripe's API before marking paid.
  await confirmEnrollment(id, { session_id: session.id });
  return NextResponse.json({ ok: true });
}
