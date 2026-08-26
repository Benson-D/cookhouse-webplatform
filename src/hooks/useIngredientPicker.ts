"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Autocomplete over the shared ingredient list, with create-on-demand.
 *
 * Ingredients are a single global list across every household — fragmenting
 * "onion" into per-household rows would silently break grocery-list merging and
 * spend-by-item reports. `resolve` goes through `ingredients.create`, which is
 * find-or-create and checks aliases first, so picking an existing name never
 * makes a near-duplicate.
 *
 * This is the opposite of the tag picker on purpose: ingredients *can* be
 * typed and created by anyone, tags cannot.
 */
export function useIngredientPicker() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const query = trpc.ingredients.list.useQuery(
    { search: debouncedSearch.trim() || undefined },
    { staleTime: 30 * 1000 }
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
