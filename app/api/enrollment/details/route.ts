import { NextResponse } from "next/server";
import { updateRecord } from "@/lib/store";
import { pick } from "@/lib/validate";

// Post-payment: capture Zoom session details for a paid enrollment.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = pick(body, {
    id: { required: true, max: 64 },
    zoomEmail: { required: true, email: true, max: 160 },
    timezone: { max: 60 },
    experience: { max: 60 },
    goal: { max: 1000 },
  });
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const { id, ...zoom } = parsed.data;

  const updated = await updateRecord("enrollments", id, (cur) => (cur.status === "paid" ? { ...cur, zoom } : null));
  if (!updated || updated.status !== "paid") {
    return NextResponse.json({ ok: false, error: "Enrollment not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
