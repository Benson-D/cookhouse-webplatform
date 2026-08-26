"use client";

import { trpc } from "@/lib/trpc";

/**
 * Adds one item to the active list, by typed name only.
 *
 * `addByName` resolves the name to a canonical ingredient first — find-or-
 * create, checking aliases, the same `ingredients.create` the recipe form's
 * ingredient picker uses — then adds it with no quantity or unit. The
 * quick-add row is deliberately name-only (see design/kitchen-screens.html:
 * "a quantity could be added later without changing the row shape"), so
 * there's no ingredient/unit picker UI here, just one resolve-then-add call.
 */
export function useAddGroceryItem() {
  const utils = trpc.useUtils();
  const invalidate = () => utils.groceryLists.getActive.invalidate();

  const resolveIngredient = trpc.ingredients.create.useMutation();
  const addItem = trpc.groceryLists.addItem.useMutation({ onSuccess: invalidate });

  return {
    addByName: async (name: string) => {
      const ingredient = await resolveIngredient.mutateAsync({ name: name.trim() });
      return addItem.mutateAsync({ ingredientId: ingredient.id });
    },
    isAdding: resolveIngredient.isPending || addItem.isPending,
    error: resolveIngredient.error ?? addItem.error,
  };
}
