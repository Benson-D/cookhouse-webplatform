"use client";

import { useFieldArray, useWatch, type Control } from "react-hook-form";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { getStepNumbers } from "../utils/instructions";

/**
 * The method field: one flat field array of heading/step items. A heading
 * applies to every step below it until the next heading — there's no
 * separate array or id linking them, just position. Step numbers restart
 * at 1 after each heading, computed here from the live values, not stored.
 */
export function useInstructions(control: Control<RecipeFormInput, unknown, RecipeFormValues>) {
  const { fields, append, remove } = useFieldArray({ control, name: "instructions" });

  const watched = useWatch({ control, name: "instructions" });
  const stepNumbers = getStepNumbers(watched);

  const addStep = () => {
    append({ type: "step", text: "", timerSeconds: "" });
  };

  const addHeading = () => {
    append({ type: "heading", text: "" });
  };

  return {
    fields,
    watched,
    stepNumbers,
    addStep,
    addHeading,
    remove,
  };
}
