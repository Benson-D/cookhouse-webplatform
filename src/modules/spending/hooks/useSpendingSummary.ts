"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import type { DateRange } from "../types";

/**
 * Total spend and purchase count for the given range, via `spending.summary`.
 * `purchaseCount === 0` is what `SpendingScreen` checks to swap in the empty
 * state.
 */
export function useSpendingSummary(range: DateRange) {
  const query = trpc.spending.summary.useQuery(
    { from: range.from, to: range.to },
    { placeholderData: keepPreviousData }
  );

  return {
    summary: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
