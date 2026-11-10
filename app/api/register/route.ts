import { NextResponse } from "next/server";
import { addRecord, getContent, listRecords } from "@/lib/store";
import { isBot, pick } from "@/lib/validate";
import { registrationEmail, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (isBot(body)) return NextResponse.json({ ok: true, firstName: "" });

  const parsed = pick(body, {
    name: { required: true, max: 100 },
    email: { required: true, email: true, max: 160 },
    college: { required: true, max: 160 },
    phone: { required: true, phone: true },
    source: { max: 60 },
  });
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const d = parsed.data;
  const firstName = d.name.split(" ")[0];

  // Already registered? Treat as success so people aren't punished for double-clicking.
  const existing = (await listRecords("registrations")).find((r) => r.email === d.email);
  if (existing) return NextResponse.json({ ok: true, firstName, duplicate: true });

  const reg = await addRecord("registrations", {
    name: d.name,
    email: d.email,
    college: d.college,
    phone: d.phone,
    source: d.source || undefined,
  });
  await sendEmail(registrationEmail(reg, await getContent()));
  return NextResponse.json({ ok: true, firstName });
}
