import type { ReactNode } from "react";

/** Uppercase micro-label above the control. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label
        htmlFor={htmlFor}
        className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="m-0 text-[11.5px] text-ink-faint">{hint}</p>}
      {error && (
        <p className="m-0 text-[11.5px] text-[#B4442F]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** A quiet accent-coloured "add another" action. */
export function AddLineButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
    >
      + {children}
    </button>
  );
}

/** Removes a repeater row. */
export function RemoveRowButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-md border border-transparent text-center text-[15px] text-ink-faint hover:text-ink"
    >
      ×
    </button>
  );
}
