import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { activeProvider } from "@/lib/payments";
import CheckoutForm from "@/components/CheckoutForm";
import { Check } from "@/components/ui";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function EnrollPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { slug } = await params;
  const { cancelled } = await searchParams;
  const content = await getContent();
  const w = content.workshops.find((x) => x.slug === slug && x.published);
  if (!w) notFound();
  const provider = activeProvider();

  return (
    <section className="section pt-10 sm:pt-16">
      <div className="container grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Link href={`/workshops/${w.slug}`} className="text-sm text-zinc-400 hover:text-white">← Back to workshop</Link>
          <p className="eyebrow mt-6 flex">Enroll · Live on Zoom</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{w.title}</h1>
          <p className="mt-3 text-lg text-zinc-400">{w.tagline}</p>
          <div className="card mt-8 p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="font-display text-3xl font-bold text-white">{formatPrice(w.price, content.site.currency)}</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm text-zinc-300">
              <Check>{w.duration} · live with an instructor</Check>
              <Check>You build: {w.project}</Check>
              <Check>Certificate of completion</Check>
              <Check>Zoom link + schedule emailed to you</Check>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-ink-800 p-6 sm:p-8">
          {cancelled && (
            <p className="mb-5 rounded-xl bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">Payment was cancelled — no charge made. You can try again below.</p>
          )}
          {provider ? (
            <>
              <h2 className="text-2xl font-bold">Your details</h2>
              <p className="mt-1 text-sm text-zinc-400">We&apos;ll send your receipt and Zoom invite here.</p>
              <div className="mt-6">
                <CheckoutForm slug={w.slug} provider={provider} priceLabel={formatPrice(w.price, content.site.currency)} />
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-2xl font-bold">Enrollment opening soon</h2>
              <p className="mt-2 text-zinc-400">Online checkout isn&apos;t live yet. Drop us a line and we&apos;ll hold a seat for you.</p>
              <Link href="/contact" className="btn-primary mt-6">Reserve a seat →</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
