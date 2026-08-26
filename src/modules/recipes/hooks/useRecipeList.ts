"use client";

import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

/** Well under the server-side cap of 100, and a clean multiple of the 3-col grid. */
const PAGE_SIZE = 12;

/**
 * Owns the recipe list query and every filter that feeds it.
 *
 * This is the one file a change to *how* recipes are listed touches — swapping
 * skip/take for cursor pagination, adding a filter, changing the page size —
 * rather than every screen that renders a list. The Screen reads this and
 * never imports `trpc` itself.
 *
 * Any filter change resets to the first page: page 3 of the old result set has
 * no meaning against a new one, and silently showing an empty page reads as
 * "no matches" when there are plenty.
 */
export function useRecipeList() {
  const [search, setSearchValue] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnlyValue] = useState(false);
  const [skip, setSkip] = useState(0);

  const debouncedSearch = useDebounce(search);

  const query = trpc.recipes.list.useQuery(
    {
      search: debouncedSearch.trim() || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      favoritesOnly: favoritesOnly || undefined,
      skip,
      take: PAGE_SIZE,
    },
    // Keeps the previous page on screen while the next one loads, so paging
    // doesn't blank the grid on every click.
    { placeholderData: (previous) => previous }
  );

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setSkip(0);
  }, []);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
    setSkip(0);
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTagIds([]);
    setSkip(0);
  }, []);

  const setFavoritesOnly = useCallback((value: boolean) => {
    setFavoritesOnlyValue(value);
    setSkip(0);
  }, []);

  const total = query.data?.total ?? 0;
  const recipes = query.data?.recipes ?? [];

  return {
    recipes,
    total,

    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,

    search,
    setSearch,
    selectedTagIds,
    toggleTag,
    clearTags,
    favoritesOnly,
    setFavoritesOnly,
    /** Distinguishes "this household has no recipes" from "nothing matched". */
    hasActiveFilters:
      debouncedSearch.trim().length > 0 ||
      selectedTagIds.length > 0 ||
      favoritesOnly,

    skip,
    pageSize: PAGE_SIZE,
    rangeStart: total === 0 ? 0 : skip + 1,
    rangeEnd: Math.min(skip + PAGE_SIZE, total),
    hasPrevious: skip > 0,
    hasNext: skip + PAGE_SIZE < total,
    goToPrevious: () => setSkip((current) => Math.max(0, current - PAGE_SIZE)),
    goToNext: () => setSkip((current) => current + PAGE_SIZE),
  };
}
