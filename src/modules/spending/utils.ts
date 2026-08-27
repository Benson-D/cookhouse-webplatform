import { endOfMonth, format, isSameMonth, startOfMonth, startOfYear, subMonths } from "date-fns";
import type { DateRange, RangePreset } from "./types";

export const RANGE_PRESETS: { id: RangePreset; label: string }[] = [
  { id: "thisMonth", label: "This month" },
  { id: "lastMonth", label: "Last month" },
  { id: "3mo", label: "3 mo" },
  { id: "6mo", label: "6 mo" },
  { id: "9mo", label: "9 mo" },
  { id: "12mo", label: "12 mo" },
  { id: "thisYear", label: "This year" },
];

const TRAILING_MONTHS: Partial<Record<RangePreset, number>> = {
  "3mo": 3,
  "6mo": 6,
  "9mo": 9,
  "12mo": 12,
};

/**
 * All seven presets, computed client-side into plain `from`/`to` — the
 * backend has no preset concept of its own (see root CLAUDE.md's domain
 * rules). Changing the preset re-runs every report against the same range,
 * so the hero number, chart, and both bar-lists never disagree.
 */
export function resolveRangePreset(preset: RangePreset): DateRange {
  const now = new Date();

  if (preset === "lastMonth") {
    const lastMonth = subMonths(now, 1);
    return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
  }

  if (preset === "thisYear") {
    return { from: startOfYear(now), to: now };
  }

  const trailing = TRAILING_MONTHS[preset];
  if (trailing) {
    return { from: startOfMonth(subMonths(now, trailing - 1)), to: now };
  }

  // "thisMonth"
  return { from: startOfMonth(now), to: now };
}

/** `trend`'s `month` field is `"YYYY-MM"` — the first-of-month through the last instant of that month. */
export function monthKeyToRange(monthKey: string): DateRange {
  const [year, month] = monthKey.split("-").map(Number);
  const firstOfMonth = new Date(year, month - 1, 1);
  return { from: firstOfMonth, to: endOfMonth(firstOfMonth) };
}

export function formatMonthShort(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return format(new Date(year, month - 1, 1), "MMM");
}

export function formatMonthLong(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return format(new Date(year, month - 1, 1), "MMMM yyyy");
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** The hero's subtitle range, e.g. "Aug 1–23, 2026" or "Mar 1 – Aug 23, 2026". */
export function formatRangeLabel(from: Date, to: Date): string {
  const sameMonth = isSameMonth(from, to);
  const fromLabel = format(from, sameMonth ? "MMM d" : "MMM d, yyyy");
  const toLabel = format(to, sameMonth ? "d, yyyy" : "MMM d, yyyy");
  return `${fromLabel}–${toLabel}`;
}
