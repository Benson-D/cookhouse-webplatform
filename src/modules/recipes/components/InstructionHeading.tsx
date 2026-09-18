"use client";

import { Controller, type Control } from "react-hook-form";
import { cn } from "@/lib/cn";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { RemoveRowButton } from "./RepeaterControls";

/** A named section title within the method field, e.g. "How to make the sauce". */
export function InstructionHeading({
  control,
  index,
  isFirst,
  onRemove,
}: {
  control: Control<RecipeFormInput, unknown, RecipeFormValues>;
  index: number;
  isFirst: boolean;
  onRemove: () => void;
}) {
  return (
    <div className={cn("mb-2 flex items-center gap-2.5", isFirst ? "mt-0" : "mt-3")}>
      <Controller
        control={control}
        name={`instructions.${index}.text`}
        render={({ field }) => (
          <input
            {...field}
            placeholder='Section heading (e.g. "How to make the sauce")'
            aria-label="Section heading"
            className="w-full flex-1 border-0 border-b border-dashed border-line bg-transparent px-0.5 pb-[7px] pt-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint placeholder:text-ink-faint placeholder:normal-case placeholder:tracking-normal focus:outline-none"
          />
        )}
      />
      <RemoveRowButton onClick={onRemove} label="Remove this heading" />
    </div>
  );
}
