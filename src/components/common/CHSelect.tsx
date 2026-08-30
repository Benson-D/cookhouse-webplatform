"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "@/lib/cn";

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
      {open ? (
        <polyline points="5 12 10 7 15 12" />
      ) : (
        <polyline points="5 8 10 13 15 8" />
      )}
    </svg>
  );
}

/** What picking a row means: an existing item, or (if `onCreate` is given) a new one. */
type ChosenItem<T> =
  | { kind: "existing"; item: T }
  | { kind: "create"; name: string };

function normalize(value: string) {
  return value.trim().toLowerCase();
}

const inputClasses =
  "w-full rounded-[7px] border bg-surface-2 py-2 pl-[11px] pr-8 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent";
const buttonClasses = "absolute inset-y-0 right-0 flex items-center px-2 text-ink-faint";
const panelClasses =
  "absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-[7px] border border-line bg-surface py-1 shadow-frame empty:hidden";
const optionBaseClasses = "cursor-default px-[11px] py-1.5 text-[13.5px]";
const optionFocusClasses = "bg-accent-soft text-accent";

type CHSelectProps<T> = {
  value: T | null;
  options: T[];
  getOptionId: (item: T) => string;
  getOptionLabel: (item: T) => string;
  /** Greys an option out and blocks picking it — still shown, not filtered out (e.g. an ingredient that's already a staple). */
  getOptionDisabled?: (item: T) => boolean;
  onSearch?: (query: string) => void;
  onSelect: (item: T) => void;
  onCreate?: (name: string) => Promise<T>;
  placeholder?: string;
  label: string;
  invalid?: boolean;
};

/**
 * Searchable select built on Headless UI's `Combobox`, generic over any item
 * type `T` via `getOptionId`/`getOptionLabel`.
 *
 * Pass `onCreate` to let typing something with no match offer to create it
 * (e.g. ingredients); omit it for a closed, pick-only list (e.g. units).
 */
export function CHSelect<T>({
  value,
  options,
  getOptionId,
  getOptionLabel,
  getOptionDisabled,
  onSearch,
  onSelect,
  onCreate,
  placeholder,
  label,
  invalid,
}: CHSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const normalizedQuery = normalize(query);
  const exactMatch = options.some(
    (option) => normalize(getOptionLabel(option)) === normalizedQuery
  );
  const canCreate = Boolean(onCreate) && normalizedQuery.length > 0 && !exactMatch;

  const selected: ChosenItem<T> | null = value
    ? { kind: "existing", item: value }
    : null;

  async function handleChange(chosen: ChosenItem<T> | null) {
    if (!chosen) return;

    if (chosen.kind === "existing") {
      onSelect(chosen.item);
      return;
    }

    // Only reachable when `onCreate` was passed — that's what makes `canCreate`
    // true in the first place, but TypeScript can't see that from here.
    if (!onCreate) return;
    setIsCreating(true);
    try {
      onSelect(await onCreate(chosen.name));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Combobox as="div" className="relative" immediate value={selected} onChange={handleChange}>
      <ComboboxInput
        aria-label={label}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        placeholder={placeholder}
        displayValue={(chosen: ChosenItem<T> | null) =>
          chosen?.kind === "existing" ? getOptionLabel(chosen.item) : ""
        }
        onChange={(event) => {
          setQuery(event.target.value);
          onSearch?.(event.target.value);
        }}
        className={cn(inputClasses, invalid ? "border-danger" : "border-line")}
      />

      {/* A click target separate from typing — opens the panel without a keystroke. */}
      <ComboboxButton className={buttonClasses}>
        {({ open }) => <SelectChevron open={open} />}
      </ComboboxButton>

      {(options.length > 0 || canCreate) && (
        <ComboboxOptions anchor={false} className={panelClasses}>
          {options.map((option) => {
            const disabled = getOptionDisabled?.(option) ?? false;
            return (
              <ComboboxOption
                key={getOptionId(option)}
                value={{ kind: "existing", item: option } satisfies ChosenItem<T>}
                disabled={disabled}
                className={({ focus }) =>
                  cn(
                    optionBaseClasses,
                    disabled
                      ? "cursor-not-allowed text-ink-faint"
                      : focus
                        ? optionFocusClasses
                        : "text-ink"
                  )
                }
              >
                {getOptionLabel(option)}
              </ComboboxOption>
            );
          })}

          {canCreate && (
            <ComboboxOption
              // .trim(), not normalize() — preserves the user's capitalization.
              value={{ kind: "create", name: query.trim() } satisfies ChosenItem<T>}
              disabled={isCreating}
              className={({ focus }) =>
                cn(
                  optionBaseClasses,
                  "font-semibold",
                  focus ? optionFocusClasses : "text-accent"
                )
              }
            >
              {isCreating ? "Adding…" : `Add “${query.trim()}”`}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      )}
    </Combobox>
  );
}
