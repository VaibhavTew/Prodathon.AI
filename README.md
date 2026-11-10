# Prodathon

Website for the Prodathon AI hackathon (free) and live Zoom AI workshops (paid).
Next.js 15 (App Router) + Tailwind CSS. No database server required to get started.

## Quick start

```bash
npm install
cp .env.example .env.local     # set ADMIN_PASSWORD at minimum
npm run dev                    # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin**. Sign in with the password in `ADMIN_PASSWORD`.

## The funnel

| Step | Where | What happens |
|---|---|---|
| Free registration | Hero CTA → `/hackathon#register`, home CTA band (inline form) | 4 fields: name, email, college, phone. Saved to `registrations`. |
| Cross-sell | `/thank-you` + welcome email | "You're in! Now get ready to win" with workshop tiles |
| Paid enrollment | `/workshops` → `/workshops/[slug]` → `/enroll/[slug]` | Checkout via Razorpay / Stripe / mock |
| Post-payment | `/enroll/success` + confirmation email | Captures Zoom email, time zone, experience, goals |

## Editing content (no code)

Everything editable lives in `/admin`:

- **Progress bar**: auto (baseline + real sign-ups) or manual count, the goal, the minimum display % (so low numbers still look like momentum), the label (`{percent}% to launch`) and the event date label (`Coming Soon`).
- **Workshops**: add, edit, reorder, hide or delete modules. Each one automatically gets a tile, a detail page at `/workshops/<slug>`, a checkout page and a sitemap entry. Each workshop can also have:
  - an instructor (hidden until a name is set)
  - a session-by-session agenda
  - tools chips
  - real session dates in IST. Once dates are set, the page shows a schedule with "Add to calendar" links, and the price card shows the start date instead of the schedule text.
- **Logos & testimonials**: partner colleges, sponsors and quotes. These layouts handle small numbers: 0 logos shows an invite card, 1–5 shows a grid plus a "Your college next?" tile, and 6 or more shows a scrolling marquee. 0 testimonials hides the block and 1 shows a large featured quote.
- **All content (JSON)**: site email, phone, socials, currency, hackathon format, eligibility, prizes, rules, FAQ, and team.
- **Submissions**: registrations, enrollments and leads, with CSV export.

Images: drop files into `public/logos/` or `public/workshops/` and reference them as `/logos/x.png`, or paste any https URL.

Admin saves go to `data/content.json`. Until the first save, the site uses the seed content in `lib/defaults.ts`.

## Payments

Set `PAYMENT_PROVIDER` to `razorpay`, `stripe` or `mock`. If you leave it empty, the provider is picked based on which keys are set.

- **Razorpay**: set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Checkout opens on the page. The server verifies the HMAC signature before marking an order paid.
- **Stripe**: set `STRIPE_SECRET_KEY`. Customers are redirected to Stripe Checkout, and the server checks the session when they come back.
- **mock**: marks orders paid with no charge, for testing. **It is blocked in production** unless `ALLOW_MOCK_PAYMENTS=true`. If no real provider is configured in production, checkout pages show "Reserve a seat → Contact" instead.

Prices always come from server-side content. The browser can't change them. To add a gateway, extend `createPayment` and `verifyPayment` in `lib/payments.ts`.

**Webhook (set this up before going live):** point your provider at `https://<your-domain>/api/payments/webhook`. That way a payment still gets confirmed if the student closes the tab mid-redirect.

- Razorpay: subscribe to `order.paid` and set `RAZORPAY_WEBHOOK_SECRET`.
- Stripe: subscribe to `checkout.session.completed` and set `STRIPE_WEBHOOK_SECRET`.

Signatures are verified, and confirmation is idempotent, so the browser flow and the webhook can't double-send emails.

## Storage

`lib/store.ts` is a small JSON-file store in `DATA_DIR` (default `./data`, which is gitignored because it holds student PII). It works on any host with a persistent disk: a VPS, Railway or Render with a volume, or Docker with a volume.

- **Vercel / serverless:** files don't persist between requests there. Re-implement the functions in `lib/store.ts` against Supabase, Postgres, Firebase or similar. Nothing else in the app touches storage.
- **Mirror to Sheets/Airtable:** set `FORM_WEBHOOK_URL` and every new record is also POSTed as JSON. Zapier, Make or a Google Apps Script can catch it.

## Email

Set `RESEND_API_KEY` and `EMAIL_FROM` to send through [Resend](https://resend.com). Without a key, emails are logged to the console. Emails sent:

- welcome email on registration, which promotes the workshops
- enrollment confirmation
- internal notifications to `ADMIN_EMAIL` for new leads and enrollments

## Before launch checklist

- [ ] Replace placeholder copy: prizes, team, socials, contact email (`/admin` → All content)
- [ ] Have a lawyer review `/privacy` and `/terms` (DPDP Act / GDPR), especially the refund policy
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Configure payment keys and send a live test payment
- [ ] Configure Resend and verify your sending domain
- [ ] Set a strong `ADMIN_PASSWORD`
- [ ] Add an OG image at `app/opengraph-image.png` (1200×630)

## Re-skinning

The accent color is set in one place: `accent` in `tailwind.config.ts` (currently `#C6FF3D`). Fonts are loaded in `app/layout.tsx`.
