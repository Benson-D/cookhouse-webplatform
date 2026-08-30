"use client";

import { useFormContext } from "react-hook-form";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { CHFormField, CHTextInput } from "@/common";

/** Title and the one field that exists from the very first render: the name. */
export function RecipeFormHeader({ isEditing }: { isEditing: boolean }) {
  const { register, formState } =
    useFormContext<RecipeFormInput, unknown, RecipeFormValues>();

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="m-0 font-display text-[25px] font-semibold leading-[1.15] text-ink">
        {isEditing ? "Edit recipe" : "New recipe"}
      </h1>

      <CHFormField
        label="Recipe name"
        htmlFor="recipe-name"
        error={formState.errors.name?.message}
      >
        <CHTextInput
          id="recipe-name"
          autoFocus={!isEditing}
          placeholder="Weeknight Red Lentil Dal"
          {...register("name")}
          invalid={Boolean(formState.errors.name)}
        />
      </CHFormField>
    </div>
  );
}
