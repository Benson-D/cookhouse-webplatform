"use client";

import { CardGridLoadingState, CHButton, EmptyState, ErrorState } from "@/common";
import { useRecipeList } from "./hooks/useRecipeList";
import { useTags } from "./hooks/useTags";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { Pager } from "./components/Pager";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeToolbar } from "./components/RecipeToolbar";
import { ActiveFiltersRow } from "./components/ActiveFiltersRow";
import { splitMealTimeTags } from "./utils";

/**
 * Logical component: composes the list hook with presentational pieces and
 * holds no query of its own.
 */
export function RecipeListScreen() {
  const list = useRecipeList({ poll: true });
  const { tags } = useTags();
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();

  const { mealTimeTags, panelTags } = splitMealTimeTags(tags);
  const activeFilterCount =
    panelTags.filter((tag) => list.selectedTagIds.includes(tag.id)).length +
    (list.maxCookingTime !== null ? 1 : 0);

  function clearAllFilters() {
    list.clearTags();
    list.setMaxCookingTime(null);
  }

  return (
    <div className="flex flex-1 flex-col">
      <RecipeToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        favoritesOnly={list.favoritesOnly}
        onFavoritesOnlyChange={list.setFavoritesOnly}
        panelTags={panelTags}
        selectedTagIds={list.selectedTagIds}
        onToggleTag={list.toggleTag}
        maxCookingTime={list.maxCookingTime}
        onSetMaxCookingTime={list.setMaxCookingTime}
        activeFilterCount={activeFilterCount}
      />

      <ActiveFiltersRow
        mealTimeTags={mealTimeTags}
        panelTags={panelTags}
        selectedTagIds={list.selectedTagIds}
        onToggleTag={list.toggleTag}
        maxCookingTime={list.maxCookingTime}
        onSetMaxCookingTime={list.setMaxCookingTime}
        onClearAll={clearAllFilters}
      />

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
          title={
            list.hasActiveFilters ? "No recipes match those filters" : "No recipes yet"
          }
          message={
            list.hasActiveFilters
              ? "Try clearing a tag or two, or searching for something else."
              : "This household hasn't added any recipes. The first one you save shows up here."
          }
          action={
            list.hasActiveFilters && (
              <CHButton
                variant="ghost"
                onClick={() => {
                  list.clearTags();
                  list.setSearch("");
                  list.setFavoritesOnly(false);
                  list.setMaxCookingTime(null);
                }}
              >
                Clear filters
              </CHButton>
            )
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
                onToggleFavorite={() =>
                  setFavorite(recipe.id, !recipe.isFavorited)
                }
              />
            ))}
          </div>

          <Pager
            rangeStart={list.rangeStart}
            rangeEnd={list.rangeEnd}
            total={list.total}
            hasPrevious={list.hasPrevious}
            hasNext={list.hasNext}
            onPrevious={list.goToPrevious}
            onNext={list.goToNext}
          />
        </>
      )}
    </div>
  );
}
