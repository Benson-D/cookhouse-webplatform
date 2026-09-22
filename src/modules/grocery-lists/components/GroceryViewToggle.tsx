"use client";

import { cn } from "@/lib/cn";

export type GroceryListView = "list" | "categories";

const OPTIONS: { value: GroceryListView; label: string }[] = [
  { value: "list", label: "List" },
  { value: "categories", label: "Categories" },
];

/** Same two-segment pill as `ThemeToggle`, pointed at a different choice. */
export function GroceryViewToggle({
  view,
  onChange,
}: {
  view: GroceryListView;
  onChange: (view: GroceryListView) => void;
}) {
  return (
    <div className="inline-flex gap-px rounded-full border border-line p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-[5px] text-xs leading-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            view === option.value ? "bg-accent-soft font-semibold text-accent" : "text-ink-faint"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
