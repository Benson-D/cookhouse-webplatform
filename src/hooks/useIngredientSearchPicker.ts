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
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);
  const trimmedSearchValue = debouncedSearch.trim();

  const query = trpc.ingredients.list.useQuery(
    { search: trimmedSearchValue || undefined },
    {
      staleTime: 30 * 1000,
      enabled: trimmedSearchValue.length === 0 || trimmedSearchValue.length >= MIN_SEARCH_LENGTH,
    }
  );

  const create = trpc.ingredients.create.useMutation();

  return {
    searchValue,
    setSearchValue,
    options: query.data ?? [],
    isSearching: query.isFetching,

    /** Resolves typed text to a canonical ingredient, creating it if new. */
    findOrCreate: (name: string) => create.mutateAsync({ name: name.trim() }),
    isCreating: create.isPending,
  };
}

/** Measurement units are seeded reference data — read-only, and rarely change. */
export function useUnits() {
  const query = trpc.units.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  return { units: query.data ?? [], isLoading: query.isPending };
}
