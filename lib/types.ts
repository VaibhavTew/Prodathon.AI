// Shape of all admin-editable site content. Edit via /admin or data/content.json.

export type Workshop = {
  slug: string; // url id, lowercase-with-dashes
  title: string;
  tagline: string; // one-line value prop shown on the tile
  description: string; // longer pitch for the detail page
  price: number; // in major currency units (e.g. 1499 = ₹1,499)
  compareAtPrice?: number; // optional "was" price
  tag?: string; // small badge e.g. "Most popular"
  image?: string; // optional image URL; tiles fall back to a generated graphic
  duration: string; // e.g. "2 live sessions · 4 hrs"
  schedule: string; // e.g. "Weekend batch · dates announced soon"
  level: string; // e.g. "Beginner friendly"
  learn: string[];
  forWho: string[];
  project: string; // what you walk away having built
  published: boolean;
  instructor?: Instructor; // hidden on the page until a name is set
  agenda?: AgendaItem[]; // session-by-session curriculum, rendered as an accordion
  sessions?: Session[]; // concrete dates; when empty, `schedule` text is shown instead
  tools?: string[]; // tools/stack chips, e.g. "Python", "OpenAI API"
  emiPerMonth?: number; // optional "or ₹X/month" EMI line on the price card
  highlights?: { value: string; label: string }[]; // stats strip under the hero, e.g. { "16", "weeks" }
  comparison?: { benefit: string; others: string; us: string }[]; // "Why choose us" table
  projects?: { title: string; body: string }[]; // real-world projects section
};

export type Instructor = { name: string; role: string; company?: string; bio?: string; image?: string; linkedin?: string };

export type AgendaItem = { title: string; topics: string[] };

/** `start` is IST wall-clock time as "YYYY-MM-DDTHH:mm" (what <input type="datetime-local"> produces). */
export type Session = { start: string; durationMins: number; title?: string };

export type Logo = { name: string; image?: string; url?: string };

export type Testimonial = { quote: string; name: string; role: string; avatar?: string };

export type ProgressConfig = {
  /** auto = baseline + real registrations; manual = use manualCount */
  mode: "auto" | "manual";
  manualCount: number;
  baseline: number;
  goal: number;
  /** The bar never displays below this %, so early numbers read as momentum. */
  minDisplayPercent: number;
  /** Use {percent} as placeholder, e.g. "{percent}% to launch" */
  label: string;
};

export type FAQItem = { q: string; a: string };

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  tag?: string; // badge on the card, e.g. "Founder", "Co-founder"
  experience?: string; // e.g. "6 yrs"
  highlights?: string[]; // "AI expertise" chips
  companies?: { name: string; logo?: string }[]; // "Experience at" tiles, in career order. Logo: /logos/companies/x.png or https URL
  education?: string; // e.g. "PGDM"
};

export type Content = {
  site: {
    name: string;
    tagline: string;
    email: string;
    phone?: string;
    location?: string;
    currency: string; // ISO code, e.g. "INR" or "USD"
    socials: { label: string; url: string }[];
  };
  hackathon: {
    dateLabel: string;
    format: { title: string; body: string }[];
    eligibility: string[];
    prizes: { place: string; reward: string; note?: string }[];
    rules: string[];
    faq: FAQItem[];
  };
  progress: ProgressConfig;
  workshops: Workshop[];
  colleges: Logo[];
  sponsors: Logo[];
  testimonials: Testimonial[];
  team: TeamMember[];
};

export type Registration = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  college: string;
  phone: string;
  source?: string;
};

export type Enrollment = {
  id: string;
  createdAt: string;
  paidAt?: string;
  status: "pending" | "paid" | "failed";
  workshopSlug: string;
  workshopTitle: string;
  amount: number;
  currency: string;
  provider: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  zoom?: { zoomEmail?: string; timezone?: string; experience?: string; goal?: string };
};

export type Lead = {
  id: string;
  createdAt: string;
  type: "partner" | "sponsor" | "contact";
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  message: string;
};
