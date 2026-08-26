import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Styled textarea, matching `CHTextInput`'s look but its own component since
 * the two share no markup. Promoted here alongside `CHTextInput` and
 * `CHSelect` once the recipe form had several genuinely generic field
 * primitives worth a common home rather than one.
 */
export function CHTextArea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent resize-y",
        invalid && "border-[#B4442F]",
        className
      )}
    />
  );
}
