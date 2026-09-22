"use client";

import { trpc } from "@/lib/trpc";

/** Checks or unchecks one item on the active list. */
export function useCheckGroceryItem() {
  const utils = trpc.useUtils();

  const mutation = trpc.groceryLists.setChecked.useMutation({
    onSuccess: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    setChecked: (itemId: string, checked: boolean) => mutation.mutate({ itemId, checked }),
  };
}
