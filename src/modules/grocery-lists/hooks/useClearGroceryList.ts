"use client";

import { trpc } from "@/lib/trpc";

/** Deletes every item on the active list; the list itself stays active — distinct from `useCompleteGroceryList`. */
export function useClearGroceryList() {
  const utils = trpc.useUtils();

  const mutation = trpc.groceryLists.removeAll.useMutation({
    onSuccess: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    removeAll: () => mutation.mutate(),
    isRemovingAll: mutation.isPending,
  };
}
