"use client";

import { InfoIcon } from "@/common";

/** Hover explainer for the Method field's section-heading feature — nothing else in the form hints it exists. */
export function MethodHint() {
  return (
    <span
      tabIndex={0}
      role="button"
      aria-label="What does a section heading do?"
      className="group relative mb-1 inline-flex text-ink-faint outline-none hover:text-ink focus:text-ink"
    >
      <InfoIcon width={15} height={15} />

      <span className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-20 w-[225px] rounded-lg border border-line bg-surface p-2.5 text-[12px] font-normal normal-case leading-[1.5] tracking-normal text-ink-soft opacity-0 shadow-frame transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        Give a step a heading to start a new named section — numbering starts over at 1 underneath
        it.
      </span>
    </span>
  );
}
