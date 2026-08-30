import { TagBadge } from "@/common";
import { formatTotalTime } from "../utils";
import type { RecipeDetail } from "../types";

/** Title, description, servings/prep/cook stats, and tags — the recipe's own header info. Presentational: no hooks, no handlers. */
export function RecipeMeta({ recipe }: { recipe: RecipeDetail }) {
  const totalTime = formatTotalTime(recipe.prepTime, recipe.cookingTime);

  return (
    <div className="flex flex-col gap-[9px]">
      <h1 className="m-0 font-display text-[25px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
        {recipe.name}
      </h1>

      {recipe.description && (
        <p className="m-0 text-sm text-ink-soft">{recipe.description}</p>
      )}

      <div className="tabular flex flex-wrap gap-4 font-mono text-[11.5px] text-ink-faint">
        {recipe.servings ? (
          <span>
            serves <b className="font-semibold text-ink-soft">{recipe.servings}</b>
          </span>
        ) : null}
        {recipe.prepTime ? (
          <span>
            prep{" "}
            <b className="font-semibold text-ink-soft">{recipe.prepTime} min</b>
          </span>
        ) : null}
        {recipe.cookingTime ? (
          <span>
            cook{" "}
            <b className="font-semibold text-ink-soft">{recipe.cookingTime} min</b>
          </span>
        ) : null}
        {totalTime && !recipe.prepTime && !recipe.cookingTime && (
          <span>{totalTime}</span>
        )}
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {recipe.tags.map(({ tag }) => (
            <TagBadge key={tag.id} label={tag.name} />
          ))}
        </div>
      )}
    </div>
  );
}
