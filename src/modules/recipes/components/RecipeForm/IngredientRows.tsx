"use client";

import { useFieldArray, type Control } from "react-hook-form";
import type { RecipeFormInput, RecipeFormValues } from "../../recipe-form.schema";
import { IngredientRow } from "./IngredientRow";
import { AddLineButton } from "./RepeaterControls";

type Ingredient = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string | null };

/**
 * Presentational: form state and the ingredient resolver arrive as props, so
 * this holds no query of its own. Each row is its own component
 * (`IngredientRow`) since it needs its own `useCreatableSelect` call — a
 * hook can't be called inside this `.map()` directly.
 */
export function IngredientRows({
  label,
  control,
  ingredientOptions,
  units,
  onSearch,
  searchFn,
}: {
  label: string;
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
  ingredientOptions: Ingredient[];
  units: Unit[];
  onSearch: (query: string) => void;
  searchFn: (name: string) => Promise<Ingredient>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <IngredientRow
            key={field.id}
            index={index}
            isLast={index === fields.length - 1}
            ingredientOptions={ingredientOptions}
            units={units}
            onSearch={onSearch}
            searchFn={searchFn}
            onRemove={() => remove(index)}
          />
        ))}

        <AddLineButton
          onClick={() =>
            append({
              ingredientId: "",
              ingredientName: "",
              unitId: "",
              amount: "1",
              notes: "",
            })
          }
        >
          Add ingredient
        </AddLineButton>
      </div>
    </div>
  );
}
