"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/cn";
import type { GroceryCategorySection } from "../utils";
import type { GroceryListItem } from "../types";
import { DraggableGroceryRow } from "./DraggableGroceryRow";

/** One category's heading plus its rows — also the drop target a dragged row lands on. */
export function CategorySection({
  section,
  items,
  onToggle,
  onRemove,
}: {
  section: GroceryCategorySection;
  items: GroceryListItem[];
  onToggle: (itemId: string, checked: boolean) => void;
  onRemove: (itemId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: section });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "px-[22px] py-1",
        isOver &&
          "rounded-[10px] bg-accent-soft outline outline-1 outline-dashed outline-offset-[6px] outline-accent"
      )}
    >
      <div className="mb-0.5 mt-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
        {section}
      </div>
      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-line px-3 py-2.5 text-[12.5px] text-ink-faint">
          No items here right now
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col">
          {items.map((item) => (
            <DraggableGroceryRow
              key={item.id}
              item={item}
              onToggle={(checked) => onToggle(item.id, checked)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
