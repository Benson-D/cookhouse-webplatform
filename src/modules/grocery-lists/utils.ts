import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

/**
 * Pure, React-free helpers for the grocery-lists module — promote to `lib/`
 * only once a second module needs the same thing.
 */

/** A person's initials for source-of-truth-free display, or a placeholder for nobody. */
export function getInitials(
  person: { firstName: string | null; lastName: string | null; email: string } | null
): string {
  if (!person) return "—";
  const fromNames = [person.firstName, person.lastName]
    .filter((part): part is string => Boolean(part))
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return fromNames || person.email[0]!.toUpperCase();
}

/** "started Tue" — a terse, weekday-only date. */
export function formatStartedDay(date: Date): string {
  return `started ${date.toLocaleDateString(undefined, { weekday: "short" })}`;
}

/** "4 min ago" / "3 hr ago" / "2 days ago" — coarse on purpose, this is a footer, not a log. */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} hr ago`;

  return `${differenceInDays(now, date)} days ago`;
}

/**
 * Volume ("3/4 cup") and weight ("640 g", "1.5 kg") amounts are recipe
 * measurements, not shopping ones — nobody's buying exactly 640g of butter
 * off a shelf. Only count ("3 oranges") maps to something you'd actually
 * grab, so the list drops the amount for anything else rather than showing
 * a number nobody's shopping against.
 */
export function shouldHideAmount(unit: { type: string } | null | undefined): boolean {
  return unit?.type === "volume" || unit?.type === "weight";
}

const SOURCE_LABELS: Record<string, string> = {
  recipe: "recipe",
  staple: "staple",
  manual: "manual",
};

/** Falls back to the raw value for any source the UI doesn't have a specific label for. */
export function formatSource(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

/** A row's name — an ingredient's, or the typed-in text for one that never matched an ingredient. Exactly one of the two is ever populated. */
export function displayName(item: {
  ingredient: { name: string } | null;
  label: string | null;
}): string {
  return item.ingredient?.name ?? item.label ?? "";
}

/** A-Z by display name, unchecked items first and checked ones pushed to the bottom. Returns a new array; doesn't mutate. */
export function sortByDisplayName<
  T extends { ingredient: { name: string } | null; label: string | null; checked: boolean },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    return displayName(a).localeCompare(displayName(b));
  });
}

/** The fixed, ordered set of category sections a household can group or drag items into. */
export const GROCERY_CATEGORY_SECTIONS = [
  "Produce",
  "Dairy",
  "Meat & Seafood",
  "Bakery",
  "Pantry",
  "Spices",
  "Snacks",
  "Beverages",
  "Alcohol",
  "Desserts",
  "Frozen",
  "Household",
] as const;

export type GroceryCategorySection = (typeof GROCERY_CATEGORY_SECTIONS)[number] | "Uncategorized";

/**
 * Maps `Ingredient.category`'s raw free-text values to a fixed section.
 * "meat" and "seafood" both land under "Meat & Seafood"; "chilled" (used for
 * things like tofu that are refrigerated but not literally frozen) lands
 * under "Frozen" as the closest fixed bucket, since this list has no
 * separate "Chilled" section of its own.
 */
const RAW_CATEGORY_SECTIONS: Record<string, GroceryCategorySection> = {
  produce: "Produce",
  dairy: "Dairy",
  meat: "Meat & Seafood",
  seafood: "Meat & Seafood",
  bakery: "Bakery",
  pantry: "Pantry",
  spice: "Spices",
  spices: "Spices",
  snacks: "Snacks",
  beverages: "Beverages",
  alcohol: "Alcohol",
  desserts: "Desserts",
  frozen: "Frozen",
  chilled: "Frozen",
  household: "Household",
};

type CategoryOverrideKey = { ingredientId: string | null; label: string | null };

/** A household's override is keyed by whichever of ingredientId/label it was set on — mirrors `GroceryCategoryOverride`'s own exact-match lookup on the backend. */
function overrideKey({ ingredientId, label }: CategoryOverrideKey): string {
  return ingredientId ?? `label:${label}`;
}

/** An item's category: a household's own override first, else the ingredient's global category, else "Uncategorized". Never guesses from the name. */
function resolveCategorySection(
  item: CategoryOverrideKey & { ingredient: { category: string | null } | null },
  overrides: Map<string, string>
): GroceryCategorySection {
  const override = overrides.get(overrideKey(item));
  if (override) return override as GroceryCategorySection;

  const raw = item.ingredient?.category?.trim().toLowerCase();
  return (raw && RAW_CATEGORY_SECTIONS[raw]) || "Uncategorized";
}

type GroceryItemLike = CategoryOverrideKey & {
  ingredient: { name: string; category: string | null } | null;
  label: string | null;
  checked: boolean;
};

/** Every fixed section plus the "Uncategorized" catch-all, in display order. */
export const ALL_GROCERY_CATEGORY_SECTIONS: GroceryCategorySection[] = [
  ...GROCERY_CATEGORY_SECTIONS,
  "Uncategorized",
];

/**
 * Groups unchecked items into their resolved category sections (fixed
 * order, A-Z within each, empty sections dropped), with every checked item
 * — regardless of category — collected into one separate pile instead.
 * Checked off isn't a real category: it's not part of the ordered sections.
 * `hasHiddenSections` is true when at least one fixed section has nothing
 * in it right now, i.e. there's something a "show all categories" control
 * would actually reveal. Returns new arrays; doesn't mutate.
 */
export function groupByCategory<T extends GroceryItemLike>(
  items: T[],
  overrides: (CategoryOverrideKey & { category: string })[]
): {
  sections: { section: GroceryCategorySection; items: T[] }[];
  checkedOff: T[];
  hasHiddenSections: boolean;
} {
  const overrideMap = new Map(
    overrides.map((override) => [overrideKey(override), override.category])
  );

  const buckets = new Map<GroceryCategorySection, T[]>();
  for (const item of items) {
    if (item.checked) continue;
    const section = resolveCategorySection(item, overrideMap);
    const bucket = buckets.get(section);
    if (bucket) bucket.push(item);
    else buckets.set(section, [item]);
  }

  const sections = ALL_GROCERY_CATEGORY_SECTIONS.filter((section) => buckets.has(section)).map(
    (section) => ({ section, items: sortByDisplayName(buckets.get(section)!) })
  );

  return {
    sections,
    checkedOff: sortByDisplayName(items.filter((item) => item.checked)),
    hasHiddenSections: sections.length < ALL_GROCERY_CATEGORY_SECTIONS.length,
  };
}
