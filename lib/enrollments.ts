import "server-only";
import { enrollmentEmail, adminNotice, sendEmail } from "./email";
import { verifyPayment } from "./payments";
import { getRecord, updateRecord } from "./store";
import { formatPrice } from "./format";
import type { Enrollment } from "./types";

/**
 * Verify a payment and mark the enrollment paid. Idempotent: calling it twice
 * (e.g. page refresh on the Stripe success URL) won't double-send emails.
 */
export async function confirmEnrollment(id: string, proof: Record<string, string | undefined>): Promise<Enrollment | null> {
  const existing = await getRecord("enrollments", id);
  if (!existing) return null;
  if (existing.status === "paid") return existing;

  const paymentId = await verifyPayment(existing, proof);
  if (!paymentId) return existing;
  return markEnrollmentPaid(id, paymentId);
}

/**
 * Mark an enrollment paid and send emails once. Only call this after the payment
 * has been verified (by `confirmEnrollment` or a signature-checked webhook).
 */
export async function markEnrollmentPaid(id: string, paymentId: string): Promise<Enrollment | null> {
  const state = { justPaid: false };
  const updated = await updateRecord("enrollments", id, (cur) => {
    if (cur.status === "paid") return null;
    state.justPaid = true;
    return { ...cur, status: "paid", paidAt: new Date().toISOString(), providerPaymentId: paymentId };
  });

  if (updated && state.justPaid) {
    await sendEmail(enrollmentEmail(updated));
    const notice = adminNotice(`New enrollment: ${updated.workshopTitle}`, {
      Name: updated.name,
      Email: updated.email,
      College: updated.college,
      Amount: formatPrice(updated.amount, updated.currency),
      Provider: updated.provider,
    });
    if (notice) await sendEmail(notice);
  }
  return updated;
}
