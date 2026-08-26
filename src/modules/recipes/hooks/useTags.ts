"use client";

import { trpc } from "@/lib/trpc";

/**
 * The curated tag vocabulary, for filter chips and (later) the recipe form's
 * picker.
 *
 * Tags are admin-curated and can only be picked, never typed, so this closed
 * list is the only source — there is no create-on-demand path for a
 * non-admin. Failing to load leaves the chips absent rather than blocking the
 * list, which still works unfiltered.
 */
export function useTags() {
  const query = trpc.tags.list.useQuery(undefined, {
    // The vocabulary changes about never; don't refetch it per screen visit.
    staleTime: 5 * 60 * 1000,
  });

  return {
    tags: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
  };
}
