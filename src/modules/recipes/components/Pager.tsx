/** Paging is offset-based and capped server-side, so the footer can state a real total rather than an endless scroll. */
export function Pager({
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
  return (
    <div className="flex items-center justify-between border-t border-line-soft px-[22px] py-3.5 font-mono text-[12.5px] text-ink-faint">
      <div className="tabular">
        Showing {rangeStart}–{rangeEnd} of {total}
      </div>
      <div className="flex gap-[7px]">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="rounded-md border border-line px-2.5 py-[3px] text-ink-soft disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="rounded-md border border-line px-2.5 py-[3px] text-ink-soft disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
