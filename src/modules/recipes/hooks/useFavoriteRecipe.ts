"use client";

import { trpc } from "@/lib/trpc";

/**
 * Toggles the caller's personal favorite on a recipe.
 *
 * Favorites are personal, not household-wide, so this only ever changes what
 * *this* user sees — two members see different hearts filled on the same
 * recipe.
 *
 * Invalidates rather than patching the cache by hand: `isFavorited` is
 * server-derived on both `list` and `getById`, and re-reading it is what keeps
 * the two views from disagreeing.
 */
export function useFavoriteRecipe() {
  const utils = trpc.useUtils();

  const mutation = trpc.recipes.setFavorite.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.recipes.list.invalidate(), utils.recipes.getById.invalidate()]);
    },
  });

  return {
    setFavorite: (id: string, favorited: boolean) => mutation.mutate({ id, favorited }),
    /** The recipe currently being toggled, so a card can show its own pending state. */
    pendingRecipeId: mutation.isPending ? mutation.variables?.id : undefined,
    isError: mutation.isError,
  };
}
