"use client";

import { CardGridLoadingState, EmptyState, ErrorState } from "@/common";
import { usePagination } from "./hooks/usePagination";
import { useRecipeFilters } from "./hooks/useRecipeFilters";
import { useRecipeList } from "./hooks/useRecipeList";
import { useRecipeTagGroups } from "./hooks/useRecipeTagGroups";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { PaginationFooter } from "./components/RecipeList/PaginationFooter";
import { RecipeCard } from "./components/RecipeList/RecipeCard";
import { RecipeToolPanel } from "./components/RecipeList/RecipeToolPanel";

/**
 * The household's main recipe library — search by name, filter by tag
 * (meal type, cuisine, diet) and cook time, favorite a recipe, and page
 * through the results as a card grid.
 */
export function RecipeListScreen() {
  const pagination = usePagination();
  const filters = useRecipeFilters({ onChange: pagination.reset });
  const list = useRecipeList({ filters, pagination });
  const tagGroups = useRecipeTagGroups();
  const { toggleFavorite, pendingFavoriteId } = useFavoriteRecipe();

  return (
    <div className="flex flex-1 flex-col">
      <RecipeToolPanel filters={filters} tagGroups={tagGroups} />

      {list.isLoading && <CardGridLoadingState />}

      {list.isError && (
        <ErrorState
          title="Couldn't load recipes"
          message={list.error?.message}
          onRetry={() => void list.refetch()}
        />
      )}

      {!list.isLoading && !list.isError && list.recipes.length === 0 && (
        <EmptyState
          title="No recipes found"
          message={
            filters.hasActiveFilters
              ? "Try adjusting your search or filters above."
              : "This household hasn't added any recipes. The first one you save shows up here."
          }
        />
      )}

      {!list.isError && list.recipes.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-[18px] px-[22px] pb-5 pt-1 md:grid-cols-3">
            {list.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavoritePending={pendingFavoriteId === recipe.id}
                onToggleFavorite={() => toggleFavorite(recipe.id, recipe.isFavorited)}
              />
            ))}
          </div>

          <PaginationFooter
            rangeStart={list.rangeStart}
            rangeEnd={list.rangeEnd}
            total={list.total}
            hasPrevious={list.hasPrevious}
            hasNext={list.hasNext}
            onPrevious={pagination.goToPrevious}
            onNext={pagination.goToNext}
          />
        </>
      )}
    </div>
  );
}
