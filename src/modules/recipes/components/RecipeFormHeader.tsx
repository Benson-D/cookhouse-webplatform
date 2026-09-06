"use client";

import { useFormContext } from "react-hook-form";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { CHTextInput } from "@/common";

/** Title and the one field that exists from the very first render: the name. */
export function RecipeFormHeader({ isEditing }: { isEditing: boolean }) {
  const { register, formState } = useFormContext<RecipeFormInput, unknown, RecipeFormValues>();

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="m-0 font-display text-[25px] font-semibold leading-[1.15] text-ink">
        {isEditing ? "Edit recipe" : "New recipe"}
      </h1>

      <CHTextInput
        label="Recipe name"
        id="recipe-name"
        autoFocus={!isEditing}
        placeholder="Weeknight Red Lentil Dal"
        {...register("name")}
        error={formState.errors.name?.message}
      />
    </div>
  );
}
