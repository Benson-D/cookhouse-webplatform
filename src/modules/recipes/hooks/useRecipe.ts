"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import type { RecipeDetail, RecipeImageWithUrl } from "../types";
import { parseSteps } from "../utils";

// 12s poll, per root CLAUDE.md's "Real-time layer" decision.
const RECIPE_POLL_MS = 12_000;

/**
 * One recipe in full, plus its render-ready image URLs — fetched separately,
 * since each image needs its own presigned URL.
 *
 * `poll` defaults off — `RecipeFormScreen`'s edit mode also uses this hook,
 * and polling there could reset an in-progress edit when the form re-seeds
 * from a changed `recipe`. Only `RecipeDetailScreen` passes `poll: true`.
 */
export function useRecipe(recipeId: string | null, { poll = false }: { poll?: boolean } = {}) {
  // Null recipeId means a new recipe — nothing to fetch, so disable the query
  // instead of sending a placeholder id.
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

  // Annotated to dodge TS2589 ("excessively deep") — same type either way.
  const recipe: RecipeDetail | undefined = recipeQuery.data;

  const images: RecipeImageWithUrl[] = imagesQuery.data ?? [];

  // `instructions` is a `Json` column typed `unknown` at the wire boundary,
  // so it needs parsing before use rather than being trusted as-is.
  const parsedInstructions = useMemo(
    () => parseSteps(recipe?.instructions),
    [recipe?.instructions]
  );

  return {
    recipe,
    parsedInstructions,
    images,

    // A disabled query stays `isPending` forever, so gate on having an id.
    isLoading: recipeId !== null && recipeQuery.isPending,
    isError: recipeQuery.isError,
    error: recipeQuery.error,
    refetch: () => void recipeQuery.refetch(),
  };
}
