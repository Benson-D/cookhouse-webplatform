"use client";

import { useRouter } from "next/navigation";
import { CHSectionLabel, ErrorState, LoadingState, SubpageHeader } from "@/common";
import { useTapToArm } from "@/hooks/useTapToArm";
import { useRecipe } from "./hooks/useRecipe";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { useDeleteRecipe } from "./hooks/useDeleteRecipe";
import { useAddToList } from "./hooks/useAddToList";
import { IngredientList } from "./components/IngredientList";
import { MethodInstructions } from "./components/MethodInstructions";
import { RecipeGallery } from "./components/RecipeGallery";
import { RecipeMeta } from "./components/RecipeMeta";
import { RecipeDetailActions } from "./components/RecipeDetailActions";

/** Logical component: composes `useRecipe` with the module's presentational pieces. */
export function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const { recipe, parsedInstructions, images, isLoading, isError, error, refetch } = useRecipe(
    recipeId,
    { poll: true }
  );
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();
  const { handleAddToList, isAdding, justAdded, error: addError } = useAddToList(recipeId);
  const { deleteRecipe, isDeleting } = useDeleteRecipe();

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

  return (
    <div>
      <SubpageHeader backHref="/recipes" backLabel="All recipes" />

      <div className="grid gap-[26px] px-[22px] pb-6 pt-5 md:grid-cols-[1.05fr_1fr]">
        {/* Left column: photo gallery + ingredients */}
        <div>
          <RecipeGallery images={images} fallbackSeed={recipe.id} recipeName={recipe.name} />

          <CHSectionLabel>Ingredients</CHSectionLabel>
          <IngredientList ingredients={recipe.ingredients} />
        </div>

        {/* Right column: title/stats/tags, method, and the action buttons */}
        <div>
          <RecipeMeta recipe={recipe} />

          <CHSectionLabel>Method</CHSectionLabel>
          <MethodInstructions instructions={parsedInstructions} />

          <RecipeDetailActions
            recipeId={recipe.id}
            isFavorited={recipe.isFavorited}
            isFavoritePending={pendingRecipeId === recipe.id}
            onToggleFavorite={() => setFavorite(recipe.id, !recipe.isFavorited)}
            isAdding={isAdding}
            justAdded={justAdded}
            onAddToList={() => void handleAddToList()}
            addErrorMessage={addError?.message}
            deleteArmed={deleteArmed}
            onTapDelete={tapDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
