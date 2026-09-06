"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CHNumInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
  label?: string;
  hint?: string;
  error?: string;
};

/** Strips every non-digit character, then clamps what's left to `min`. */
function sanitize(value: string, min: number): string {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly === "" ? "" : String(Math.max(min, Number(digitsOnly)));
}

/**
 * A number field that only ever holds digits, never below `min` (default 0)
 * — for prep/cook time, servings, and anything else that's a count or a
 * duration. Grows its own optional label/hint/error chrome, same as
 * `CHTextInput`.
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
  label,
  hint,
  error,
  className,
  id,
  min = 0,
  onChange,
  ...props
}: CHNumInputProps) {
  const minValue = Number(min);
  const isInvalid = invalid ?? Boolean(error);

  return (
    // `contents` when unlabeled: this div never lays out — its child acts as
    // the direct grid/flex item, matching the many per-row fields with no
    // visible label that rely on being their own grid cell.
    <div className={cn(label ? "flex flex-col gap-[5px]" : "contents", label && className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        aria-invalid={isInvalid || undefined}
        className={cn(
          "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent",
          isInvalid && "border-danger",
          !label && className
        )}
        onChange={(event) => {
          const sanitized = sanitize(event.target.value, minValue);
          if (sanitized !== event.target.value) {
            event.target.value = sanitized;
          }
          onChange?.(event);
        }}
        {...props}
      />
      {label && hint && !error && <p className="m-0 text-[11.5px] text-ink-faint">{hint}</p>}
      {label && error && (
        <p className="m-0 text-[11.5px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
