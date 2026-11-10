import { NextResponse } from "next/server";
import { addRecord, getContent, updateRecord } from "@/lib/store";
import { isBot, pick } from "@/lib/validate";
import { activeProvider, createPayment } from "@/lib/payments";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (isBot(body)) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const parsed = pick(body, {
    slug: { required: true, max: 80 },
    name: { required: true, max: 100 },
    email: { required: true, email: true, max: 160 },
    phone: { required: true, phone: true },
    college: { required: true, max: 160 },
  });
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const d = parsed.data;

  const content = await getContent();
  // Price is always taken from server-side content — never trust the client.
  const workshop = content.workshops.find((w) => w.slug === d.slug && w.published);
  if (!workshop) return NextResponse.json({ ok: false, error: "This workshop isn't available." }, { status: 404 });

  const provider = activeProvider();
  if (!provider) {
    return NextResponse.json({ ok: false, error: "Checkout is temporarily unavailable. Please contact us." }, { status: 503 });
  }

  const enr = await addRecord("enrollments", {
    status: "pending",
    workshopSlug: workshop.slug,
    workshopTitle: workshop.title,
    amount: workshop.price,
    currency: content.site.currency,
    provider,
    name: d.name,
    email: d.email,
    phone: d.phone,
    college: d.college,
  });

  try {
    const payment = await createPayment(enr);
    if (payment.providerOrderId) {
      await updateRecord("enrollments", enr.id, (cur) => ({ ...cur, providerOrderId: payment.providerOrderId }));
    }
    const { providerOrderId: _omit, ...publicPayment } = payment;
    return NextResponse.json({ ok: true, enrollmentId: enr.id, payment: publicPayment });
  } catch (err) {
    console.error("[checkout] create failed", err);
    await updateRecord("enrollments", enr.id, (cur) => ({ ...cur, status: "failed" }));
    return NextResponse.json({ ok: false, error: "Couldn't start checkout. Please try again." }, { status: 502 });
  }
}
