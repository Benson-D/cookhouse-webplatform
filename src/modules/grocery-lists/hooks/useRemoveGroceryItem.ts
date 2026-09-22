"use client";

import { trpc } from "@/lib/trpc";

/** Removes one item from the active list. */
export function useRemoveGroceryItem() {
  const utils = trpc.useUtils();

  const mutation = trpc.groceryLists.removeItem.useMutation({
    onSuccess: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    removeItem: (itemId: string) => mutation.mutate({ itemId }),
  };
}
