import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Uppercase micro-label above a form control, with optional hint/error text below. */
export function CHFormField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-[5px]", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="m-0 text-[11.5px] text-ink-faint">{hint}</p>}
      {error && (
        <p className="m-0 text-[11.5px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
