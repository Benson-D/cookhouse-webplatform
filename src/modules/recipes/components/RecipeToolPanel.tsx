import { RecipeToolbar } from "./RecipeToolbar";
import { RecipeTags } from "./RecipeTags";
import type { useRecipeFilters } from "../hooks/useRecipeFilters";
import type { useRecipeTagGroups } from "../hooks/useRecipeTagGroups";

/**
 * Everything above the recipe grid: the search/favorites/filter-panel
 * toolbar, plus the always-visible meal-time chips and active-filter
 * summary beneath it. Wraps `RecipeToolbar` + `RecipeTags`, which otherwise
 * share several of the same filter props between them.
 *
 * Takes `filters`/`tagGroups` as whole objects itself — both are already one
 * cohesive value from their own hook — but destructures them right away and
 * passes flat, individual props to both children, the same way regardless
 * of which one's rendering them.
 */
export function RecipeToolPanel({
  filters,
  tagGroups,
}: {
  filters: ReturnType<typeof useRecipeFilters>;
  tagGroups: ReturnType<typeof useRecipeTagGroups>;
}) {
  const {
    search,
    handleSearch,
    favoritesOnly,
    handleFavoritesOnlyChange,
    selectedTagIds,
    handleToggleTag,
    maxCookingTime,
    handleMaxCookingTimeChange,
    handleClearTags,
  } = filters;
  const { mealTimeTags, panelTags, activeFilterCount } = tagGroups;

  const showRecipeTags = mealTimeTags.length > 0 || activeFilterCount > 0;

  function handleClearAll() {
    handleClearTags();
    handleMaxCookingTimeChange(null);
  }

  return (
    <>
      <RecipeToolbar
        search={search}
        onSearchChange={handleSearch}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={handleFavoritesOnlyChange}
        panelTags={panelTags}
        selectedTagIds={selectedTagIds}
        onToggleTag={handleToggleTag}
        maxCookingTime={maxCookingTime}
        onSetMaxCookingTime={handleMaxCookingTimeChange}
        activeFilterCount={activeFilterCount}
      />

      {showRecipeTags && (
        <RecipeTags
          mealTimeTags={mealTimeTags}
          panelTags={panelTags}
          selectedTagIds={selectedTagIds}
          onToggleTag={handleToggleTag}
          maxCookingTime={maxCookingTime}
          onSetMaxCookingTime={handleMaxCookingTimeChange}
          onClearAll={handleClearAll}
        />
      )}
    </>
  );
}
