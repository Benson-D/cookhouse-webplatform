"use client";

import { useState } from "react";

type NamedOption = { id: string; name: string };

/** Reserved id for the synthetic "Add {name}" row — real ids never collide with it. */
const CREATE_OPTION_ID = "__create__";

/**
 * Populates options from an async search function and adds a create option
 * only when the search turns up no options at all.
 */
export function useCreatableSelect<T extends NamedOption>({
  options,
  searchFn,
}: {
  options: T[];
  searchFn: (name: string) => Promise<T>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const trimmedSearchValue = searchValue.trim();
  const canCreate = trimmedSearchValue.length > 0 && options.length === 0;

  const createOption = canCreate
    ? ({ id: CREATE_OPTION_ID, name: isCreating ? "Adding…" : `Add "${trimmedSearchValue}"` } as T)
    : null;

  function isCreateOption(item: T) {
    return item.id === CREATE_OPTION_ID;
  }

  async function handleSelect(item: T): Promise<T> {
    if (!isCreateOption(item)) return item;

    setIsCreating(true);

    try {
      const created = await searchFn(trimmedSearchValue);
      setSearchValue("");
      return created;
    } finally {
      setIsCreating(false);
    }
  }

  return {
    options: createOption ? [...options, createOption] : options,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),
    handleSelect,
  };
}
