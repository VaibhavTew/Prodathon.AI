import "server-only";
import { getContent, listRecords } from "./store";

export type ProgressData = {
  percent: number;
  label: string;
  /** Momentum line, e.g. "+14 joined today". Always positive framing. */
  momentum: string;
  dateLabel: string;
};

export async function getProgress(): Promise<ProgressData> {
  const [content, regs] = await Promise.all([getContent(), listRecords("registrations")]);
  const cfg = content.progress;

  const count = cfg.mode === "manual" ? cfg.manualCount : cfg.baseline + regs.length;
  const goal = Math.max(1, cfg.goal);
  const raw = Math.floor((count / goal) * 100);
  const percent = Math.min(100, Math.max(cfg.minDisplayPercent, raw));

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const today = regs.filter((r) => Date.parse(r.createdAt) > dayAgo).length;
  const week = regs.filter((r) => Date.parse(r.createdAt) > weekAgo).length;

  // Only surface real numbers when they look good; otherwise use evergreen momentum copy.
  let momentum = "Early registrants get first dibs on workshop seats";
  if (percent >= 100) momentum = "Goal reached — dates dropping soon";
  else if (today >= 5) momentum = `+${today} joined in the last 24 hours`;
  else if (week >= 10) momentum = `+${week} joined this week`;
  else if (percent >= 60) momentum = "Almost there — dates unlock at 100%";

  return {
    percent,
    label: cfg.label.replace("{percent}", String(percent)),
    momentum,
    dateLabel: content.hackathon.dateLabel,
  };
}
