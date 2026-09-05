"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { toFractionLabel } from "@/lib/fraction";

const classes =
  "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent";

function formatForDisplay(raw: string): string {
  const parsed = Number(raw);
  if (raw.trim() === "" || Number.isNaN(parsed)) {
    return raw;
  }
  return toFractionLabel(parsed);
}

/**
 * A decimal amount field that shows common kitchen fractions ("1¾") once
 * you're done editing, but always reports and accepts plain decimals
 * ("1.75") — typing stays plain-number simple, no fraction syntax to parse.
 *
 * `value`/`onChange` rather than spreading `register(...)`, same as
 * `UnitPicker` — the value shown while focused (the raw decimal, for easy
 * editing) genuinely differs from the value shown once blurred (the
 * formatted fraction), so this can't be a plain passthrough input.
 */
export function CHDecimalField({
  value,
  onChange,
  onBlur,
  invalid,
  className,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur" | "type">) {
  const [text, setText] = useState(() => formatForDisplay(value));
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setText(formatForDisplay(value));
    }
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-invalid={invalid || undefined}
      className={cn(classes, invalid && "border-danger", className)}
      value={text}
      onFocus={() => {
        isFocused.current = true;
        setText(value);
      }}
      onChange={(event) => {
        setText(event.target.value);
        onChange(event.target.value);
      }}
      onBlur={() => {
        isFocused.current = false;
        setText(formatForDisplay(value));
        onBlur?.();
      }}
      {...props}
    />
  );
}
