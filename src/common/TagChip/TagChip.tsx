import { cn } from "@/lib/cn";

/**
 * Selectable pill. Selected chips carry the accent wash. Used both for
 * multi-select filtering (recipe tags — several can be `selected` at once)
 * and single-select choice (spending's date-range presets) — the component
 * only renders one chip's state, so which semantics apply is the caller's.
 */
export function TagChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "whitespace-nowrap rounded-full px-[11px] py-[4.5px] text-[12.5px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        selected
          ? "border border-transparent bg-accent-soft font-semibold text-accent"
          : "border border-line text-ink-soft hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}
