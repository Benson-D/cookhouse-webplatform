"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { parseFractionInput, toFractionLabel } from "@/lib/fraction";

const classes =
  "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent disabled:text-ink-faint disabled:cursor-not-allowed";

function formatForDisplay(raw: string): string {
  const parsed = Number(raw);
  if (raw.trim() === "" || Number.isNaN(parsed)) {
    return raw;
  }
  return toFractionLabel(parsed);
}

/**
 * A decimal amount field that shows kitchen fractions ("1¾") once you're
 * done editing. Accepts a plain decimal or "a/b" fraction syntax while
 * typing — either way, blur shows the fraction label.
 *
 * `value`/`onChange`, not `register(...)`: the focused and blurred text
 * genuinely differ, so this can't be a plain passthrough input.
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
      className={cn(classes, invalid && "border-danger focus:outline-danger", className)}
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
        // Resolve a typed fraction to its decimal value before formatting.
        const fraction = parseFractionInput(text);
        const resolved = fraction === null ? text : String(fraction);
        if (fraction !== null) {
          onChange(resolved);
        }
        setText(formatForDisplay(resolved));
        onBlur?.();
      }}
      {...props}
    />
  );
}
