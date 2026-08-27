"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import type { DateRange, SpendBarRow } from "../types";

export function useSpendingByStore(range: DateRange) {
  const query = trpc.spending.byStore.useQuery(
    { from: range.from, to: range.to },
    { placeholderData: keepPreviousData }
  );

  const rows: SpendBarRow[] =
    query.data?.stores.map(({ store, total }) => ({ label: store, total })) ?? [];

  return { rows, isLoading: query.isPending };
}
