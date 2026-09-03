"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Every filter `recipes.list` accepts, plus the debounced search value it's
 * actually queried with.
 *
 * `onChange` fires on any filter change, no matter which one — wired to
 * `usePagination`'s `reset` by the composing screen, since page 3 of the old
 * result set has no meaning against a new filter and silently showing an
 * empty page reads as "no matches" when there are plenty.
 */
export function useRecipeFilters({ onChange }: { onChange?: () => void } = {}) {
  const [search, setSearchValue] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnlyValue] = useState(false);
  const [maxCookingTime, setMaxCookingTimeValue] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onChange?.();
    },
    [onChange]
  );

  const handleToggleTag = useCallback(
    (tagId: string) => {
      setSelectedTagIds((current) =>
        current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
      );
      onChange?.();
    },
    [onChange]
  );

  const handleClearTags = useCallback(() => {
    setSelectedTagIds([]);
    onChange?.();
  }, [onChange]);

  const handleFavoritesOnlyChange = useCallback(
    (value: boolean) => {
      setFavoritesOnlyValue(value);
      onChange?.();
    },
    [onChange]
  );

  const handleMaxCookingTimeChange = useCallback(
    (value: number | null) => {
      setMaxCookingTimeValue(value);
      onChange?.();
    },
    [onChange]
  );

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 ||
    selectedTagIds.length > 0 ||
    favoritesOnly ||
    maxCookingTime !== null;

  return {
    search,
    handleSearch,
    debouncedSearch,
    selectedTagIds,
    handleToggleTag,
    handleClearTags,
    favoritesOnly,
    handleFavoritesOnlyChange,
    maxCookingTime,
    handleMaxCookingTimeChange,
    hasActiveFilters,
  };
}
