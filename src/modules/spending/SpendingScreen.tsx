"use client";

import { CHLink, CHSectionLabel, EmptyState, ErrorState } from "@/common";
import { useSpendingRange } from "./hooks/useSpendingRange";
import { useSpendingSummary } from "./hooks/useSpendingSummary";
import { useSpendingTrend } from "./hooks/useSpendingTrend";
import { useSpendingByCategory } from "./hooks/useSpendingByCategory";
import { useSpendingByStore } from "./hooks/useSpendingByStore";
import { SpendingHeader } from "./components/SpendingHeader";
import { DateRangeChips } from "./components/DateRangeChips";
import { SpendingHero } from "./components/SpendingHero";
import { SpendingLoadingState } from "./components/SpendingLoadingState";
import { TrendSection } from "./components/TrendSection";
import { SpendBarList } from "./components/SpendBarList";
import { formatRangeLabel } from "./utils";

/**
 * Maps directly to `cookhouse-api/src/modules/spending/`'s five read-only
 * queries: `summary` (the hero), `trend` (the chart + table), `topItems`
 * (the drill-down), and `byCategory` / `byStore` (the two bar-lists).
 * Changing the date-range preset re-runs all five against the same range.
 */
export function SpendingScreen() {
  const { preset, setPreset, range } = useSpendingRange();
  const { summary, isLoading, isError, error, refetch } = useSpendingSummary(range);
  const trend = useSpendingTrend(range);
  const byCategory = useSpendingByCategory(range);
  const byStore = useSpendingByStore(range);

  if (isLoading) {
    return <SpendingLoadingState />;
  }

  if (isError || !summary) {
    return (
      <ErrorState
        title="Couldn't load spending"
        message={error?.message}
        onRetry={() => void refetch()}
      />
    );
  }

  // Zero purchases in range means all five queries came back empty at once,
  // not one query failing — a `$0.00` hero next to a flat chart and two
  // blank bar-lists is four ways of saying nothing. The chips stay, since
  // they're the filter, not the report; everything below them swaps for one
  // `EmptyState` instead.
  if (summary.purchaseCount === 0) {
    return (
      <div className="flex flex-col">
        <SpendingHeader subtitle={`${formatRangeLabel(range.from, range.to)} · 0 purchases`} />
        <DateRangeChips preset={preset} onChange={setPreset} />
        <EmptyState
          title="No spending yet"
          message="Shows up here once you scan a receipt or log a purchase."
          action={
            <CHLink variant="primary" href="/receipts/new">
              Scan a receipt
            </CHLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SpendingHeader
        subtitle={`${formatRangeLabel(range.from, range.to)} · ${summary.purchaseCount} purchases`}
      />

      <DateRangeChips preset={preset} onChange={setPreset} />

      <SpendingHero
        total={summary.total}
        purchaseCount={summary.purchaseCount}
        from={range.from}
        to={range.to}
      />

      <div className="px-[22px]">
        <TrendSection
          months={trend.months}
          selectedMonth={trend.selectedMonth}
          onSelectMonth={trend.selectMonth}
          topItems={trend.topItems}
          isTopItemsLoading={trend.isTopItemsLoading}
        />
      </div>

      <CHSectionLabel className="mb-1 mt-1 px-[22px]">By category</CHSectionLabel>
      <SpendBarList
        rows={byCategory.rows}
        previewCount={5}
        moreLabel={(n) => `${n} more categor${n === 1 ? "y" : "ies"}`}
      />

      <CHSectionLabel className="mb-1 mt-1 px-[22px]">By store</CHSectionLabel>
      <SpendBarList
        rows={byStore.rows}
        previewCount={4}
        moreLabel={(n) => `${n} more store${n === 1 ? "" : "s"}`}
        paddingBottom={22}
      />
    </div>
  );
}
