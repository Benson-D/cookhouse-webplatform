"use client";

import type { Control } from "react-hook-form";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { useInstructions } from "../hooks/useInstructions";
import { InstructionHeading } from "./InstructionHeading";
import { InstructionRow } from "./InstructionRow";
import { AddLineButton } from "./RepeaterControls";

/** The method field: repeating steps, each optionally starting a named section. */
export function Instructions({
  label,
  control,
}: {
  label: string;
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
}) {
  const { fields, watched, stepNumbers, addStep, addHeading, remove } = useInstructions(control);

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) =>
          watched[index]?.type === "heading" ? (
            <InstructionHeading
              key={field.id}
              control={control}
              index={index}
              isFirst={index === 0}
              onRemove={() => remove(index)}
            />
          ) : (
            <InstructionRow
              key={field.id}
              index={index}
              stepNumber={stepNumbers[index]}
              onRemove={() => remove(index)}
            />
          )
        )}

        <div className="flex items-center gap-4">
          <AddLineButton onClick={addStep}>Add step</AddLineButton>
          <AddLineButton onClick={addHeading}>Add section heading</AddLineButton>
        </div>
      </div>
    </div>
  );
}
