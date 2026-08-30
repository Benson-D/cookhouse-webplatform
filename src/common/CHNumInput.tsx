"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CHNumInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
};

const classes =
  "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent";

/** Strips every non-digit character, then clamps what's left to `min`. */
function sanitize(value: string, min: number): string {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly === "" ? "" : String(Math.max(min, Number(digitsOnly)));
}

/**
 * A number field that only ever holds digits, never below `min` (default 0)
 * — for prep/cook time, servings, and anything else that's a count or a
 * duration.
 *
 * Still `inputMode="numeric"` on a text input, matching every other numeric
 * field in the recipe form (amount, timer seconds), not native
 * `type="number"` — whose reported `.value` can silently diverge from what's
 * on screen for intermediate states like a bare "-" or a trailing ".".
 *
 * Sanitizes in `onChange` rather than only marking the field invalid: every
 * non-digit character is stripped (so pasted or typed text can't leave
 * anything but digits behind, and a `-` sign never survives to begin with),
 * then what's left is clamped to `min`. Composes with whatever `onChange` is
 * passed in — react-hook-form's `register(...).onChange` included — by
 * sanitizing the event's value first, then forwarding the same event, so it
 * drops in wherever `CHTextInput` does.
 */
export function CHNumInput({
  invalid,
  className,
  min = 0,
  onChange,
  ...props
}: CHNumInputProps) {
  const minValue = Number(min);

  return (
    <input
      type="text"
      inputMode="numeric"
      aria-invalid={invalid || undefined}
      className={cn(classes, invalid && "border-danger", className)}
      onChange={(event) => {
        const sanitized = sanitize(event.target.value, minValue);
        if (sanitized !== event.target.value) {
          event.target.value = sanitized;
        }
        onChange?.(event);
      }}
      {...props}
    />
  );
}
