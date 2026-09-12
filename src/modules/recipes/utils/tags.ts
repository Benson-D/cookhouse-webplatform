/**
 * Groups tags into the filter bar's runs, separated by a thin rule: meal
 * type, then cuisine, then diet, then anything untyped.
 *
 * `Tag.type` is a free-text column rather than an enum, so an unrecognised
 * value lands in the trailing group instead of vanishing.
 */
const TAG_TYPE_ORDER = ["meal_type", "cuisine", "diet"];

export function groupTagsByType<T extends { type?: string | null }>(tags: T[]): T[][] {
  const groups = new Map<string, T[]>();

  for (const tag of tags) {
    const key = tag.type && TAG_TYPE_ORDER.includes(tag.type) ? tag.type : "__other";
    const existing = groups.get(key);
    if (existing) {
      existing.push(tag);
    } else {
      groups.set(key, [tag]);
    }
  }

  return [...TAG_TYPE_ORDER, "__other"]
    .map((key) => groups.get(key))
    .filter((group): group is T[] => group !== undefined && group.length > 0);
}

const MEAL_TIME_NAMES = ["breakfast", "lunch", "dinner"];

/**
 * Breakfast/lunch/dinner are fixed at exactly three and are the single most
 * common way someone filters a recipe, so they also get an always-visible
 * quick-access row — a view into the same tags, not a removal from the panel.
 */
export function splitMealTimeTags<T extends { type?: string | null; name: string }>(
  tags: T[]
): { mealTimeTags: T[]; panelTags: T[] } {
  const mealTimeTags = tags
    .filter((tag) => tag.type === "meal_type" && MEAL_TIME_NAMES.includes(tag.name))
    .sort((a, b) => MEAL_TIME_NAMES.indexOf(a.name) - MEAL_TIME_NAMES.indexOf(b.name));

  return { mealTimeTags, panelTags: tags };
}

const GROUP_LABELS: Record<string, string> = {
  cuisine: "Cuisine",
  diet: "Diet",
  meal_type: "Meal type",
};

/** Falls back to the raw type for anything outside the three known groups, same as groupTagsByType's own "__other" bucket. */
export function labelForTagGroup(type: string | null | undefined): string {
  return (type && GROUP_LABELS[type]) ?? "Other";
}
