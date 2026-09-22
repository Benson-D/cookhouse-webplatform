"use client";

import type { GroceryListItem } from "../types";
import { GroceryListRow } from "./GroceryListRow";

/**
 * Every checked item, across every category, in one shared pile at the
 * bottom — not a real category, so it isn't a drop target and its rows
 * aren't draggable. Unchecking a row here just moves it back to its
 * category the normal way, via the same checkbox tap every row already has.
 */
export function CheckedOffSection({
  items,
  onToggle,
  onRemove,
}: {
  items: GroceryListItem[];
  onToggle: (itemId: string, checked: boolean) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <div className="px-[22px] py-1">
      <div className="mb-0.5 mt-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
        Checked off
      </div>
      <ul className="m-0 flex list-none flex-col">
        {items.map((item, index) => (
          <GroceryListRow
            key={item.id}
            item={item}
            onToggle={(checked) => onToggle(item.id, checked)}
            onRemove={() => onRemove(item.id)}
            dragHandle={<span aria-hidden className="text-[13px]" />}
            className={index === items.length - 1 ? "border-b-0" : undefined}
          />
        ))}
      </ul>
    </div>
  );
}
