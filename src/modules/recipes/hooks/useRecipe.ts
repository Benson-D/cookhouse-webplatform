"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/lib/trpc";
import type { RecipeDetail, RecipeImageWithUrl } from "../types";
import { parseSteps } from "../utils";

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
 */
export function useRecipe(recipeId: string | null) {
  const { user } = useUser();

  // `recipeId` is null while a brand-new recipe is being filled in — there is
  // nothing to fetch yet, so the query is disabled rather than sent with a
  // placeholder id.
  const recipeQuery = trpc.recipes.getById.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null }
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

  // Edit/delete are author-or-admin server-side; showing the control to
  // everyone would just surface a FORBIDDEN on click. Admins aren't detectable
  // from the client, so an admin who isn't the author simply won't see Edit
  // here even though the API would allow it.
  const canEdit = Boolean(user && recipe && recipe.createdBy === user.id);

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
