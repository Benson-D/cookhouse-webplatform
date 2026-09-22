"use client";

import { trpc } from "@/lib/trpc";

/**
 * Sets the household's own category for an ingredient or unrecognized item.
 *
 * Every other grocery-list mutation invalidates and refetches, per the
 * project's state convention, but a drag-and-drop that only settles once a
 * round-trip resolves reads as broken — so this one is the deliberate
 * exception: it writes its guess straight into the query cache in
 * `onMutate` and reconciles with the real data in `onSettled`. No rollback
 * on failure, since a miscategorized item is low-stakes and self-corrects
 * on the next successful fetch.
 */
export function useSetGroceryCategoryOverride() {
  const utils = trpc.useUtils();

  const mutation = trpc.groceryLists.setCategoryOverride.useMutation({
    onMutate: async (input) => {
      await utils.groceryLists.getActive.cancel();
      const key = input.ingredientId ?? input.label ?? null;

      utils.groceryLists.getActive.setData(undefined, (list) => {
        if (!list) return list;
        return {
          ...list,
          categoryOverrides: [
            ...list.categoryOverrides.filter(
              (override) => (override.ingredientId ?? override.label) !== key
            ),
            {
              id: `optimistic:${key}`,
              clerkOrgId: "",
              ingredientId: input.ingredientId ?? null,
              label: input.label ?? null,
              category: input.category,
            },
          ],
        };
      });
    },
    onSettled: () => utils.groceryLists.getActive.invalidate(),
  });

  return {
    setCategoryOverride: (
      item: { ingredientId: string | null; label: string | null },
      category: string
    ) =>
      mutation.mutate(
        item.ingredientId
          ? { ingredientId: item.ingredientId, category }
          : { label: item.label!, category }
      ),
  };
}
