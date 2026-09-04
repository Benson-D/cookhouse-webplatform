"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { monthKeyToRange } from "../utils";
import type { DateRange } from "../types";

/**
 * `trend` plus its drill-down (`topItems`), which is deliberately its own
 * on-demand query — see `spending.service.ts` — fired only once a month is
 * tapped, not baked into `trend`'s response.
 *
 * No explicit "default selected month": the effective selection falls back
 * to the most recent loaded month whenever `selectedMonth` is still `null`,
 * computed at render rather than seeded via an effect.
 */
export function useSpendingTrend(range: DateRange) {
  const trendQuery = trpc.spending.trend.useQuery(
    { from: range.from, to: range.to },
    { placeholderData: keepPreviousData }
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const months = trendQuery.data?.months ?? [];
  const effectiveMonth = selectedMonth ?? months.at(-1)?.month ?? null;
  const monthRange = effectiveMonth ? monthKeyToRange(effectiveMonth) : null;

  // Falls back to the overall range when disabled — never sent, since the
  // query only fires once monthRange is set, but trpc still needs a valid shape.
  const topItemsQuery = trpc.spending.topItems.useQuery(
    { from: monthRange?.from ?? range.from, to: monthRange?.to ?? range.to },
    { enabled: monthRange !== null, placeholderData: keepPreviousData }
  );

  const selectMonth = (monthKey: string) => {
    setSelectedMonth((current) => (current === monthKey ? null : monthKey));
  };

  return {
    months,
    isTrendLoading: trendQuery.isPending,
    selectedMonth: effectiveMonth,
    selectMonth,
    topItems: topItemsQuery.data?.items ?? [],
    isTopItemsLoading: topItemsQuery.isPending,
  };
}
