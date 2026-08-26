import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Styled text input, matching `CHTextArea`'s look but its own component since
 * the two share no markup. Promoted here alongside `CHTextArea` and `CHSelect`
 * once the recipe form had several genuinely generic field primitives worth a
 * common home rather than one.
 */
export function CHTextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "rounded-[7px] border border-line bg-surface-2 px-[11px] py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent",
        invalid && "border-[#B4442F]",
        className
      )}
    />
  );
}
