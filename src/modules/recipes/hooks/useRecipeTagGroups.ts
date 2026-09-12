"use client";

import { useTags } from "./useTags";
import { splitMealTimeTags } from "../utils/tags";

/** Recipe tags, split into the always-visible meal-time row and the filter panel's own groups. */
export function useRecipeTagGroups() {
  const { tags } = useTags();
  const { mealTimeTags, panelTags } = splitMealTimeTags(tags);

  return { mealTimeTags, panelTags };
}
