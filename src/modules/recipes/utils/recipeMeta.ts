/** "45 min" under an hour, "1hr 15min" (or "2hr" with no remainder) at or above it — raw minutes stop reading as a duration past 59. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}hr ${remainder}min` : `${hours}hr`;
}

/** Total hands-on-plus-cooking time, as the card meta line shows it. */
export function formatTotalTime(
  prepTime: number | null | undefined,
  cookingTime: number | null | undefined
): string | null {
  const total = (prepTime ?? 0) + (cookingTime ?? 0);
  return total > 0 ? formatDuration(total) : null;
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
