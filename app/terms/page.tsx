import type { Metadata } from "next";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Terms of Service" };

// TEMPLATE — have this reviewed by a lawyer before launch, especially the refund policy.
export default async function TermsPage() {
  const { site } = await getContent();
  return (
    <section className="section">
      <div className="container prose-legal max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Terms of Service</h1>
        <p className="text-sm text-zinc-500">Last updated: {new Date().getFullYear()}</p>

        <p>By using the {site.name} website, registering for the hackathon or enrolling in a workshop, you agree to these terms.</p>

        <h2>The hackathon</h2>
        <ul>
          <li>Registration and participation in the hackathon are free.</li>
          <li>Eligibility, format, judging criteria and prizes are described on the Hackathon page and in the rulebook shared with registrants. We may update them before the event.</li>
          <li>Purchasing a workshop is never required to participate, and has no effect on judging.</li>
          <li>You keep ownership of what you build. By submitting, you allow us to showcase your project name, team name and demo for promotional purposes.</li>
          <li>We may disqualify entries that break the rules or our code of conduct.</li>
        </ul>

        <h2>Workshops</h2>
        <ul>
          <li>Workshops are delivered live over Zoom. Schedules are communicated by email after enrollment.</li>
          <li>Prices are shown at checkout, inclusive of applicable taxes unless stated otherwise.</li>
          <li>Your enrollment is personal and may not be shared or resold.</li>
          <li>Workshop materials and recordings are for your personal learning only.</li>
        </ul>

        <h2>Payments & refunds</h2>
        <ul>
          <li>Payments are processed securely by our payment partner.</li>
          <li>If we cancel or reschedule a workshop and you can&apos;t attend the new date, you&apos;ll get a full refund.</li>
          <li>You may request a full refund up to 48 hours before the first live session. After that, we can offer a transfer to a later batch.</li>
          <li>To request a refund, email <a href={`mailto:${site.email}`}>{site.email}</a> with your order reference.</li>
        </ul>

        <h2>Code of conduct</h2>
        <p>Be respectful in all sessions, channels and events. Harassment, cheating or disruptive behavior may result in removal without refund.</p>

        <h2>Liability</h2>
        <p>
          We do our best to run great events and workshops, but we provide them &quot;as is&quot;. To the extent permitted by law, we aren&apos;t
          liable for indirect losses arising from your use of the site, events or workshops.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms. Continued use after changes means you accept the updated terms.</p>

        <h2>Contact</h2>
        <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </section>
  );
}
