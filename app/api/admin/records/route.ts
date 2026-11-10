import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { COLLECTIONS, listRecords, type CollectionName } from "@/lib/store";

// GET /api/admin/records?collection=registrations[&format=csv]
export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(req.url);
  const name = url.searchParams.get("collection") as CollectionName;
  if (!COLLECTIONS.includes(name)) return NextResponse.json({ ok: false, error: "Unknown collection" }, { status: 400 });

  const rows = (await listRecords(name)).slice().reverse() as unknown as Record<string, unknown>[];
  if (url.searchParams.get("format") !== "csv") return NextResponse.json(rows);

  const flat = rows.map((r) => flatten(r));
  const headers = Array.from(new Set(flat.flatMap((r) => Object.keys(r))));
  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // block spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [headers.join(","), ...flat.map((r) => headers.map((h) => cell(r[h])).join(","))].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prodathon-${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v as Record<string, unknown>, key));
    else out[key] = v;
  }
  return out;
}
