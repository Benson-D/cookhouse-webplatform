"use client";

import { useState } from "react";
import { CHButton, CHSelect } from "@/components/common";
import { useIngredientPicker } from "@/hooks/useIngredientPicker";
import { FREQUENCY_OPTIONS } from "../utils";
import type { Staple } from "../types";

type Ingredient = { id: string; name: string };

/**
 * One inline row — ingredient + frequency + Add — same shape as the recipe
 * form's "+ Add ingredient" row, reusing `useIngredientPicker` and
 * `CHSelect`'s search/create-on-type behavior wholesale.
 *
 * Already-staple ingredients grey out in the picker rather than being
 * filtered out — still worth seeing what's already covered. The backend's
 * CONFLICT on a duplicate is a backstop for a race, not the primary defense.
 */
export function AddStapleRow({
  existingStaples,
  onAdd,
  isAdding,
}: {
  existingStaples: Staple[];
  onAdd: (ingredientId: string, frequencyDays: number) => void;
  isAdding: boolean;
}) {
  const picker = useIngredientPicker();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [frequencyDays, setFrequencyDays] = useState<number>(FREQUENCY_OPTIONS[1].days);

  const existingIngredientIds = new Set(existingStaples.map((staple) => staple.ingredientId));

  function handleAdd() {
    if (!ingredient) return;
    onAdd(ingredient.id, frequencyDays);
    setIngredient(null);
  }

  return (
    <div className="grid grid-cols-[1fr_160px_76px] items-center gap-2.5 pt-3.5">
      <CHSelect<Ingredient>
        label="Ingredient"
        placeholder="search or add an ingredient"
        value={ingredient}
        options={picker.options}
        getOptionId={(item) => item.id}
        getOptionLabel={(item) => item.name}
        getOptionDisabled={(item) => existingIngredientIds.has(item.id)}
        onSearch={picker.setSearch}
        onSelect={setIngredient}
        onCreate={picker.resolve}
      />

      <select
        value={frequencyDays}
        onChange={(event) => setFrequencyDays(Number(event.target.value))}
        aria-label="Frequency"
        className="rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink focus:outline-2 focus:outline-offset-1 focus:outline-accent"
      >
        {FREQUENCY_OPTIONS.map((option) => (
          <option key={option.days} value={option.days}>
            {option.label}
          </option>
        ))}
      </select>

      <CHButton variant="primary" onClick={handleAdd} disabled={!ingredient || isAdding}>
        {isAdding ? "Adding…" : "Add"}
      </CHButton>
    </div>
  );
}
