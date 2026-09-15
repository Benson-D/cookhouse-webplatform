import Link from "next/link";
import { SourceBadge } from "./SourceBadge";

const ENTRIES: { source: string; description: string }[] = [
  { source: "recipe", description: "merged in from a recipe" },
  { source: "staple", description: "added on a reminder" },
  { source: "manual", description: "typed in directly" },
];

/**
 * Explains the three source badges once, rather than per row. The link to
 * manage staples lives here, not as a fourth header button — it's what this
 * legend is already explaining ("staple = added on a reminder").
 */
export function SourceLegend() {
  return (
    <div className="flex flex-col items-start gap-2.5 border-t border-line-soft bg-surface-2 px-[22px] py-3 text-[12.5px] text-ink-soft md:flex-row md:flex-wrap md:items-center md:gap-4">
      {ENTRIES.map(({ source, description }) => (
        <div key={source} className="flex items-center gap-[7px]">
          <SourceBadge source={source} />
          {description}
        </div>
      ))}

      <Link
        href="/grocery-list/staples"
        className="cursor-pointer underline decoration-1 underline-offset-2 hover:text-ink md:ml-auto"
      >
        Manage staples →
      </Link>
    </div>
  );
}
