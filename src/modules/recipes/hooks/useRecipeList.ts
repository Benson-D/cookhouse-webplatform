"use client";

import { trpc } from "@/lib/trpc";

/**
 * Just the `recipes.list` query. Filters and pagination are owned by
 * `useRecipeFilters`/`usePagination` — the composing screen calls both and
 * passes their values in here.
 */
export function useRecipeList({
  filters,
  pagination,
}: {
  filters: {
    debouncedSearch: string;
    selectedTagIds: string[];
    favoritesOnly: boolean;
    maxCookingTime: number | null;
  };
  pagination: { skip: number; pageSize: number };
}) {
  const query = trpc.recipes.list.useQuery(
    {
      search: filters.debouncedSearch.trim() || undefined,
      tagIds: filters.selectedTagIds.length > 0 ? filters.selectedTagIds : undefined,
      favoritesOnly: filters.favoritesOnly || undefined,
      maxCookingTime: filters.maxCookingTime ?? undefined,
      skip: pagination.skip,
      take: pagination.pageSize,
    },
    {
      // Keeps the previous page on screen while the next one loads, so
      // paging doesn't blank the grid on every click.
      placeholderData: (previous) => previous,
    }
  );

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

    rangeStart: total === 0 ? 0 : pagination.skip + 1,
    rangeEnd: Math.min(pagination.skip + pagination.pageSize, total),
    hasPrevious: pagination.skip > 0,
    hasNext: pagination.skip + pagination.pageSize < total,
  };
}
