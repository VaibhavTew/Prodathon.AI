import type { Session } from "./types";

// Session times are entered and displayed in IST, whatever the server or viewer's time zone.
const IST_OFFSET = "+05:30";
const TZ = "Asia/Kolkata";

export function sessionStart(s: Session): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s.start)) return null;
  const d = new Date(`${s.start}:00${IST_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Valid sessions, earliest first. */
export function sortedSessions(sessions: Session[] = []) {
  return sessions
    .map((s) => ({ s, start: sessionStart(s) }))
    .filter((x): x is { s: Session; start: Date } => x.start !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function formatSessionDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: TZ }).format(d);
}

export function formatSessionTime(start: Date, durationMins: number) {
  const f = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
  const end = new Date(start.getTime() + durationMins * 60_000);
  return `${f.format(start)} – ${f.format(end)} IST`;
}

const gcalStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Google Calendar "add event" link (no auth or API key needed). */
export function googleCalendarUrl(start: Date, durationMins: number, title: string, details: string) {
  const end = new Date(start.getTime() + durationMins * 60_000);
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${gcalStamp(start)}/${gcalStamp(end)}`, details });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
