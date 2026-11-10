import "server-only";
import { formatPrice, siteUrl } from "./format";
import type { Content, Enrollment, Lead, Registration } from "./types";

/**
 * Email is sent through Resend (https://resend.com) when RESEND_API_KEY is set.
 * Otherwise messages are logged to the console so local dev works with no setup.
 * To use another provider, replace `sendEmail` only.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Prodathon <onboarding@resend.dev>";
  if (!key) {
    console.log(`[email:dev] to=${opts.to} subject="${opts.subject}"`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[email] send failed", res.status, await res.text());
  } catch (err) {
    console.error("[email] send error", err);
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(body: string) {
  return `<!doctype html><html><body style="margin:0;background:#07070B;font-family:Arial,Helvetica,sans-serif;color:#E9E9F0">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<div style="font-size:22px;font-weight:800;letter-spacing:-.5px;color:#fff">Prodathon<span style="color:#C6FF3D">.</span></div>
${body}
<p style="margin-top:40px;font-size:12px;color:#777">You're receiving this because you signed up at ${esc(siteUrl)}.
<a href="${siteUrl}/privacy" style="color:#999">Privacy</a></p></div></body></html>`;
}

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#C6FF3D;color:#07070B;font-weight:700;text-decoration:none;padding:14px 22px;border-radius:999px">${esc(label)}</a>`;

export function registrationEmail(reg: Registration, content: Content) {
  const first = esc(reg.name.split(" ")[0] || "there");
  const items = content.workshops
    .filter((w) => w.published)
    .slice(0, 3)
    .map(
      (w) =>
        `<li style="margin:0 0 10px"><a href="${siteUrl}/workshops/${w.slug}" style="color:#C6FF3D;font-weight:700">${esc(w.title)}</a> — ${esc(w.tagline)} <span style="color:#999">(${formatPrice(w.price, content.site.currency)})</span></li>`,
    )
    .join("");
  return {
    to: reg.email,
    subject: "You're in for Prodathon 🎉 Here's how to actually win",
    html: layout(`
<h1 style="font-size:28px;line-height:1.2;color:#fff;margin:28px 0 12px">You're in, ${first}.</h1>
<p style="font-size:16px;line-height:1.6">Your free spot at the Prodathon AI hackathon is locked. We'll email you the moment dates drop.</p>
<p style="font-size:16px;line-height:1.6">Here's the honest truth: most teams spend half the hackathon figuring out the tools. The teams that place already know them.</p>
<p style="font-size:16px;line-height:1.6"><strong style="color:#fff">Our live Zoom workshops get you there first</strong> — real instructor, real project, certificate included.</p>
<ul style="padding-left:18px;font-size:15px;line-height:1.5">${items}</ul>
<p style="margin:28px 0">${button(`${siteUrl}/workshops`, "See live workshops →")}</p>`),
  };
}

export function enrollmentEmail(enr: Enrollment) {
  const first = esc(enr.name.split(" ")[0] || "there");
  return {
    to: enr.email,
    subject: `Confirmed: ${enr.workshopTitle} — live on Zoom`,
    html: layout(`
<h1 style="font-size:28px;line-height:1.2;color:#fff;margin:28px 0 12px">You're enrolled, ${first}.</h1>
<p style="font-size:16px;line-height:1.6">Payment received for <strong style="color:#fff">${esc(enr.workshopTitle)}</strong> (${formatPrice(enr.amount, enr.currency)}).</p>
<p style="font-size:16px;line-height:1.6">Your Zoom link, schedule and prep checklist will be emailed before the first session. Add your Zoom details below if you haven't already, so we send the invite to the right place.</p>
<p style="margin:28px 0">${button(`${siteUrl}/enroll/success?id=${enr.id}`, "Add Zoom details")}</p>
<p style="font-size:13px;color:#999">Order reference: ${esc(enr.id)}</p>`),
  };
}

export function adminNotice(subject: string, fields: Record<string, string | undefined>) {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return null;
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#999">${esc(k)}</td><td>${esc(String(v))}</td></tr>`)
    .join("");
  return { to, subject: `[Prodathon] ${subject}`, html: layout(`<h2 style="color:#fff">${esc(subject)}</h2><table>${rows}</table>`) };
}

export function leadNotice(lead: Lead) {
  const subject =
    lead.type === "partner" ? "New college partnership lead" : lead.type === "sponsor" ? "New sponsor enquiry" : "New contact message";
  return adminNotice(subject, {
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Organization: lead.organization,
    Role: lead.role,
    Message: lead.message,
  });
}
