import Link from "next/link";

/**
 * A second bar under `AppNav`, not a replacement for it — hiding the nav for
 * a "focused task" framing was tried and dropped, since it costs the user
 * their bearings on a screen that's still logically part of Grocery list.
 */
export function PickerBar({ selectedCount }: { selectedCount: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-[22px] py-3.5">
      <div className="flex flex-wrap items-center gap-3.5">
        <Link
          href="/grocery-list"
          className="flex items-center gap-1.5 text-[13.5px] text-ink-soft no-underline hover:text-ink"
        >
          <span aria-hidden className="text-ink-faint">
            ←
          </span>
          Cancel
        </Link>
        <span className="font-display text-[17px] font-semibold text-ink">
          Add from recipes
        </span>
      </div>

      <span className="tabular font-mono text-xs text-ink-faint">
        {selectedCount} selected
      </span>
    </div>
  );
}
