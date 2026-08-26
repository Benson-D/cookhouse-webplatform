"use client";

import { trpc } from "@/lib/trpc";
import type { DateRange } from "../types";

export function useSpendingSummary(range: DateRange) {
  const query = trpc.spending.summary.useQuery({ from: range.from, to: range.to });

  return {
    summary: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
