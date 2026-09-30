"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import type { DateRange } from "../types";

/** Top 5 stores plus an "Other" row, optionally narrowed to one category. */
export function useSpendingByStore(range: DateRange, category: string | null) {
  const query = trpc.spending.byStore.useQuery(
    { from: range.from, to: range.to, category: category ?? undefined },
    { placeholderData: keepPreviousData }
  );

  return { stores: query.data?.stores ?? [], isLoading: query.isPending };
}
