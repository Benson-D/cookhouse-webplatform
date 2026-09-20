"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CHDecimalField, CHSelect, CHTextInput, UnitPicker } from "@/common";
import { useCreatableSelect } from "@/hooks/useCreatableSelect";
import { cn } from "@/lib/cn";
import type { RecipeFormInput, RecipeFormValues } from "../../recipe-form.schema";
import { RemoveRowButton } from "./RepeaterControls";
import styles from "./IngredientRows.module.css";

type Ingredient = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string | null };

/** One ingredient row: amount, unit (pick-only), ingredient (typed, autocompleted, created on demand), and a note. */
export function IngredientRow({
  index,
  isLast,
  ingredientOptions,
  units,
  onSearch,
  searchFn,
  onRemove,
}: {
  index: number;
  isLast: boolean;
  ingredientOptions: Ingredient[];
  units: Unit[];
  onSearch: (query: string) => void;
  searchFn: (name: string) => Promise<Ingredient>;
  onRemove: () => void;
}) {
  const { register, setValue, watch, formState } = useFormContext<
    RecipeFormInput,
    unknown,
    RecipeFormValues
  >();
  const rowErrors = formState.errors.ingredients?.[index];
  const ingredientId = watch(`ingredients.${index}.ingredientId`);
  const ingredientName = watch(`ingredients.${index}.ingredientName`);
  const unitId = watch(`ingredients.${index}.unitId`) ?? "";
  const amount = watch(`ingredients.${index}.amount`) ?? "";

  function setIngredient(ingredient: Ingredient) {
    setValue(`ingredients.${index}.ingredientId`, ingredient.id, { shouldValidate: true });
    setValue(`ingredients.${index}.ingredientName`, ingredient.name);
  }

  const creatable = useCreatableSelect({ options: ingredientOptions, searchFn });

  // This row owns "clearing" entirely — CHSelect has no clear button or
  // concept of one. Bumping this key remounts CHSelect, which is the only
  // way to blank typed-but-uncommitted text (Headless UI's ComboboxInput
  // has no controlled `value`, only `displayValue` derived from a real
  // selection).
  const [selectResetKey, setSelectResetKey] = useState(0);

  function clearIngredient() {
    setValue(`ingredients.${index}.ingredientId`, "", { shouldValidate: true });
    setValue(`ingredients.${index}.ingredientName`, "");
    setSelectResetKey((key) => key + 1);
  }

  return (
    <div className="flex flex-col gap-1">
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

        <div className={cn(styles.ingredient, "relative")}>
          <CHSelect<Ingredient>
            key={selectResetKey}
            ariaLabel={`Ingredient ${index + 1}`}
            placeholder="ingredient"
            invalid={Boolean(rowErrors?.ingredientId)}
            value={ingredientId ? { id: ingredientId, name: ingredientName } : null}
            options={creatable.options}
            getOptionId={(ingredient) => ingredient.id}
            getOptionLabel={(ingredient) => ingredient.name}
            className={ingredientId || ingredientName ? "pr-14" : undefined}
            onInputChange={(event) => {
              creatable.onInputChange(event);
              onSearch(event.target.value);
            }}
            onChange={async (ingredient) => {
              if (!ingredient) return;
              setIngredient(await creatable.handleSelect(ingredient));
            }}
          />
          {(ingredientId || ingredientName) && (
            <button
              type="button"
              onClick={clearIngredient}
              aria-label={`Clear ingredient ${index + 1}`}
              className="absolute inset-y-0 right-7 flex items-center px-1 text-ink-faint hover:text-ink"
            >
              ×
            </button>
          )}
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
          <RemoveRowButton onClick={onRemove} label={`Remove ingredient ${index + 1}`} />
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
}
