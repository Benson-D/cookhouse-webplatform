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
 *
 * No optimistic updates: mutations invalidate and refetch, per the project's
 * state convention — a hand-rolled local copy of the list is exactly the
 * "local copies" that convention steers away from.
 */
export function useGroceryList() {
  const utils = trpc.useUtils();
  const invalidate = () => utils.groceryLists.getActive.invalidate();

  const query = trpc.groceryLists.getActive.useQuery(undefined);
  const setChecked = trpc.groceryLists.setChecked.useMutation({ onSuccess: invalidate });
  const removeItem = trpc.groceryLists.removeItem.useMutation({ onSuccess: invalidate });
  const complete = trpc.groceryLists.complete.useMutation({ onSuccess: invalidate });
  const removeAll = trpc.groceryLists.removeAll.useMutation({ onSuccess: invalidate });

  return {
    list: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),

    setChecked: (itemId: string, checked: boolean) => setChecked.mutate({ itemId, checked }),

    removeItem: (itemId: string) => removeItem.mutate({ itemId }),

    /** Archives the list; the next `getActive` starts a fresh one. */
    complete: () => complete.mutateAsync(),
    isCompleting: complete.isPending,

    /** Deletes every item; the list itself stays active — distinct from `complete`. */
    removeAll: () => removeAll.mutate(),
    isRemovingAll: removeAll.isPending,
  };
}
