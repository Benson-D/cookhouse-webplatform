"use client";

import { useFieldArray, useFormContext, type Control } from "react-hook-form";
import { CHSelect, CHTextInput, UnitPicker } from "@/components/common";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { AddLineButton, RemoveRowButton } from "./FormControls";

type Ingredient = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string | null };

/**
 * Amount and unit are both optional, so "salt · to taste" is a valid row.
 * The unit is a **pick-only select** — merging depends on real
 * `MeasurementUnit` rows, and a typed "tbsp." would break it silently. The
 * ingredient is the opposite: typed, autocompleted, and created on demand via
 * `CHSelect`'s `onCreate`.
 *
 * Presentational: form state and the ingredient resolver arrive as props, so
 * this holds no query of its own.
 */
export function IngredientRows({
  control,
  ingredientOptions,
  units,
  onSearchIngredients,
  onResolveIngredient,
}: {
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
  ingredientOptions: Ingredient[];
  units: Unit[];
  onSearchIngredients: (query: string) => void;
  onResolveIngredient: (name: string) => Promise<Ingredient>;
}) {
  const { register, setValue, watch, formState } =
    useFormContext<RecipeFormInput, unknown, RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => {
        const rowErrors = formState.errors.ingredients?.[index];
        const ingredientId = watch(`ingredients.${index}.ingredientId`);
        const ingredientName = watch(`ingredients.${index}.ingredientName`);
        const unitId = watch(`ingredients.${index}.unitId`) ?? "";

        return (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[68px_108px_1fr_1fr_28px]">
              <CHTextInput
                {...register(`ingredients.${index}.amount`)}
                placeholder="1"
                inputMode="decimal"
                aria-label={`Amount for ingredient ${index + 1}`}
                invalid={Boolean(rowErrors?.amount)}
              />

              <UnitPicker
                label={`Unit for ingredient ${index + 1}`}
                unitId={unitId}
                units={units}
                onSelect={(unit) =>
                  setValue(`ingredients.${index}.unitId`, unit.id)
                }
              />

              <CHSelect<Ingredient>
                label={`Ingredient ${index + 1}`}
                placeholder="ingredient"
                invalid={Boolean(rowErrors?.ingredientId)}
                value={ingredientId ? { id: ingredientId, name: ingredientName } : null}
                options={ingredientOptions}
                getOptionId={(ingredient) => ingredient.id}
                getOptionLabel={(ingredient) => ingredient.name}
                onSearch={onSearchIngredients}
                onSelect={(ingredient) => {
                  setValue(`ingredients.${index}.ingredientId`, ingredient.id, {
                    shouldValidate: true,
                  });
                  setValue(`ingredients.${index}.ingredientName`, ingredient.name);
                }}
                onCreate={onResolveIngredient}
              />

              <CHTextInput
                {...register(`ingredients.${index}.notes`)}
                placeholder="note"
                aria-label={`Note for ingredient ${index + 1}`}
              />

              <RemoveRowButton
                onClick={() => remove(index)}
                label={`Remove ingredient ${index + 1}`}
              />
            </div>

            {rowErrors?.ingredientId?.message && (
              <p className="m-0 text-[11.5px] text-[#B4442F]" role="alert">
                {rowErrors.ingredientId.message}
              </p>
            )}
            {rowErrors?.amount?.message && (
              <p className="m-0 text-[11.5px] text-[#B4442F]" role="alert">
                {rowErrors.amount.message}
              </p>
            )}
          </div>
        );
      })}

      <AddLineButton
        onClick={() =>
          append({
            ingredientId: "",
            ingredientName: "",
            unitId: "",
            amount: "",
            notes: "",
          })
        }
      >
        Add ingredient
      </AddLineButton>
    </div>
  );
}
