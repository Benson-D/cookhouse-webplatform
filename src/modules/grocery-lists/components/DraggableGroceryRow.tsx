"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/cn";
import { displayName } from "../utils";
import type { GroceryListItem } from "../types";
import { GroceryListRow } from "./GroceryListRow";

/** A category-view row a household can drag into a different section. The drag handle is its own small element, not the whole row — the row itself still toggles the checkbox on click, same as the flat view. */
export function DraggableGroceryRow({
  item,
  onToggle,
  onRemove,
}: {
  item: GroceryListItem;
  onToggle: (checked: boolean) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { ingredientId: item.ingredientId, label: item.label },
  });

  return (
    <GroceryListRow
      ref={setNodeRef}
      item={item}
      onToggle={onToggle}
      onRemove={onRemove}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(isDragging && "z-20 rounded-md bg-surface opacity-55 shadow-lg -rotate-1")}
      dragHandle={
        <span
          {...attributes}
          {...listeners}
          aria-label={`Drag to move ${displayName(item)}`}
          className="relative z-10 cursor-grab select-none text-[13px] text-ink-faint touch-none"
        >
          ⠿
        </span>
      }
    />
  );
}
