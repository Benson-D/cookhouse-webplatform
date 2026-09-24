"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { ALL_GROCERY_CATEGORY_SECTIONS, type GroceryCategorySection } from "../utils";
import type { GroceryListItem } from "../types";
import { CategorySection } from "./CategorySection";
import { CheckedOffSection } from "./CheckedOffSection";
import { ShowAllCategoriesToggle } from "./ShowAllCategoriesToggle";

/**
 * The grocery list grouped into fixed category sections, drag-and-drop to
 * move an item between them. `onMoveToCategory` receives whichever of
 * ingredientId/label the dragged item carries, plus the section it landed
 * on — same shape `useSetGroceryCategoryOverride`'s `setCategoryOverride` expects.
 *
 * A category with nothing in it is hidden by default (an empty header for
 * every unused section would be clutter) — `showAllCategories` reveals the
 * rest so there's somewhere to drag an item that doesn't belong in any
 * populated section yet. That control also renders on its own row on
 * mobile (see `GroceryListScreen`), so grouping and the show/hide state
 * both live one level up rather than here.
 */
export function CategorizedGroceryList({
  sections,
  checkedOff,
  hasHiddenSections,
  showAllCategories,
  onToggleShowAllCategories,
  onToggle,
  onRemove,
  onMoveToCategory,
}: {
  sections: { section: GroceryCategorySection; items: GroceryListItem[] }[];
  checkedOff: GroceryListItem[];
  hasHiddenSections: boolean;
  showAllCategories: boolean;
  onToggleShowAllCategories: () => void;
  onToggle: (itemId: string, checked: boolean) => void;
  onRemove: (itemId: string) => void;
  onMoveToCategory: (
    item: { ingredientId: string | null; label: string | null },
    category: string
  ) => void;
}) {
  const bySection = new Map(sections.map((s) => [s.section, s.items]));
  const visibleSections = ALL_GROCERY_CATEGORY_SECTIONS.filter(
    (section) => bySection.has(section) || showAllCategories
  ).map((section) => ({ section, items: bySection.get(section) ?? [] }));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const dragged = active.data.current as { ingredientId: string | null; label: string | null };
    onMoveToCategory(dragged, String(over.id));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col pb-2">
        {hasHiddenSections && (
          <ShowAllCategoriesToggle
            show={showAllCategories}
            onToggle={onToggleShowAllCategories}
            className="ml-[22px] mt-2 hidden md:block"
          />
        )}

        {visibleSections.map(({ section, items: sectionItems }) => (
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
