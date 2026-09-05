"use client";

import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/formatAmount";
import { shouldHideAmount } from "../utils";
import type { GroceryListItem } from "../types";
import { SourceBadge } from "./SourceBadge";

/**
 * One row, at its own mobile-width column set as the only layout — no
 * per-row "who" column, so there's no breakpoint fallback to make room for
 * one (see root CLAUDE.md). A null `quantity` renders as an em dash, never
 * `0` or hidden — and a volume-type unit's real quantity gets the same
 * em-dash treatment via `shouldHideAmount`, since nobody shops by the cup.
 *
 * **The whole row toggles the checkbox, not just the box** — the same
 * `after:absolute after:inset-0` stretch `RecipeCard` uses. The remove
 * button needs `relative z-10` to win back its own clicks, since the
 * stretch would otherwise win the DOM-order tie.
 */
export function GroceryListRow({
  item,
  onToggle,
  onRemove,
}: {
  item: GroceryListItem;
  onToggle: (checked: boolean) => void;
  onRemove: () => void;
}) {
  const hideAmount = shouldHideAmount(item.unit);

  return (
    <li className="relative grid grid-cols-[20px_76px_1fr_auto] items-center gap-3 border-b border-line-soft px-3 py-2.5 text-sm hover:bg-surface-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={item.checked}
        aria-label={item.ingredient.name}
        onClick={() => onToggle(!item.checked)}
        className={cn(
          "grid h-[17px] w-[17px] place-items-center rounded-[5px] border-[1.5px] text-[10px] font-bold transition duration-140 after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.88]",
          item.checked
            ? "animate-check-pop border-accent bg-accent text-accent-ink"
            : "border-line bg-surface"
        )}
      >
        {item.checked && "✓"}
      </button>

      <span
        className={cn(
          "tabular text-right font-mono text-[12.5px]",
          item.quantity === null || hideAmount ? "text-ink-faint" : "text-ink",
          item.checked && "text-ink-faint line-through"
        )}
      >
        {formatAmount(hideAmount ? null : item.quantity, item.unit)}
      </span>

      <span
        className={cn("font-medium", item.checked ? "text-ink-faint line-through" : "text-ink")}
      >
        {item.ingredient.name}
      </span>

      <div className="relative z-10 flex items-center gap-2">
        <SourceBadge source={item.source} alreadyStocked={item.checked && !item.checkedBy} />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.ingredient.name}`}
          className="text-[15px] text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </div>
    </li>
  );
}
