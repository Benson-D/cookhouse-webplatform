import { formatCurrency, formatMonthLong } from "../utils";
import type { TopItem } from "../types";

export function TopItemsDrilldown({
  monthKey,
  items,
  isLoading,
}: {
  monthKey: string;
  items: TopItem[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-accent py-px pl-4">
      <h4 className="m-0 text-[12.5px] font-bold text-ink">
        Top items — {formatMonthLong(monthKey)}
      </h4>

      {isLoading ? (
        <p className="m-0 text-[12.5px] text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <p className="m-0 text-[12.5px] text-ink-faint">No purchases this month.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.ingredientId}
              className="flex items-baseline justify-between gap-3 border-b border-line-soft py-[6px] text-[13.5px] last:border-b-0"
            >
              <span>
                {item.name}
                <span className="ml-1.5 text-[12.5px] text-ink-faint">×{item.purchaseCount}</span>
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
