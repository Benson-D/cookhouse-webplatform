"use client";

type NamedOption = { id: string; name: string };

/** Reserved id for the synthetic "Add {name}" row — real ids never collide with it. */
const CREATE_OPTION_ID = "__create__";

/**
 * Populates options from an async search function and adds a create option
 * unless one of them already matches the typed text exactly.
 */
export function useCreatableSelect<T extends NamedOption>({
  options,
  inputValue,
  findOrCreate,
}: {
  options: T[];
  inputValue: string;
  findOrCreate: (name: string) => Promise<T>;
}) {
  const trimmedSearchValue = inputValue.trim();
  const hasExactMatch = options.some(
    (option) => option.name.toLowerCase() === trimmedSearchValue.toLowerCase()
  );
  const canCreate = trimmedSearchValue.length > 0 && !hasExactMatch;

  const createOption = canCreate
    ? ({ id: CREATE_OPTION_ID, name: `Add "${trimmedSearchValue}"` } as T)
    : null;

  const handleSelect = async (item: T): Promise<T> => {
    const isCreateOption = item.id === CREATE_OPTION_ID;
    if (!isCreateOption) return Promise.resolve(item);

    return findOrCreate(trimmedSearchValue);
  };

  return {
    options: createOption ? [...options, createOption] : options,
    handleSelect,
  };
}
