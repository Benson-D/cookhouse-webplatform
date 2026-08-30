"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/lib/trpc";
import type { RecipeDetail, RecipeImageWithUrl } from "../types";
import { parseSteps } from "../utils";

// ~10-15s, per root CLAUDE.md's "Real-time layer" decision — recipe detail is
// the more motivated of the two recipe screens specifically because any
// household member can now delete a recipe, not just its author, so someone
// viewing one while another member deletes it benefits from that reaching
// their screen without a manual refresh.
const RECIPE_POLL_MS = 12_000;

/**
 * One recipe in full, plus its render-ready image URLs.
 *
 * Images are a second call because `RecipeImage.storageKey` is a bucket key,
 * not a URL — `recipes.images` mints presigned links per request. It's gated on
 * the recipe having loaded so a missing or other-household recipe produces one
 * NOT_FOUND rather than two.
 *
 * `instructions` is a `Json` column typed as unknown, so it's parsed here
 * (via the module's pure helper) rather than in the Screen.
 *
 * `poll` defaults off — this hook is also used by `RecipeFormScreen` (edit
 * mode), where `useForm`'s `values: fromRecipeDetail(recipe, steps)` re-seeds
 * the form whenever `recipe` changes identity. Polling there would risk
 * silently discarding an in-progress, unsaved edit the moment a background
 * refetch lands. Only `RecipeDetailScreen` passes `poll: true`.
 */
export function useRecipe(recipeId: string | null, { poll = false }: { poll?: boolean } = {}) {
  const { user } = useUser();

  // `recipeId` is null while a brand-new recipe is being filled in — there is
  // nothing to fetch yet, so the query is disabled rather than sent with a
  // placeholder id.
  const recipeQuery = trpc.recipes.getById.useQuery(
    { id: recipeId ?? "" },
    {
      enabled: recipeId !== null,
      ...(poll && { refetchInterval: RECIPE_POLL_MS }),
    }
  );
  const imagesQuery = trpc.recipes.images.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null && recipeQuery.isSuccess }
  );

  // Annotated rather than inferred: letting TypeScript widen the tRPC query
  // data through this hook's return object trips TS2589 ("excessively deep"),
  // and the alias in types.ts is the same type by construction.
  const recipe: RecipeDetail | undefined = recipeQuery.data;

  const steps = useMemo(
    () => parseSteps(recipe?.instructions),
    [recipe?.instructions]
  );

  // Any household member may edit or delete a recipe server-side now, same as
  // grocery lists — so this only needs a recipe to have loaded, not an
  // authorship check. Being able to reach this screen at all already implies
  // household membership (the route is behind HouseholdGate).
  const canEdit = Boolean(user && recipe);

  const images: RecipeImageWithUrl[] = imagesQuery.data ?? [];

  return {
    recipe,
    steps,
    images,

    // A disabled query stays `isPending` forever, so gate on having an id.
    isLoading: recipeId !== null && recipeQuery.isPending,
    isError: recipeQuery.isError,
    error: recipeQuery.error,
    refetch: () => void recipeQuery.refetch(),

    canEdit,
  };
}
