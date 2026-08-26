"use client";

import Link from "next/link";
import { CHButton, CHLink, ErrorState, LoadingState, TagBadge } from "@/components/common";
import { useRecipe } from "./hooks/useRecipe";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { IngredientList } from "./components/IngredientList";
import { MethodSteps } from "./components/MethodSteps";
import { RecipeGallery } from "./components/RecipeGallery";
import { formatTotalTime } from "./utils";

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-[9px] mt-[18px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
      {children}
    </div>
  );
}

/** Logical component: composes `useRecipe` with the module's presentational pieces. */
export function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const { recipe, steps, images, isLoading, isError, error, refetch, canEdit } =
    useRecipe(recipeId);
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();

  if (isLoading) {
    return <LoadingState label="Loading recipe…" rows={5} />;
  }

  if (isError || !recipe) {
    const notFound = error?.data?.code === "NOT_FOUND";
    return (
      <ErrorState
        title={notFound ? "Recipe not found" : "Couldn't load this recipe"}
        message={
          notFound
            ? "It may have been deleted, or it belongs to a different household."
            : error?.message
        }
        onRetry={notFound ? undefined : () => void refetch()}
      />
    );
  }

  const totalTime = formatTotalTime(recipe.prepTime, recipe.cookingTime);

  return (
    <div className="grid gap-[26px] px-[22px] pb-6 pt-5 md:grid-cols-[1.05fr_1fr]">
      <div>
        <RecipeGallery
          images={images}
          fallbackSeed={recipe.id}
          recipeName={recipe.name}
        />

        <SectionLabel>Ingredients</SectionLabel>
        <IngredientList ingredients={recipe.ingredients} />
      </div>

      <div>
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

        <SectionLabel>Method</SectionLabel>
        <MethodSteps steps={steps} />

        <div className="mt-5 flex flex-wrap items-center gap-[9px]">
          <CHButton variant="primary" disabled title="Not built yet">
            Add to grocery list
          </CHButton>

          <CHButton
            pressed={recipe.isFavorited}
            onClick={() => setFavorite(recipe.id, !recipe.isFavorited)}
            disabled={pendingRecipeId === recipe.id}
          >
            {recipe.isFavorited ? "♥ Saved" : "♡ Save"}
          </CHButton>

          {/* Edit is author-or-admin server-side; hidden rather than shown-and-refused. */}
          {canEdit && (
            <CHLink variant="ghost" href={`/recipes/${recipe.id}/edit`}>
              Edit
            </CHLink>
          )}

          <Link
            href="/recipes"
            className="ml-auto text-[13.5px] text-ink-soft no-underline hover:underline"
          >
            ← All recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
