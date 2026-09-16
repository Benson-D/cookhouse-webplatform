"use client";

import { useFieldArray, useFormContext, type Control } from "react-hook-form";
import { CHDecimalField, CHSelect, CHTextInput, UnitPicker } from "@/common";
import { cn } from "@/lib/cn";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { AddLineButton, RemoveRowButton } from "./RepeaterControls";
import styles from "./IngredientRows.module.css";

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
  label,
  control,
  ingredientOptions,
  units,
  onSearchIngredients,
  onResolveIngredient,
}: {
  label: string;
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
  ingredientOptions: Ingredient[];
  units: Unit[];
  onSearchIngredients: (query: string) => void;
  onResolveIngredient: (name: string) => Promise<Ingredient>;
}) {
  const { register, setValue, watch, formState } = useFormContext<
    RecipeFormInput,
    unknown,
    RecipeFormValues
  >();
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
        {fields.map((field, index) => {
          const rowErrors = formState.errors.ingredients?.[index];
          const ingredientId = watch(`ingredients.${index}.ingredientId`);
          const ingredientName = watch(`ingredients.${index}.ingredientName`);
          const unitId = watch(`ingredients.${index}.unitId`) ?? "";
          const amount = watch(`ingredients.${index}.amount`) ?? "";
          const isLast = index === fields.length - 1;

          return (
            <div key={field.id} className="flex flex-col gap-1">
              <div className={cn(styles.row, !isLast && styles.rowDivider)}>
                <div className={styles.amount}>
                  <CHDecimalField
                    value={amount}
                    onChange={(value) => setValue(`ingredients.${index}.amount`, value)}
                    placeholder="1"
                    aria-label={`Amount for ingredient ${index + 1}`}
                    invalid={Boolean(rowErrors?.amount)}
                    className="w-full"
                  />
                </div>

                <div className={styles.unit}>
                  <UnitPicker
                    label={`Unit for ingredient ${index + 1}`}
                    unitId={unitId}
                    units={units}
                    onSelect={(unit) => setValue(`ingredients.${index}.unitId`, unit.id)}
                  />
                </div>

                <div className={styles.ingredient}>
                  <CHSelect<Ingredient>
                    ariaLabel={`Ingredient ${index + 1}`}
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
                    onClear={() => {
                      setValue(`ingredients.${index}.ingredientId`, "", { shouldValidate: true });
                      setValue(`ingredients.${index}.ingredientName`, "");
                    }}
                  />
                </div>

                <div className={styles.note}>
                  <CHTextInput
                    {...register(`ingredients.${index}.notes`)}
                    placeholder="note"
                    aria-label={`Note for ingredient ${index + 1}`}
                    className="w-full"
                  />
                </div>

                <div className={styles.remove}>
                  <RemoveRowButton
                    onClick={() => remove(index)}
                    label={`Remove ingredient ${index + 1}`}
                  />
                </div>
              </div>

              {rowErrors?.ingredientId?.message && (
                <p className="m-0 text-[11.5px] text-danger" role="alert">
                  {rowErrors.ingredientId.message}
                </p>
              )}
              {rowErrors?.amount?.message && (
                <p className="m-0 text-[11.5px] text-danger" role="alert">
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
