"use client";

import { trpc } from "@/lib/trpc";

/** Archives the active list; the next `getActive` starts a fresh one. */
export function useCompleteGroceryList() {
  const utils = trpc.useUtils();

  const mutation = trpc.groceryLists.complete.useMutation({
    onSuccess: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    complete: () => mutation.mutateAsync(),
    isCompleting: mutation.isPending,
  };
}
