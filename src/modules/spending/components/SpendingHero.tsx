import { formatCurrency, formatRangeLabel } from "../utils";

/**
 * The headline number. Sans, not the serif every other heading in this app
 * uses — a hero figure reads as data, not a section title, and the display
 * face here would read as decoration instead of the number that matters most.
 */
export function SpendingHero({
  total,
  purchaseCount,
  from,
  to,
}: {
  total: number;
  purchaseCount: number;
  from: Date;
  to: Date;
}) {
  return (
    <div className="px-[22px] pb-1 pt-2.5">
      <div className="text-[44px] font-bold leading-none tracking-[-0.01em] text-ink">
        {formatCurrency(total)}
      </div>
      <div className="tabular mt-[7px] font-mono text-xs text-ink-faint">
        {purchaseCount} purchase{purchaseCount === 1 ? "" : "s"} · {formatRangeLabel(from, to)}
      </div>
    </div>
  );
}
