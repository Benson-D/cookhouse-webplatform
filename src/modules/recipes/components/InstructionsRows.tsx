"use client";

import { useFieldArray, useFormContext, useWatch, type Control } from "react-hook-form";
import { CHNumInput, CHTextArea } from "@/common";
import { cn } from "@/lib/cn";
import { groupByHeading } from "../utils/instructions";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { AddLineButton, RemoveRowButton } from "./RepeaterControls";

/**
 * The method field: repeating step + optional-timer rows, with an optional
 * section heading above any row. A heading and its step are one field-array
 * entry — appending a heading always brings its first step with it, and
 * either row's × removes both together.
 */
export function InstructionsRows({
  label,
  control,
}: {
  label: string;
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
}) {
  const { register, formState } = useFormContext<RecipeFormInput, unknown, RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "instructions" });

  const watchedInstructions = useWatch({ control, name: "instructions" });
  const groups = groupByHeading(
    watchedInstructions.map((row) => ({ step: 0, text: row.text, heading: row.heading }))
  );
  const badgeNumbers = groups.flatMap((group) => group.items.map((_, i) => i + 1));

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => {
          const rowErrors = formState.errors.instructions?.[index];
          const hasHeading = watchedInstructions[index]?.heading !== undefined;

          return (
            <div key={field.id} className="flex flex-col gap-1">
              {hasHeading && (
                <div
                  className={cn("mb-2 flex items-center gap-2.5", index === 0 ? "mt-0" : "mt-3")}
                >
                  <input
                    {...register(`instructions.${index}.heading`)}
                    placeholder='Section heading (e.g. "How to make the sauce")'
                    aria-label={`Section heading before step ${badgeNumbers[index]}`}
                    className="w-full flex-1 border-0 border-b border-dashed border-line bg-transparent px-0.5 pb-[7px] pt-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint placeholder:text-ink-faint placeholder:normal-case placeholder:tracking-normal focus:outline-none"
                  />
                  <RemoveRowButton onClick={() => remove(index)} label="Remove this section" />
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <span className="mt-2 grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent">
                  {badgeNumbers[index]}
                </span>

                <CHTextArea
                  {...register(`instructions.${index}.text`)}
                  rows={1}
                  placeholder="Describe the next step…"
                  aria-label={`Step ${badgeNumbers[index]}`}
                  invalid={Boolean(rowErrors?.text)}
                  className="flex-1"
                />

                <CHNumInput
                  {...register(`instructions.${index}.timerSeconds`)}
                  placeholder="secs"
                  aria-label={`Timer for step ${badgeNumbers[index]}, in seconds`}
                  invalid={Boolean(rowErrors?.timerSeconds)}
                  className="mt-0 w-[76px]"
                />

                <div className="mt-2">
                  <RemoveRowButton
                    onClick={() => remove(index)}
                    label={`Remove step ${badgeNumbers[index]}`}
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

        <div className="flex items-center gap-4">
          <AddLineButton onClick={() => append({ text: "", timerSeconds: "" })}>
            Add step
          </AddLineButton>
          <AddLineButton onClick={() => append({ text: "", timerSeconds: "", heading: "" })}>
            Add section heading
          </AddLineButton>
        </div>
      </div>
    </div>
  );
}
