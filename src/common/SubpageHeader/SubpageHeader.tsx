import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A second bar under `AppNav`, not a replacement for it — hiding the nav for
 * a "focused task" framing was tried and dropped once, since it costs the
 * user their bearings on a screen that's still logically part of the one
 * they came from. Promoted once a third module (add-from-recipes, receipt
 * scan, staples) needed the identical back-link/title/right-side shape.
 */
export function SubpageHeader({
  backHref,
  backLabel = "Cancel",
  title,
  right,
}: {
  backHref: string;
  backLabel?: string;
  /** Omit where the page's own heading already shows the title right below (e.g. recipe detail). */
  title?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-[22px] py-3.5">
      <div className="flex flex-wrap items-center gap-3.5">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-[13.5px] text-ink-soft no-underline hover:text-ink"
        >
          <span aria-hidden className="text-ink-faint">
            ←
          </span>
          {backLabel}
        </Link>
        {title && <span className="font-display text-[17px] font-semibold text-ink">{title}</span>}
      </div>

      {right}
    </div>
  );
}
