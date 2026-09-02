import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase eyebrow heading above a section — "Ingredients", "By category", etc. */
export function CHSectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-[9px] mt-[18px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint",
        className
      )}
    >
      {children}
    </div>
  );
}
