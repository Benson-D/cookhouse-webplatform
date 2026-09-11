"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

const MIN_SEARCH_LENGTH = 3;

/**
 * Autocomplete over the shared ingredient list, with create-on-demand —
 * unlike the tag picker, ingredients can be typed and created by anyone.
 * `resolve` goes through `ingredients.create` (find-or-create, aliases
 * checked first), so picking an existing name never makes a near-duplicate.
 *
 * Queries on an empty search too (`ingredients.list`'s own bounded default
 * page), but not on a 1-2 character partial one — too noisy to be useful.
 */
export function useIngredientSearchPicker() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const trimmedSearch = debouncedSearch.trim();

  const query = trpc.ingredients.list.useQuery(
    { search: trimmedSearch || undefined },
    {
      staleTime: 30 * 1000,
      enabled: trimmedSearch.length === 0 || trimmedSearch.length >= MIN_SEARCH_LENGTH,
    }
  );

  const create = trpc.ingredients.create.useMutation();

  return {
    search,
    setSearch,
    options: query.data ?? [],
    isSearching: query.isFetching,

    /** Resolves typed text to a canonical ingredient, creating it if new. */
    resolve: (name: string) => create.mutateAsync({ name: name.trim() }),
    isResolving: create.isPending,
  };
}

/** Measurement units are seeded reference data — read-only, and rarely change. */
export function useUnits() {
  const query = trpc.units.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  return { units: query.data ?? [], isLoading: query.isPending };
}
