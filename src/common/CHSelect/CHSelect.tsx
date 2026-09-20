"use client";

import { useId } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "@/lib/cn";
import styles from "./CHSelect.module.css";

function SelectChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? <polyline points="5 12 10 7 15 12" /> : <polyline points="5 8 10 13 15 8" />}
    </svg>
  );
}

type CHSelectProps<T> = {
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  getOptionId: (item: T) => string;
  getOptionLabel: (item: T) => string;
  /** Greys an option out and blocks picking it — still shown, not filtered out (e.g. an ingredient that's already a staple). */
  getOptionDisabled?: (item: T) => boolean;
  /** The underlying `ComboboxInput`'s own change event, forwarded unmodified — searching, debouncing, and everything else typed text might mean belongs to the caller, not here. */
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Accessible name for the many callers with no visible `label`. Ignored once `label` is given — that becomes the accessible name instead. */
  ariaLabel?: string;
  invalid?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
};

/**
 * Searchable select built on Headless UI's `Combobox`, generic over any item
 * type `T` via `getOptionId`/`getOptionLabel`. Grows its own optional
 * label/hint/error chrome, same as `CHTextInput`.
 *
 * A pure UI primitive: it renders the combobox, its options, and the
 * selected value — nothing else. It has no idea what typed text means
 * (search, create, anything), and offers no clear button of its own;
 * composing those behaviors (and, where needed, a caller's own clear
 * control) is entirely up to whoever uses it. See `useCreatableSelect` for
 * the shared searchable-and-creatable composition most pickers want.
 */
export function CHSelect<T>({
  value,
  onChange,
  options,
  getOptionId,
  getOptionLabel,
  getOptionDisabled,
  onInputChange,
  placeholder,
  ariaLabel,
  invalid,
  label,
  hint,
  error,
  className,
}: CHSelectProps<T>) {
  const id = useId();
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

      <Combobox as="div" className="relative" immediate value={value} onChange={onChange}>
        <ComboboxInput
          id={label ? id : undefined}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={isInvalid || undefined}
          autoComplete="off"
          placeholder={placeholder}
          displayValue={(item: T | null) => (item ? getOptionLabel(item) : "")}
          onChange={onInputChange}
          className={cn(
            styles.input,
            "pr-8",
            isInvalid ? "border-danger focus:outline-danger" : "border-line",
            !label && className
          )}
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* A click target separate from typing — opens the panel without a keystroke. */}
          <ComboboxButton className={styles.button}>
            {({ open }) => <SelectChevron open={open} />}
          </ComboboxButton>
        </div>

        {options.length > 0 && (
          <ComboboxOptions anchor={false} className={styles.panel}>
            {options.map((option) => {
              const disabled = getOptionDisabled?.(option) ?? false;
              return (
                <ComboboxOption
                  key={getOptionId(option)}
                  value={option}
                  disabled={disabled}
                  className={({ focus }) =>
                    cn(
                      styles.option,
                      disabled
                        ? "cursor-not-allowed text-ink-faint"
                        : focus
                          ? styles.optionFocused
                          : "text-ink"
                    )
                  }
                >
                  {getOptionLabel(option)}
                </ComboboxOption>
              );
            })}
          </ComboboxOptions>
        )}
      </Combobox>

      {label && hint && !error && <p className="m-0 text-[11.5px] text-ink-faint">{hint}</p>}
      {label && error && (
        <p className="m-0 text-[11.5px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
