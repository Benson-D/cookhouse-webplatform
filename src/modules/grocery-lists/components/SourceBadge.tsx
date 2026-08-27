import { cn } from "@/lib/cn";
import { formatSource } from "../utils";

const VARIANT_CLASSES: Record<string, string> = {
  recipe: "bg-accent-soft text-accent",
  staple: "bg-amber-soft text-amber",
};

/**
 * Recipe/staple get their own colour, manual stays neutral.
 *
 * `alreadyStocked` overrides the label entirely — set when a recipe line was
 * pre-checked because the household was recently checked off for it as a
 * staple (see `getFreshlyStockedStaples` on the backend). Uses the same amber
 * tone as the staple badge: both mean "you don't need to act on this."
 */
export function SourceBadge({
  source,
  alreadyStocked = false,
}: {
  source: string;
  alreadyStocked?: boolean;
}) {
  if (alreadyStocked) {
    return (
      <span className="whitespace-nowrap rounded bg-amber-soft font-mono text-[9.5px] uppercase tracking-[0.05em] text-amber px-1.5 py-0.5">
        Stocked
      </span>
    );
  }

  return (
    <span
      className={cn(
        "whitespace-nowrap rounded font-mono text-[9.5px] uppercase tracking-[0.05em] px-1.5 py-0.5",
        VARIANT_CLASSES[source] ?? "bg-surface-2 text-ink-faint"
      )}
    >
      {formatSource(source)}
    </span>
  );
}
