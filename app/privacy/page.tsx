import type { Metadata } from "next";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Privacy Policy" };

// TEMPLATE — have this reviewed by a lawyer before launch (e.g. for India's DPDP Act 2023 / GDPR).
export default async function PrivacyPage() {
  const { site } = await getContent();
  return (
    <section className="section">
      <div className="container prose-legal max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
        <p className="text-sm text-zinc-500">Last updated: {new Date().getFullYear()}</p>

        <p>
          This policy explains what personal data {site.name} (&quot;we&quot;, &quot;us&quot;) collects when you use our website, register for the
          hackathon or enroll in a workshop, and how we use and protect it.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Hackathon registration:</strong> name, email, college and phone number.</li>
          <li><strong>Workshop enrollment:</strong> name, email, phone, college, and optional Zoom session details (Zoom email, time zone, experience level, goals).</li>
          <li><strong>Payments:</strong> processed by our payment partner (e.g. Razorpay or Stripe). We do not see or store your card, UPI or bank details — only a payment reference and status.</li>
          <li><strong>Contact and partnership forms:</strong> the details you submit.</li>
          <li><strong>Technical data:</strong> basic logs (such as IP address and browser type) needed to run and secure the site.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To register you for the hackathon and send event updates, dates, rules and results.</li>
          <li>To deliver workshops you&apos;ve purchased, including Zoom invites, receipts and certificates.</li>
          <li>To tell you about our workshops and related opportunities. You can unsubscribe at any time.</li>
          <li>To respond to your messages and partnership enquiries.</li>
          <li>To prevent fraud and keep the platform secure.</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We don&apos;t sell your personal data. We share it only with service providers who help us run Prodathon (hosting, email delivery,
          payments, video conferencing), with partner colleges for event coordination where you&apos;ve registered through them, or when required
          by law.
        </p>

        <h2>Retention</h2>
        <p>We keep your data for as long as needed to run the events and workshops you signed up for, and to meet legal and accounting obligations.</p>

        <h2>Your rights</h2>
        <p>
          You can ask to access, correct or delete your personal data, or withdraw consent to marketing emails, by writing to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Minors</h2>
        <p>Prodathon is intended for college students. If you are under 18, please register with the consent of a parent or guardian.</p>

        <h2>Changes</h2>
        <p>We may update this policy. Material changes will be posted on this page with a new &quot;last updated&quot; date.</p>

        <h2>Contact</h2>
        <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </section>
  );
}
