"use client";

import { useFieldArray, useFormContext, type Control } from "react-hook-form";
import { CHTextArea, CHTextInput } from "@/common";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { AddLineButton, RemoveRowButton } from "./FormControls";

/** Repeating step-text + optional-timer rows for the recipe form's method field. The number badge reflects position, not a stored field. */
export function InstructionsRows({
  label,
  control,
}: {
  label: string;
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
}) {
  const { register, formState } = useFormContext<RecipeFormInput, unknown, RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "instructions" });

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => {
          const rowErrors = formState.errors.instructions?.[index];
          return (
            <div key={field.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-2.5">
                <span className="mt-2 grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent">
                  {index + 1}
                </span>

                <CHTextArea
                  {...register(`instructions.${index}.text`)}
                  rows={1}
                  placeholder="Describe the next step…"
                  aria-label={`Step ${index + 1}`}
                  invalid={Boolean(rowErrors?.text)}
                  className="flex-1"
                />

                <CHTextInput
                  {...register(`instructions.${index}.timerSeconds`)}
                  placeholder="secs"
                  inputMode="numeric"
                  aria-label={`Timer for step ${index + 1}, in seconds`}
                  invalid={Boolean(rowErrors?.timerSeconds)}
                  className="mt-0 w-[76px]"
                />

                <div className="mt-2">
                  <RemoveRowButton
                    onClick={() => remove(index)}
                    label={`Remove step ${index + 1}`}
                  />
                </div>
              </div>

              {rowErrors?.text?.message && (
                <p className="m-0 pl-[31px] text-[11.5px] text-danger" role="alert">
                  {rowErrors.text.message}
                </p>
              )}
            </div>
          );
        })}

        <AddLineButton onClick={() => append({ text: "", timerSeconds: "" })}>
          Add step
        </AddLineButton>
      </div>
    </div>
  );
}
