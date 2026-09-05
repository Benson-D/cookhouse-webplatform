import { toFractionLabel } from "@/lib/fraction";

/**
 * An ingredient's amount + unit for the recipe detail screen, with common
 * kitchen fractions shown as fractions instead of decimals — "¾ cup",
 * "1½ tsp". Detail-screen only: the grocery list's own `formatAmount`
 * (`lib/formatAmount`) is unaffected, since a shopper reads a quantity
 * differently than a cook following a recipe.
 */
export function formatIngredientAmount(
  amount: number | null | undefined,
  unit: { abbreviation?: string | null; name: string } | null | undefined
): string {
  if (amount === null || amount === undefined) {
    return "—";
  }
  const label = unit ? (unit.abbreviation ?? unit.name) : null;
  return label ? `${toFractionLabel(amount)} ${label}` : toFractionLabel(amount);
}
