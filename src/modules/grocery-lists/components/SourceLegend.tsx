import { SourceBadge } from "./SourceBadge";

const ENTRIES: { source: string; description: string }[] = [
  { source: "recipe", description: "merged in from a recipe" },
  { source: "staple", description: "added on a reminder" },
  { source: "manual", description: "typed in directly" },
];

/** Explains the three source badges once, rather than per row. */
export function SourceLegend() {
  return (
    <div className="flex flex-wrap gap-4 border-t border-line-soft bg-surface-2 px-[22px] py-3 text-[12.5px] text-ink-soft">
      {ENTRIES.map(({ source, description }) => (
        <div key={source} className="flex items-center gap-[7px]">
          <SourceBadge source={source} />
          {description}
        </div>
      ))}
    </div>
  );
}
