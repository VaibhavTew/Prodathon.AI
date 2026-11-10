import { NextResponse } from "next/server";
import { confirmEnrollment } from "@/lib/enrollments";

// Called by the browser after Razorpay (or mock) checkout completes.
// Stripe is verified server-side on /enroll/success instead.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  const id = body?.enrollmentId;
  if (!id || typeof id !== "string") return NextResponse.json({ ok: false, error: "Missing order." }, { status: 400 });

  const enr = await confirmEnrollment(id, body);
  if (!enr) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  if (enr.status !== "paid") {
    return NextResponse.json({ ok: false, error: "We couldn't verify that payment. If you were charged, contact us." }, { status: 402 });
  }
  return NextResponse.json({ ok: true });
}
