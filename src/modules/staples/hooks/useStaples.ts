"use client";

import { trpc } from "@/lib/trpc";

/** Every staple for the household, plus create/remove — no optimistic updates, mutations invalidate and refetch (same pattern as `useGroceryList`). */
export function useStaples() {
  const utils = trpc.useUtils();
  const invalidate = () => utils.staples.list.invalidate();

  const query = trpc.staples.list.useQuery();
  const create = trpc.staples.create.useMutation({ onSuccess: invalidate });
  const remove = trpc.staples.delete.useMutation({ onSuccess: invalidate });

  return {
    staples: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),

    addStaple: (ingredientId: string, frequencyDays: number) =>
      create.mutateAsync({ ingredientId, frequencyDays }),
    isAdding: create.isPending,
    /** Surfaced only as a backstop for a race — the picker already greys out existing staples, which is the primary defense against CONFLICT. */
    addError: create.error,

    removeStaple: (id: string) => remove.mutate({ id }),
  };
}
