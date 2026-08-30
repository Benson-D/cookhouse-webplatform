"use client";

import { trpc } from "@/lib/trpc";

// 3-5s, per root CLAUDE.md's "Real-time layer" decision — a shared shopping
// trip is the case that actually needs another member's edit to show up
// without a manual refresh, so this polls faster than anything else in the
// app (recipes' ~10-15s, see useRecipeList/useRecipe).
const GROCERY_LIST_POLL_MS = 4_000;

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

  const query = trpc.groceryLists.getActive.useQuery(undefined, {
    refetchInterval: GROCERY_LIST_POLL_MS,
  });
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

    setChecked: (itemId: string, checked: boolean) =>
      setChecked.mutate({ itemId, checked }),

    removeItem: (itemId: string) => removeItem.mutate({ itemId }),

    /** Archives the list; the next `getActive` starts a fresh one. */
    complete: () => complete.mutateAsync(),
    isCompleting: complete.isPending,

    /** Deletes every item; the list itself stays active — distinct from `complete`. */
    removeAll: () => removeAll.mutate(),
    isRemovingAll: removeAll.isPending,
  };
}
