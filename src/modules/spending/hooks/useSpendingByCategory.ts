"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import type { DateRange, SpendBarRow } from "../types";

export function useSpendingByCategory(range: DateRange) {
  const query = trpc.spending.byCategory.useQuery(
    { from: range.from, to: range.to },
    { placeholderData: keepPreviousData }
  );

  const rows: SpendBarRow[] =
    query.data?.categories.map(({ category, total }) => ({ label: category, total })) ?? [];

  return { rows, isLoading: query.isPending };
}
