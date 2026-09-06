import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Styled text input that grows its own optional label/hint/error chrome —
 * matches `CHTextArea`'s look but its own component since the two share no
 * markup. Omit `label` for the many per-row/inline fields that only need an
 * `aria-label`.
 */
export function CHTextInput({
  label,
  hint,
  error,
  invalid,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
}) {
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
        {...props}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent",
          isInvalid && "border-danger",
          !label && className
        )}
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
