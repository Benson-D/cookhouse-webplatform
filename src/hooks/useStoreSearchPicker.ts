"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

const MIN_SEARCH_LENGTH = 3;

/**
 * Autocomplete over the shared store list — free solo, unlike the ingredient
 * picker. `confirmPurchases.storeName` is already a plain string that
 * `findOrCreateStore` resolves (and uppercases) server-side at confirm time,
 * so there's nothing here for `resolve` to eagerly create; it just echoes
 * back the typed name.
 *
 * Queries on an empty search too (`stores.search`'s own bounded default
 * page), but not on a 1-2 character partial one — too noisy to be useful.
 */
export function useStoreSearchPicker() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);
  const trimmedSearchValue = debouncedSearch.trim();

  const query = trpc.stores.search.useQuery(
    { search: trimmedSearchValue || undefined },
    {
      staleTime: 30 * 1000,
      enabled: trimmedSearchValue.length === 0 || trimmedSearchValue.length >= MIN_SEARCH_LENGTH,
    }
  );

  return {
    searchValue,
    setSearchValue,
    options: query.data ?? [],
    isSearching: query.isFetching,
  };
}
