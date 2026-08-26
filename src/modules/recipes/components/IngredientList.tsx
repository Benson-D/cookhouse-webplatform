import { formatAmount } from "@/lib/formatAmount";
import type { RecipeDetail } from "../types";

/**
 * The amount column is monospace and tabular so figures line up down the
 * list, and a row with no amount shows an em dash rather than a zero —
 * `RecipeIngredient.amount` is nullable and "salt, to taste" is a real row.
 *
 * Prep notes ("finely diced") sit apart from the amount because they live on
 * the join row, not the ingredient, which is what keeps "onion" one canonical
 * thing across every recipe.
 */
export function IngredientList({
  ingredients,
}: {
  ingredients: RecipeDetail["ingredients"];
}) {
  if (ingredients.length === 0) {
    return (
      <p className="m-0 text-[13.5px] text-ink-faint">
        No ingredients recorded for this recipe.
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {ingredients.map((row) => (
        <li
          key={`${row.recipeId}-${row.ingredientId}`}
          className="flex items-baseline gap-[11px] border-b border-line-soft py-[7px] text-[13.5px]"
        >
          <span className="tabular min-w-[72px] font-mono text-[12.5px] text-ink">
            {formatAmount(row.amount, row.unit)}
          </span>
          <span>{row.ingredient.name}</span>
          {row.notes && <span className="text-[12.5px] text-ink-faint">{row.notes}</span>}
        </li>
      ))}
    </ul>
  );
}
