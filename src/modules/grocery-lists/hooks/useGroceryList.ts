"use client";

import { trpc } from "@/lib/trpc";

// Polling (4s) is temporarily disabled — cost/load concern on the $5/mo
// DigitalOcean plan while this is still a single-household app with no real
// urgency for sub-5s sync. Revisit with a real solution (longer interval,
// pause when the tab isn't focused, or a push-based approach) rather than
// just re-enabling this blindly.

/**
 * The household's active grocery list.
 *
 * `getActive` create-or-finds the list and folds in any staples now due —
 * opening the list is the only moment that result needs to be visible, so
 * there's no separate "check staples" call.
 */
export function useGroceryList() {
  const query = trpc.groceryLists.getActive.useQuery(undefined);

  return {
    list: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
