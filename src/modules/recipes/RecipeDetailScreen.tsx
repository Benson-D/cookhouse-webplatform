"use client";

import { useRouter } from "next/navigation";
import { CHSectionLabel, ErrorState, LoadingState, SubpageHeader } from "@/common";
import { useTapToConfirm } from "@/hooks/useTapToConfirm";
import { useRecipe } from "./hooks/useRecipe";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { useDeleteRecipe } from "./hooks/useDeleteRecipe";
import { useAddRecipeToGroceryList } from "./hooks/useAddRecipeToGroceryList";
import { IngredientList } from "./components/RecipeDetail/IngredientList";
import { MethodInstructions } from "./components/RecipeDetail/MethodInstructions";
import { RecipeGallery } from "./components/RecipeDetail/RecipeGallery";
import { RecipeMeta } from "./components/RecipeDetail/RecipeMeta";
import { RecipeDetailActions } from "./components/RecipeDetail/RecipeDetailActions";

/** Logical component: composes `useRecipe` with the module's presentational pieces. */
export function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  // poll: true dropped for now — cost/load concern on the $5/mo DigitalOcean
  // plan (see useGroceryList's comment). Revisit with a real solution.
  const { recipe, parsedInstructions, images, isLoading, isError, error, refetch } =
    useRecipe(recipeId);

  const {
    handleAddToList,
    isAdding,
    justAdded,
    error: addError,
  } = useAddRecipeToGroceryList(recipeId);
  const { toggleFavorite, pendingFavoriteId } = useFavoriteRecipe();
  const { deleteRecipe, isDeleting } = useDeleteRecipe();

  const confirmDelete = async () => {
    await deleteRecipe(recipeId);
    router.push("/recipes");
  };

  const { awaitingConfirmation: deleteAwaitingConfirmation, handleTap: handleDeleteTap } =
    useTapToConfirm(confirmDelete);

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

          <MethodInstructions instructions={parsedInstructions} />

          <RecipeDetailActions
            recipeId={recipe.id}
            isFavorited={recipe.isFavorited}
            isFavoritePending={pendingFavoriteId === recipe.id}
            onToggleFavorite={() => toggleFavorite(recipe.id, recipe.isFavorited)}
            isAdding={isAdding}
            justAdded={justAdded}
            onAddToList={() => void handleAddToList()}
            addErrorMessage={addError?.message}
            deleteAwaitingConfirmation={deleteAwaitingConfirmation}
            onDeleteTap={handleDeleteTap}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
