"use client";

import { useFormContext } from "react-hook-form";
import { CHNumInput, CHTextArea } from "@/common";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import { RemoveRowButton } from "./RepeaterControls";

/** One method step: its instruction text, an optional timer, and a step number restarting after each heading. */
export function InstructionRow({
  index,
  stepNumber,
  onRemove,
}: {
  index: number;
  stepNumber: number | null;
  onRemove: () => void;
}) {
  const { register, formState } = useFormContext<RecipeFormInput, unknown, RecipeFormValues>();
  const errors = formState.errors.instructions?.[index] as
    { text?: { message?: string }; timerSeconds?: { message?: string } } | undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2.5">
        <span className="mt-2 grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent">
          {stepNumber}
        </span>

        <CHTextArea
          {...register(`instructions.${index}.text`)}
          rows={1}
          placeholder="Describe the next step…"
          aria-label={`Step ${stepNumber}`}
          invalid={Boolean(errors?.text)}
          className="flex-1"
        />

        <CHNumInput
          {...register(`instructions.${index}.timerSeconds`)}
          placeholder="secs"
          aria-label={`Timer for step ${stepNumber}, in seconds`}
          invalid={Boolean(errors?.timerSeconds)}
          className="mt-0 w-[76px]"
        />

        <div className="mt-2">
          <RemoveRowButton onClick={onRemove} label={`Remove step ${stepNumber}`} />
        </div>
      </div>

      {errors?.text?.message && (
        <p className="m-0 pl-[31px] text-[11.5px] text-danger" role="alert">
          {errors.text.message}
        </p>
      )}
    </div>
  );
}
