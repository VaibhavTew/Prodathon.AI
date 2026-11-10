import type { Metadata } from "next";
import Link from "next/link";
import { getRecord } from "@/lib/store";
import { confirmEnrollment } from "@/lib/enrollments";
import { formatPrice } from "@/lib/format";
import ZoomDetailsForm from "@/components/ZoomDetailsForm";

export const metadata: Metadata = { title: "You're enrolled", robots: { index: false } };

export default async function EnrollSuccess({ searchParams }: { searchParams: Promise<{ id?: string; session_id?: string }> }) {
  const { id, session_id } = await searchParams;
  let enr = id ? await getRecord("enrollments", id) : null;

  // Stripe returns here — verify the session server-side before showing success.
  if (enr && enr.status !== "paid" && session_id) {
    enr = await confirmEnrollment(enr.id, { session_id });
  }

  if (!enr || enr.status !== "paid") {
    return (
      <section className="section">
        <div className="container max-w-xl text-center">
          <h1 className="text-4xl font-bold">We&apos;re still confirming your payment</h1>
          <p className="lead mt-4">
            This can take a minute. If you were charged and don&apos;t get a confirmation email shortly, contact us with your payment reference
            and we&apos;ll sort it out fast.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/contact" className="btn-primary">Contact us</Link>
            <Link href="/workshops" className="btn-ghost">Back to workshops</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section relative overflow-hidden pt-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="container relative grid max-w-5xl gap-8 lg:grid-cols-2">
        <div>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl font-bold text-ink shadow-glow">✓</div>
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">You&apos;re enrolled, {enr.name.split(" ")[0]}.</h1>
          <p className="lead mt-4">
            Payment confirmed for <span className="text-white">{enr.workshopTitle}</span> ({formatPrice(enr.amount, enr.currency)}). A confirmation
            email is on its way to <span className="text-white">{enr.email}</span>.
          </p>
          <ol className="mt-8 space-y-4">
            {[
              ["Add your Zoom details", "So your invite lands in the right inbox."],
              ["Watch your email", "Zoom link, schedule and setup checklist arrive before session one."],
              ["Show up & build", "Bring your laptop and questions. Leave with a project."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/50 font-display text-sm font-bold text-accent">{i + 1}</span>
                <div><p className="font-semibold text-white">{t}</p><p className="text-sm text-zinc-400">{b}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-zinc-500">Order reference: {enr.id}</p>
        </div>
        <div className="rounded-[2rem] border border-line bg-ink-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Zoom session details</h2>
          <p className="mt-1 text-sm text-zinc-400">Takes 20 seconds. Helps your instructor prep for you.</p>
          <div className="mt-6">
            <ZoomDetailsForm id={enr.id} defaultEmail={enr.zoom?.zoomEmail || enr.email} done={!!enr.zoom} />
          </div>
        </div>
      </div>
    </section>
  );
}
