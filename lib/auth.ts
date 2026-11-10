import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pd_admin";

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";

export const adminEnabled = () => !!process.env.ADMIN_PASSWORD;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Session token = issuedAt.signature — expires after 7 days. */
export function issueToken() {
  const issued = String(Date.now());
  const sig = createHmac("sha256", secret()).update(`admin:${issued}`).digest("hex");
  return `${issued}.${sig}`;
}

export function verifyToken(token: string | undefined) {
  if (!adminEnabled() || !token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  if (Date.now() - Number(issued) > 7 * 24 * 60 * 60 * 1000) return false;
  const expected = createHmac("sha256", secret()).update(`admin:${issued}`).digest("hex");
  return safeEqual(sig, expected);
}

export function checkPassword(input: string) {
  return adminEnabled() && safeEqual(input, process.env.ADMIN_PASSWORD!);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}
