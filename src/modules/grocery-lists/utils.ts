/**
 * Pure, React-free helpers for the grocery-lists module — promote to `lib/`
 * only once a second module needs the same thing.
 */

/** A person's initials for source-of-truth-free display, or a placeholder for nobody. */
export function initials(
  person: { firstName: string | null; lastName: string | null; email: string } | null
): string {
  if (!person) return "—";
  const fromNames = [person.firstName, person.lastName]
    .filter((part): part is string => Boolean(part))
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return fromNames || person.email[0]!.toUpperCase();
}

/** "started Tue" — a terse, weekday-only date. */
export function formatStartedDay(date: Date): string {
  return `started ${date.toLocaleDateString(undefined, { weekday: "short" })}`;
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** "4 min ago" / "3 hr ago" / "2 days ago" — coarse on purpose, this is a footer, not a log. */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < MINUTE_MS) return "just now";
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)} min ago`;
  if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)} hr ago`;
  return `${Math.floor(elapsed / DAY_MS)} days ago`;
}

const SOURCE_LABELS: Record<string, string> = {
  recipe: "recipe",
  staple: "staple",
  manual: "manual",
};

/** Falls back to the raw value for any source the UI doesn't have a specific label for. */
export function formatSource(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
