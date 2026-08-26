"use client";

import { CardGridLoadingState, CHButton, EmptyState, ErrorState } from "@/components/common";
import { useRecipeList } from "./hooks/useRecipeList";
import { useTags } from "./hooks/useTags";
import { useFavoriteRecipe } from "./hooks/useFavoriteRecipe";
import { Pager } from "./components/Pager";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeToolbar } from "./components/RecipeToolbar";
import { TagFilterBar } from "./components/TagFilterBar";

/**
 * Logical component: composes the list hook with presentational pieces and
 * holds no query of its own.
 */
export function RecipeListScreen() {
  const list = useRecipeList();
  const { tags } = useTags();
  const { setFavorite, pendingRecipeId } = useFavoriteRecipe();

  return (
    <div className="flex flex-1 flex-col">
      <RecipeToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        favoritesOnly={list.favoritesOnly}
        onFavoritesOnlyChange={list.setFavoritesOnly}
      />

      <TagFilterBar
        tags={tags}
        selectedTagIds={list.selectedTagIds}
        onToggleTag={list.toggleTag}
        onClear={list.clearTags}
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
