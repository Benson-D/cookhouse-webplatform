"use client";

import { cn } from "@/lib/cn";

/** A quiet link that reveals or re-hides every category section with nothing in it right now. */
export function ShowAllCategoriesToggle({
  show,
  onToggle,
  className,
}: {
  show: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-fit cursor-pointer text-xs text-ink-faint underline decoration-1 underline-offset-2 hover:text-ink",
        className
      )}
    >
      {show ? "Hide empty categories" : "Show all categories"}
    </button>
  );
}
