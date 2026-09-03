"use client";

import { useTags } from "./useTags";
import { splitMealTimeTags } from "../utils";

/**
 * Recipe tags, split into the always-visible meal-time row and the filter
 * panel's own groups, plus how many of the panel's tags/cook-time are
 * currently active. Everything `RecipeToolPanel` needs that isn't live
 * filter state — `selectedTagIds`/`maxCookingTime` come from
 * `useRecipeFilters`, passed in here the same way `useRecipeList` takes
 * `filters`/`pagination`.
 */
export function useRecipeTagGroups({
  selectedTagIds,
  maxCookingTime,
}: {
  selectedTagIds: string[];
  maxCookingTime: number | null;
}) {
  const { tags } = useTags();
  const { mealTimeTags, panelTags } = splitMealTimeTags(tags);

  const activeFilterCount =
    panelTags.filter((tag) => selectedTagIds.includes(tag.id)).length +
    (maxCookingTime !== null ? 1 : 0);

  return { mealTimeTags, panelTags, activeFilterCount };
}
