"use client";

import { trpc } from "@/lib/trpc";

// ~10-15s, per root CLAUDE.md's "Real-time layer" decision — slower than the
// grocery list's 3-5s, since nobody's waiting on a recipe-list update the
// way two people shopping from the same list are.
const RECIPE_POLL_MS = 12_000;

/**
 * Just the `recipes.list` query. Filters and pagination are owned by
 * `useRecipeFilters`/`usePagination` — the composing screen calls both and
 * passes their values in here.
 *
 * `poll` defaults off — this hook is also used by the "Add from recipes"
 * picker (`AddFromRecipesScreen`), which the polling decision doesn't cover.
 * Only `RecipeListScreen` passes `poll: true`.
 */
export function useRecipeList({
  filters,
  pagination,
  poll = false,
}: {
  filters: {
    debouncedSearch: string;
    selectedTagIds: string[];
    favoritesOnly: boolean;
    maxCookingTime: number | null;
  };
  pagination: { skip: number; pageSize: number };
  poll?: boolean;
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
      ...(poll && { refetchInterval: RECIPE_POLL_MS }),
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
