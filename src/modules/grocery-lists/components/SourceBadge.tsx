import { cn } from "@/lib/cn";
import { formatSource } from "../utils";

const VARIANT_CLASSES: Record<string, string> = {
  recipe: "bg-accent-soft text-accent",
  staple: "bg-amber-soft text-amber",
};

/** Recipe/staple get their own colour, manual stays neutral. */
export function SourceBadge({ source }: { source: string }) {
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
