"use client";

import { useState } from "react";
import { ExpandRow } from "@/components/common";
import { TrendChart } from "./TrendChart";
import { TopItemsDrilldown } from "./TopItemsDrilldown";
import { formatCurrency, formatMonthLong } from "../utils";
import type { TopItem, TrendMonth } from "../types";

/**
 * Chart, the exact-figures table, and the drill-down together — with
 * gridlines on the chart, an always-open table right beneath it started to
 * read as the same information twice, so it's folded behind the same
 * tap-to-expand row the receipt review's matched list uses.
 */
export function TrendSection({
  months,
  selectedMonth,
  onSelectMonth,
  topItems,
  isTopItemsLoading,
}: {
  months: TrendMonth[];
  selectedMonth: string | null;
  onSelectMonth: (monthKey: string) => void;
  topItems: TopItem[];
  isTopItemsLoading: boolean;
}) {
  const [tableExpanded, setTableExpanded] = useState(false);

  return (
    <div className="pb-5">
      <div className="mb-1 mt-[22px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
        Spend by month
      </div>
      <div className="mb-2 font-mono text-[11px] text-ink-faint">Tap a month for its top items</div>

      <TrendChart months={months} selectedMonth={selectedMonth} onSelectMonth={onSelectMonth} />

      <div className="mt-5 mb-5">
        {tableExpanded ? (
          <>
            <ExpandRow
              label={`Exact figures for all ${months.length} months`}
              actionLabel="collapse"
              onClick={() => setTableExpanded(false)}
            />
            <div className="mt-1">
              {months.map((month) => (
                <div
                  key={month.month}
                  className="flex items-baseline justify-between gap-3 border-b border-line-soft py-[7px] text-[13.5px] last:border-b-0"
                >
                  <span>{formatMonthLong(month.month)}</span>
                  <span className="tabular font-mono text-ink">{formatCurrency(month.total)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <ExpandRow
            label={`Exact figures for all ${months.length} months`}
            actionLabel="view all"
            onClick={() => setTableExpanded(true)}
          />
        )}
      </div>

      {selectedMonth && (
        <TopItemsDrilldown monthKey={selectedMonth} items={topItems} isLoading={isTopItemsLoading} />
      )}
    </div>
  );
}
