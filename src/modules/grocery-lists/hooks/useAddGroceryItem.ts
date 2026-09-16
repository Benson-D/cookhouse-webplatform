"use client";

import { trpc } from "@/lib/trpc";

/**
 * Adds one item to the active list, by typed name only.
 *
 * `addByName` sends the raw text straight to `addItem`, which does the
 * ingredient lookup server-side — matching an existing ingredient when one
 * exists, otherwise storing the text as-is rather than creating a new
 * ingredient. The quick-add row is deliberately name-only (see
 * design/kitchen-screens.html: "a quantity could be added later without
 * changing the row shape"), so there's no ingredient/unit picker UI here.
 */
export function useAddGroceryItem() {
  const utils = trpc.useUtils();
  const invalidate = () => utils.groceryLists.getActive.invalidate();

  const addItem = trpc.groceryLists.addItem.useMutation({ onSuccess: invalidate });

  return {
    addByName: (name: string) => addItem.mutateAsync({ name: name.trim() }),
    isAdding: addItem.isPending,
    error: addItem.error,
  };
}
