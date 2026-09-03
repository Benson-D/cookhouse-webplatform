"use client";

import { trpc } from "@/lib/trpc";

/**
 * Merges the selected recipes' ingredients into the active list, server-side,
 * in one merge pass.
 *
 * Browsing recipes to pick from is the picker screen's own job, via the
 * recipes module's `useRecipeList` — this hook owns only the mutation that
 * commits a selection.
 */
export function useAddFromRecipes() {
  const utils = trpc.useUtils();

  const addFromRecipes = trpc.groceryLists.addFromRecipes.useMutation({
    onSuccess: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    addFromRecipes: (recipeIds: string[]) => addFromRecipes.mutateAsync({ recipeIds }),
    isAdding: addFromRecipes.isPending,
    error: addFromRecipes.error,
  };
}
