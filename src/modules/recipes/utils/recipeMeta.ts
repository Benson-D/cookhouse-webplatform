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
