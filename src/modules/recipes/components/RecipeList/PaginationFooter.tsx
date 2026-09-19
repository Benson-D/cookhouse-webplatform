import { CHButton } from "@/common";

/** Paging is offset-based and capped server-side, so the footer can state a real total rather than an endless scroll. */
export function PaginationFooter({
  rangeStart,
  rangeEnd,
  total,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const pagerButtonClasses =
    "rounded-md px-2.5 py-[3px] text-[12.5px] font-normal text-ink-soft transition-colors active:scale-100 hover:border-ink-faint hover:text-ink disabled:opacity-40";

  return (
    <div className="flex items-center justify-between border-t border-line-soft px-[22px] py-3.5 font-mono text-[12.5px] text-ink-faint">
      <div className="tabular">
        Showing {rangeStart}–{rangeEnd} of {total}
      </div>
      <div className="flex gap-[7px]">
        <CHButton onClick={onPrevious} disabled={!hasPrevious} className={pagerButtonClasses}>
          ← Prev
        </CHButton>
        <CHButton onClick={onNext} disabled={!hasNext} className={pagerButtonClasses}>
          Next →
        </CHButton>
      </div>
    </div>
  );
}
