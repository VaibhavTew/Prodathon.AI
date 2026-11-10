// Content for the "Partner with us" page (/colleges). Plain data so client components can import it.

export type Audience = "college" | "company";

export type PartnerPlan = {
  id: string;
  t: string;
  /** free = no cost; quote = custom pricing via a quote request; link = handled on another page */
  price: "free" | "quote" | "link";
  b: string;
  items: string[];
  quoteBasis?: string; // what the quote depends on, shown under "Custom pricing"
  href?: string; // for price === "link"
  highlight?: boolean;
};

export type AudienceInfo = {
  label: string;
  icon: string;
  title: string;
  blurb: string;
  points: string[];
  benefitsTitle: string;
  benefits: { t: string; b: string }[];
  plans: PartnerPlan[];
  sizeLabel: string; // quote form: "Approx. number of students" / "Team size"
  formats: string[];
};

export const AUDIENCES: Record<Audience, AudienceInfo> = {
  college: {
    label: "Colleges",
    icon: "🎓",
    title: "Colleges & universities",
    blurb: "A free AI hackathon for your students, plus optional workshops for students and faculty.",
    points: ["Free for the college", "Certificates & portfolios for students", "Results report afterward"],
    benefitsTitle: "What your college gets",
    benefits: [
      { t: "Zero cost to the college", b: "Partnering is free and students compete free. No budget approvals needed." },
      { t: "Real AI exposure", b: "Students build working AI products, not just attend a seminar." },
      { t: "Placement-ready portfolios", b: "Every participant leaves with a project and a certificate." },
      { t: "Visibility & recognition", b: "Partner colleges are featured on our site, socials and demo day." },
      { t: "Results for your college", b: "We share how your students did, with their top projects." },
      { t: "One point of contact", b: "A coordinator handles your questions from kickoff to demo day." },
    ],
    plans: [
      {
        id: "campus-partner",
        t: "Campus partner",
        price: "free",
        b: "Your students compete in the national hackathon. We provide posters, a registration link and judging.",
        items: ["Free entry for every student", "Logo on our partner wall", "Results summary after the event"],
      },
      {
        id: "campus-workshops",
        t: "Campus workshop package",
        price: "quote",
        quoteBasis: "number of students, workshops chosen and schedule",
        b: "Live workshops just for your students, run on your schedule. Suits training & placement budgets.",
        items: ["Any of our workshops or programs", "Batch pricing per student", "Completion certificates", "Attendance report for your records"],
        highlight: true,
      },
      {
        id: "faculty-programme",
        t: "Faculty development programme",
        price: "quote",
        quoteBasis: "number of faculty, duration and format",
        b: "Hands-on AI training for faculty, so they can bring AI tools into their own teaching and labs.",
        items: ["Practical, tool-first sessions", "Certificates for participants", "Online or on campus"],
      },
    ],
    sizeLabel: "Approx. number of students / faculty",
    formats: ["Online (Zoom)", "On campus", "Hybrid"],
  },
  company: {
    label: "Companies",
    icon: "🏢",
    title: "Companies & startups",
    blurb: "Upskill your teams, hire early AI talent and put your tools in builders' hands.",
    points: ["Private team training", "Hiring and demo-day access", "Challenge and brand sponsorship"],
    benefitsTitle: "What your company gets",
    benefits: [
      { t: "Train your teams", b: "Hands-on sessions on AI agents, Claude, MCP and rapid POCs, on your schedule." },
      { t: "Meet early AI talent", b: "See builders ship working products under time pressure, which tells you more than a résumé." },
      { t: "Get your tools used", b: "Back a challenge built on your API, model or platform." },
      { t: "Reach campuses", b: "Work with our partner colleges on talent programs, events and visibility." },
    ],
    plans: [
      {
        id: "corporate-training",
        t: "Corporate training",
        price: "quote",
        quoteBasis: "team size, topics and format",
        b: "Private batches for your team, from a half-day session to the full 16-week Product Management Fellowship.",
        items: ["Tailored to your tools and use cases", "Live, instructor-led on Zoom or on site", "Hands-on project per participant", "Completion certificates"],
        highlight: true,
      },
      {
        id: "hiring-partner",
        t: "Hiring partner",
        price: "quote",
        quoteBasis: "number of roles and events",
        b: "Meet and hire from the strongest teams in our hackathons and programs.",
        items: ["Profiles of opted-in participants", "Demo-day access", "Interview day with top teams"],
      },
      {
        id: "challenge-sponsor",
        t: "Challenge sponsor",
        price: "link",
        href: "/sponsors",
        b: "Own a challenge track built around your product or problem.",
        items: ["A named prize track", "Judge seat at demo day", "Logo and social visibility"],
      },
    ],
    sizeLabel: "Team size",
    formats: ["Online (Zoom)", "On site at your office", "Hybrid"],
  },
};

export const STEPS: [string, string][] = [
  ["Pick your path", "Choose college or company and the package that fits, or just tell us what you have in mind."],
  ["Quick intro call", "We walk you through what we can do together. For paid packages you get a written quote."],
  ["We handle the rest", "We plan the details, run the sessions or events, and report back with results."],
];
