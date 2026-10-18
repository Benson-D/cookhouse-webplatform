import { formatCurrency } from "../utils";
import type { BreakdownRow } from "../types";

/** A drill-down list of names and dollar totals, shown under a chart once a bar is chosen. */
export function TopItemsList({
  title,
  items,
  emptyMessage,
  isLoading = false,
}: {
  title: string;
  items: BreakdownRow[];
  emptyMessage: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-accent py-px pl-4">
      <h4 className="m-0 text-[12.5px] font-bold text-ink">{title}</h4>

      {isLoading ? (
        <p className="m-0 text-[12.5px] text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <p className="m-0 text-[12.5px] text-ink-faint">{emptyMessage}</p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-baseline justify-between gap-3 border-b border-line-soft py-[6px] text-[13.5px] last:border-b-0"
            >
              <span>
                {item.name}
                {item.count !== undefined && (
                  <span className="ml-1.5 text-[12.5px] text-ink-faint">×{item.count}</span>
                )}
              </span>
              <span className="tabular flex-none font-mono text-ink">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
