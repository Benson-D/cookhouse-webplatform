"use client";

import { CardGridLoadingState, EmptyState, ErrorState } from "@/common";
import { usePagination } from "./hooks/usePagination";
import { useRecipeFilters } from "./hooks/useRecipeFilters";
import { useRecipeList } from "./hooks/useRecipeList";
import { useRecipeTagGroups } from "./hooks/useRecipeTagGroups";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { PaginationFooter } from "./components/PaginationFooter";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeToolPanel } from "./components/RecipeToolPanel";

/**
 * Composes pagination, filters, the list query and the tag groups, and
 * holds no query of its own. Changing any filter resets pagination back to
 * the first page, via `useRecipeFilters`' `onChange` wired to
 * `pagination.reset`.
 */
export function RecipeListScreen() {
  const pagination = usePagination();
  const filters = useRecipeFilters({ onChange: pagination.reset });
  const list = useRecipeList({ filters, pagination, poll: true });
  const tagGroups = useRecipeTagGroups({
    selectedTagIds: filters.selectedTagIds,
    maxCookingTime: filters.maxCookingTime,
  });
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();

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
                isFavoritePending={pendingRecipeId === recipe.id}
                onToggleFavorite={() => setFavorite(recipe.id, !recipe.isFavorited)}
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
