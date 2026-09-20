"use client";

import { useState } from "react";
import { CHButton, CHSelect } from "@/common";
import { useIngredientSearchPicker } from "@/hooks/useIngredientSearchPicker";
import { useCreatableSelect } from "@/hooks/useCreatableSelect";
import { FREQUENCY_OPTIONS } from "../utils";
import type { Staple } from "../types";

type Ingredient = { id: string; name: string };

/**
 * The screen's footer: an inline ingredient + frequency + Add row, same
 * shape as the recipe form's "+ Add ingredient" row, reusing
 * `useIngredientSearchPicker` and `useCreatableSelect`'s search/create
 * composition wholesale.
 *
 * Already-staple ingredients grey out in the picker rather than being
 * filtered out — still worth seeing what's already covered. The backend's
 * CONFLICT on a duplicate is a backstop for a race, not the primary defense.
 */
export function StapleFooter({
  existingStaples,
  onAdd,
  isAdding,
}: {
  existingStaples: Staple[];
  onAdd: (ingredientId: string, frequencyDays: number) => void;
  isAdding: boolean;
}) {
  const {
    searchValue,
    options: ingredientOptions,
    setSearchValue,
    findOrCreate,
  } = useIngredientSearchPicker();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [frequencyDays, setFrequencyDays] = useState<number>(FREQUENCY_OPTIONS[1].days);
  const creatable = useCreatableSelect<Ingredient>({
    options: ingredientOptions,
    inputValue: searchValue,
    findOrCreate,
  });

  const existingIngredientIds = new Set(existingStaples.map((staple) => staple.ingredientId));

  function handleAdd() {
    if (!ingredient) return;
    onAdd(ingredient.id, frequencyDays);
    setIngredient(null);
  }

  return (
    <div className="grid grid-cols-1 items-center gap-2.5 pt-3.5 md:grid-cols-[1fr_160px_76px]">
      <CHSelect<Ingredient>
        ariaLabel="Ingredient"
        placeholder="search or add an ingredient"
        value={ingredient}
        options={creatable.options}
        getOptionId={(item) => item.id}
        getOptionLabel={(item) => item.name}
        getOptionDisabled={(item) => existingIngredientIds.has(item.id)}
        onInputChange={(event) => setSearchValue(event.target.value)}
        onChange={async (item) => {
          if (!item) return;
          setIngredient(await creatable.handleSelect(item));
        }}
      />

      <CHSelect<(typeof FREQUENCY_OPTIONS)[number]>
        ariaLabel="Frequency"
        value={FREQUENCY_OPTIONS.find((option) => option.days === frequencyDays) ?? null}
        options={[...FREQUENCY_OPTIONS]}
        getOptionId={(option) => String(option.days)}
        getOptionLabel={(option) => option.label}
        onChange={(option) => option && setFrequencyDays(option.days)}
      />

      <CHButton variant="primary" onClick={handleAdd} disabled={!ingredient || isAdding}>
        {isAdding ? "Adding…" : "Add"}
      </CHButton>
    </div>
  );
}
