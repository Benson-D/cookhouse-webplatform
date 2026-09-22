"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { groupByCategory } from "../utils";
import type { GroceryCategoryOverride, GroceryListItem } from "../types";
import { CategorySection } from "./CategorySection";
import { CheckedOffSection } from "./CheckedOffSection";

/**
 * The grocery list grouped into fixed category sections, drag-and-drop to
 * move an item between them. `onMoveToCategory` receives whichever of
 * ingredientId/label the dragged item carries, plus the section it landed
 * on — same shape `useSetGroceryCategoryOverride`'s `setCategoryOverride` expects.
 */
export function CategorizedGroceryList({
  items,
  overrides,
  onToggle,
  onRemove,
  onMoveToCategory,
}: {
  items: GroceryListItem[];
  overrides: GroceryCategoryOverride[];
  onToggle: (itemId: string, checked: boolean) => void;
  onRemove: (itemId: string) => void;
  onMoveToCategory: (
    item: { ingredientId: string | null; label: string | null },
    category: string
  ) => void;
}) {
  const { sections, checkedOff } = groupByCategory(items, overrides);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const dragged = active.data.current as { ingredientId: string | null; label: string | null };
    onMoveToCategory(dragged, String(over.id));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col pb-2">
        {sections.map(({ section, items: sectionItems }) => (
          <CategorySection
            key={section}
            section={section}
            items={sectionItems}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}

        {checkedOff.length > 0 && (
          <CheckedOffSection items={checkedOff} onToggle={onToggle} onRemove={onRemove} />
        )}
      </div>
    </DndContext>
  );
}
