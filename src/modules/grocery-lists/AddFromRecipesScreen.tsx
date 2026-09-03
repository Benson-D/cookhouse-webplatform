"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardGridLoadingState, ErrorState, EmptyState, SubpageHeader } from "@/common";
import { usePagination } from "@/modules/recipes/hooks/usePagination";
import { useRecipeFilters } from "@/modules/recipes/hooks/useRecipeFilters";
import { useRecipeList } from "@/modules/recipes/hooks/useRecipeList";
import { useTags } from "@/modules/recipes/hooks/useTags";
import { TagFilterBar } from "@/modules/recipes/components/TagFilterBar";
import { RecipePickCard } from "@/modules/recipes/components/RecipePickCard";
import { PaginationFooter } from "@/modules/recipes/components/PaginationFooter";
import { useAddFromRecipes } from "./hooks/useAddFromRecipes";
import { PickerFooter } from "./components/PickerFooter";

/**
 * The "Add from recipes" picker — its own route, not a modal.
 *
 * Reuses the recipe list's own search, tag filters and pagination almost
 * unchanged via `usePagination`/`useRecipeFilters`/`useRecipeList`; the only
 * things that differ from the recipe list screen are the card (pick mode,
 * not favorite/link mode) and the bars above and below it. No search bar of
 * its own beyond what `useRecipeFilters` already drives — deliberately not
 * reusing `RecipeToolbar`, which also renders "New recipe", not appropriate
 * on a screen for picking existing ones.
 */
export function AddFromRecipesScreen() {
  const router = useRouter();
  const pagination = usePagination();
  const filters = useRecipeFilters({ onChange: pagination.reset });
  const list = useRecipeList({ filters, pagination });
  const { tags } = useTags();
  const { addFromRecipes, isAdding } = useAddFromRecipes();

  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) return;
    await addFromRecipes([...selected]);
    router.push("/grocery-list");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SubpageHeader
        backHref="/grocery-list"
        title="Add from recipes"
        right={
          <span className="tabular font-mono text-xs text-ink-faint">{selected.size} selected</span>
        }
      />

      <div className="flex flex-wrap items-center gap-3 px-[22px] pb-3.5 pt-[18px]">
        <div className="flex min-w-[180px] flex-1 items-center gap-[9px] rounded-lg border border-line bg-surface-2 px-3 py-2">
          <span aria-hidden className="text-ink-faint">
            🔍
          </span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => filters.handleSearch(event.target.value)}
            placeholder="Search your recipes"
            aria-label="Search your recipes"
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      <TagFilterBar
        tags={tags}
        selectedTagIds={filters.selectedTagIds}
        onToggleTag={filters.handleToggleTag}
        onClear={filters.handleClearTags}
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
          title={filters.hasActiveFilters ? "No recipes match those filters" : "No recipes yet"}
          message={
            filters.hasActiveFilters
              ? "Try clearing a tag or two, or searching for something else."
              : "This household hasn't added any recipes yet."
          }
        />
      )}

      {!list.isError && list.recipes.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-[18px] px-[22px] pb-5 pt-1 md:grid-cols-3">
            {list.recipes.map((recipe) => (
              <RecipePickCard
                key={recipe.id}
                recipe={recipe}
                selected={selected.has(recipe.id)}
                onToggle={() => toggle(recipe.id)}
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

      <PickerFooter
        selectedCount={selected.size}
        onSubmit={() => void handleSubmit()}
        isSubmitting={isAdding}
      />
    </div>
  );
}
