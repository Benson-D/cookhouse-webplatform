import { differenceInCalendarDays } from "date-fns";

export const FREQUENCY_OPTIONS = [
  { label: "Weekly", days: 7 },
  { label: "Every 2 weeks", days: 14 },
  { label: "Monthly", days: 30 },
  { label: "Every 2 months", days: 60 },
] as const;

/** Falls back to a plain day count for anything outside the four presets — the backend takes a raw int, not just these four. */
export function formatFrequency(days: number): string {
  return FREQUENCY_OPTIONS.find((option) => option.days === days)?.label ?? `Every ${days} days`;
}

export type DueTone = "default" | "warn" | "late";

export type DueStatus = {
  /** "last added 12 days ago" | "never added yet". */
  lastAddedLabel: string;
  /** "due in 2 days" | "due tomorrow" | "due today" | "overdue by 4 days" | "due now". */
  statusLabel: string;
  tone: DueTone;
};

/**
 * `StapleReminder` has no due-date field — this is `lastAddedAt +
 * frequencyDays`, computed here rather than stored. Never-added reads as
 * "due now", not blank: nothing has ever satisfied the reminder, so it's the
 * most due a staple can be, not a missing value.
 */
export function computeDueStatus(
  lastAddedAt: Date | null,
  frequencyDays: number,
  now: Date = new Date()
): DueStatus {
  if (!lastAddedAt) {
    return { lastAddedLabel: "never added yet", statusLabel: "due now", tone: "warn" };
  }

  // Calendar days, not a raw millisecond division — a reminder checked off
  // at 11pm and viewed at 1am the next day is one day ago, not zero.
  const daysSinceAdded = differenceInCalendarDays(now, lastAddedAt);
  const lastAddedLabel = `last added ${daysSinceAdded} day${daysSinceAdded === 1 ? "" : "s"} ago`;
  const daysRemaining = frequencyDays - daysSinceAdded;

  if (daysRemaining < 0) {
    const overdueBy = -daysRemaining;
    return {
      lastAddedLabel,
      statusLabel: `overdue by ${overdueBy} day${overdueBy === 1 ? "" : "s"}`,
      tone: "late",
    };
  }
  if (daysRemaining === 0) {
    return { lastAddedLabel, statusLabel: "due today", tone: "warn" };
  }
  if (daysRemaining === 1) {
    return { lastAddedLabel, statusLabel: "due tomorrow", tone: "warn" };
  }
  return { lastAddedLabel, statusLabel: `due in ${daysRemaining} days`, tone: "default" };
}
