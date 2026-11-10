import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/store";
import type { Content } from "@/lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Content | null;
  const error = validateContent(body);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  await saveContent(body!);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

function validateContent(c: Content | null): string | null {
  if (!c || typeof c !== "object") return "Content must be a JSON object.";
  for (const key of ["site", "hackathon", "progress", "workshops", "colleges", "sponsors", "testimonials", "team"] as const) {
    if (!(key in c)) return `Missing section: ${key}`;
  }
  if (!Array.isArray(c.workshops)) return "workshops must be a list.";
  const slugs = new Set<string>();
  for (const w of c.workshops) {
    if (!w.title) return "Every workshop needs a title.";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(w.slug || "")) return `Workshop "${w.title}" needs a slug like "my-workshop".`;
    if (slugs.has(w.slug)) return `Duplicate workshop slug: ${w.slug}`;
    slugs.add(w.slug);
    if (typeof w.price !== "number" || !(w.price > 0)) return `Workshop "${w.title}" needs a price above 0.`;
    for (const s of w.sessions ?? []) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s.start || "")) return `Workshop "${w.title}" has a session without a valid start date/time.`;
      if (!(s.durationMins > 0)) return `Workshop "${w.title}" has a session with no duration.`;
    }
  }
  const p = c.progress;
  if (!(p.goal > 0)) return "Progress goal must be above 0.";
  if (p.minDisplayPercent < 0 || p.minDisplayPercent > 100) return "Minimum display % must be 0–100.";
  return null;
}
