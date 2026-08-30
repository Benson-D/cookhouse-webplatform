/**
 * Pure, React-free helpers for the recipes module. Kept out of the components
 * so they stay directly testable; promote to `lib/` only once a second module
 * needs the same thing.
 */

/** Total hands-on-plus-cooking time, as the card meta line shows it. */
export function formatTotalTime(
  prepTime: number | null | undefined,
  cookingTime: number | null | undefined
): string | null {
  const total = (prepTime ?? 0) + (cookingTime ?? 0);
  return total > 0 ? `${total} min` : null;
}

/** "35 min · serves 4", dropping either half when the recipe doesn't have it. */
export function formatRecipeMeta(recipe: {
  prepTime?: number | null;
  cookingTime?: number | null;
  servings?: number | null;
}): string {
  const parts = [
    formatTotalTime(recipe.prepTime, recipe.cookingTime),
    recipe.servings ? `serves ${recipe.servings}` : null,
  ].filter((part): part is string => part !== null);

  return parts.join(" · ");
}

/**
 * Stand-in photography — a generated gradient, not a photo.
 *
 * `recipes.list` returns tags but no images (the list query deliberately skips
 * that join), so cards have no thumbnail to show. Hashing the id keeps a given
 * recipe's colour stable instead of reshuffling on every render.
 */
const DISH_GRADIENTS = [
  "linear-gradient(150deg, #E2A34C 0%, #C9722F 55%, #9C4E27 100%)",
  "linear-gradient(150deg, #8CA85C 0%, #5C7A3C 55%, #38512A 100%)",
  "linear-gradient(150deg, #EBC886 0%, #D69F4E 55%, #A96F2E 100%)",
  "linear-gradient(150deg, #E9A183 0%, #D2734F 55%, #9E4C33 100%)",
  "linear-gradient(150deg, #DE8B5C 0%, #C1462F 55%, #8C2A22 100%)",
  "linear-gradient(150deg, #D4A878 0%, #A9713F 55%, #6E4426 100%)",
];

export function placeholderGradient(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return DISH_GRADIENTS[Math.abs(hash) % DISH_GRADIENTS.length];
}

/** Parsed shape of `Recipe.instructions`, which Prisma types only as `Json`. */
export type RecipeStep = {
  step: number;
  text: string;
  timerSeconds?: number;
};

/**
 * `instructions` is a `Json` column, so it arrives as `unknown` and cannot be
 * trusted to be well-formed. Anything unrecognisable is dropped rather than
 * crashing the detail screen.
 */
export function parseSteps(instructions: unknown): RecipeStep[] {
  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions
    .filter(
      (entry): entry is RecipeStep =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as RecipeStep).text === "string"
    )
    .map((entry, index) => ({
      step: typeof entry.step === "number" ? entry.step : index + 1,
      text: entry.text,
      timerSeconds:
        typeof entry.timerSeconds === "number" ? entry.timerSeconds : undefined,
    }))
    .sort((a, b) => a.step - b.step);
}

/** Step timers render as "1:00" / "20:00". */
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

/**
 * Groups tags into the filter bar's runs, separated by a thin rule: meal
 * type, then cuisine, then diet, then anything untyped.
 *
 * `Tag.type` is a free-text column rather than an enum, so an unrecognised
 * value lands in the trailing group instead of vanishing.
 */
const TAG_TYPE_ORDER = ["meal_type", "cuisine", "diet"];

export function groupTagsByType<T extends { type?: string | null }>(
  tags: T[]
): T[][] {
  const groups = new Map<string, T[]>();

  for (const tag of tags) {
    const key =
      tag.type && TAG_TYPE_ORDER.includes(tag.type) ? tag.type : "__other";
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
 * Breakfast/lunch/dinner are fixed at exactly three and won't grow like the
 * rest of the (admin-curated) meal_type group, so they get pulled out into
 * their own always-visible row instead of living in the filter panel.
 */
export function splitMealTimeTags<T extends { type?: string | null; name: string }>(
  tags: T[]
): { mealTimeTags: T[]; panelTags: T[] } {
  const mealTimeTags: T[] = [];
  const panelTags: T[] = [];

  for (const tag of tags) {
    if (tag.type === "meal_type" && MEAL_TIME_NAMES.includes(tag.name)) {
      mealTimeTags.push(tag);
    } else {
      panelTags.push(tag);
    }
  }

  mealTimeTags.sort(
    (a, b) => MEAL_TIME_NAMES.indexOf(a.name) - MEAL_TIME_NAMES.indexOf(b.name)
  );
  return { mealTimeTags, panelTags };
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

export const COOK_TIME_OPTIONS = [
  { label: "Under 20 min", value: 20 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 45 min", value: 45 },
  { label: "Under 1hr", value: 60 },
] as const;

/** Backend takes a plain int with no fixed enum, so anything outside the four presets still needs a label. */
export function formatCookTimeFilter(maxCookingTime: number): string {
  return (
    COOK_TIME_OPTIONS.find((option) => option.value === maxCookingTime)?.label ??
    `Under ${maxCookingTime} min`
  );
}
