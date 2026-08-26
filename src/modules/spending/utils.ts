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
    return {
      from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    };
  }

  if (preset === "thisYear") {
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }

  const trailing = TRAILING_MONTHS[preset];
  if (trailing) {
    return { from: new Date(now.getFullYear(), now.getMonth() - (trailing - 1), 1), to: now };
  }

  // "thisMonth"
  return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
}

/** `trend`'s `month` field is `"YYYY-MM"` — the first-of-month through the last instant of that month. */
export function monthKeyToRange(monthKey: string): DateRange {
  const [year, month] = monthKey.split("-").map(Number);
  return {
    from: new Date(year, month - 1, 1),
    to: new Date(year, month, 0, 23, 59, 59, 999),
  };
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatMonthShort(monthKey: string): string {
  const [, month] = monthKey.split("-").map(Number);
  return MONTH_SHORT[month - 1];
}

export function formatMonthLong(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTH_LONG[month - 1]} ${year}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** The hero's subtitle range, e.g. "Aug 1–23, 2026" or "Mar 1 – Aug 23, 2026". */
export function formatRangeLabel(from: Date, to: Date): string {
  const sameMonth = from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth();
  const fromLabel = sameMonth
    ? `${MONTH_SHORT[from.getMonth()]} ${from.getDate()}`
    : `${MONTH_SHORT[from.getMonth()]} ${from.getDate()}, ${from.getFullYear()}`;
  const toLabel = `${sameMonth ? "" : `${MONTH_SHORT[to.getMonth()]} `}${to.getDate()}, ${to.getFullYear()}`;
  return `${fromLabel}–${toLabel}`;
}
