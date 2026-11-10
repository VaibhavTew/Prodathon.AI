import { NextResponse } from "next/server";
import { addRecord } from "@/lib/store";
import { isBot, pick } from "@/lib/validate";
import { leadNotice, sendEmail } from "@/lib/email";

// Handles "Partner with us" (colleges), sponsor enquiries and the general contact form.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (isBot(body)) return NextResponse.json({ ok: true });

  const raw = (body as { type?: string } | null)?.type;
  const type = raw === "partner" || raw === "sponsor" ? raw : "contact";
  const parsed = pick(body, {
    name: { required: true, max: 100 },
    email: { required: true, email: true, max: 160 },
    phone: { phone: true },
    organization: { required: type !== "contact", max: 160 },
    role: { max: 100 },
    message: { required: type === "contact", max: 3000 },
  });
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const d = parsed.data;

  const lead = await addRecord("leads", {
    type,
    name: d.name,
    email: d.email,
    phone: d.phone || undefined,
    organization: d.organization || undefined,
    role: d.role || undefined,
    message: d.message,
  });
  const notice = leadNotice(lead);
  if (notice) await sendEmail(notice);
  return NextResponse.json({ ok: true });
}
