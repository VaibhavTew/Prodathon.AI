// Minimal server-side validation helpers (no extra dependency).

export type FieldSpec = { required?: boolean; max?: number; email?: boolean; phone?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;

export function pick(
  body: unknown,
  spec: Record<string, FieldSpec>,
): { ok: true; data: Record<string, string> } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const src = body as Record<string, unknown>;
  const data: Record<string, string> = {};
  for (const [key, rule] of Object.entries(spec)) {
    const raw = src[key];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (rule.required && !value) return { ok: false, error: `Please fill in your ${labelOf(key)}.` };
    if (value.length > (rule.max ?? 200)) return { ok: false, error: `Your ${labelOf(key)} is too long.` };
    if (value && rule.email && !EMAIL.test(value)) return { ok: false, error: "That email doesn't look right." };
    if (value && rule.phone && !PHONE.test(value)) return { ok: false, error: "That phone number doesn't look right." };
    data[key] = rule.email ? value.toLowerCase() : value;
  }
  return { ok: true, data };
}

function labelOf(key: string) {
  return key.replace(/([A-Z])/g, " $1").toLowerCase();
}

/** Honeypot: bots fill hidden fields. Real users never see `website`. */
export function isBot(body: unknown) {
  return !!(body && typeof body === "object" && (body as Record<string, unknown>).website);
}
