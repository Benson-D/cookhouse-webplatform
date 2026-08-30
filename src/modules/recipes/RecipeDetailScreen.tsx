"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CHButton, CHLink, ErrorState, LoadingState, SubpageHeader, TagBadge } from "@/components/common";
import { useTapToArm } from "@/hooks/useTapToArm";
import { useAddFromRecipes } from "@/modules/grocery-lists/hooks/useAddFromRecipes";
import { useRecipe } from "./hooks/useRecipe";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { useDeleteRecipe } from "./hooks/useDeleteRecipe";
import { IngredientList } from "./components/IngredientList";
import { MethodSteps } from "./components/MethodSteps";
import { RecipeGallery } from "./components/RecipeGallery";
import { DeleteRecipeLink } from "./components/DeleteRecipeLink";
import { formatTotalTime } from "./utils";

/** How long the post-add "Added" confirmation shows before reverting — this app has no toast system. */
const ADDED_CONFIRMATION_MS = 2500;

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-[9px] mt-[18px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
      {children}
    </div>
  );
}

/** Logical component: composes `useRecipe` with the module's presentational pieces. */
export function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const { recipe, steps, images, isLoading, isError, error, refetch, canEdit } = useRecipe(
    recipeId,
    { poll: true }
  );
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();
  const { addFromRecipes, isAdding, error: addError } = useAddFromRecipes();
  const { deleteRecipe, isDeleting } = useDeleteRecipe();

  const [justAdded, setJustAdded] = useState(false);
  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
  }, []);

  async function handleAddToList() {
    await addFromRecipes([recipeId]);
    setJustAdded(true);
    confirmationTimer.current = setTimeout(() => setJustAdded(false), ADDED_CONFIRMATION_MS);
  }

  const { armed: deleteArmed, tap: tapDelete } = useTapToArm(async () => {
    await deleteRecipe(recipeId);
    router.push("/recipes");
  });

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
    <div>
      <SubpageHeader backHref="/recipes" backLabel="All recipes" />

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

          <div className="mt-5 flex items-center gap-[9px]">
            <CHButton
              variant="primary"
              onClick={() => void handleAddToList()}
              disabled={isAdding || justAdded}
            >
              {isAdding ? "Adding…" : justAdded ? "Added ✓" : "Add to grocery list"}
            </CHButton>

            <CHButton
              pressed={recipe.isFavorited}
              onClick={() => setFavorite(recipe.id, !recipe.isFavorited)}
              disabled={pendingRecipeId === recipe.id}
            >
              {recipe.isFavorited ? "♥ Saved" : "♡ Save"}
            </CHButton>

            {canEdit && (
              <CHLink variant="ghost" href={`/recipes/${recipe.id}/edit`}>
                Edit
              </CHLink>
            )}

            {canEdit && (
              <DeleteRecipeLink armed={deleteArmed} onTap={tapDelete} isDeleting={isDeleting} />
            )}
          </div>

          {addError && (
            <p className="mt-2 text-[13px] text-danger" role="alert">
              {addError.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
