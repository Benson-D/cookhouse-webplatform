"use client";

import { trpc } from "@/lib/trpc";

/** Deletes a recipe and invalidates the list so it drops out immediately. */
export function useDeleteRecipe() {
  const utils = trpc.useUtils();

  const mutation = trpc.recipes.delete.useMutation({
    onSuccess: () => utils.recipes.list.invalidate(),
  });

  return {
    deleteRecipe: (id: string) => mutation.mutateAsync({ id }),
    isDeleting: mutation.isPending,
  };
}
