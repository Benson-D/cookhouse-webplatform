"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import type { RecipeImageWithUrl } from "../types";
import { parseInstructions } from "../utils/instructions";

/**
 * One recipe in full, plus its render-ready image URLs — fetched separately,
 * since each image needs its own presigned URL.
 */
export function useRecipe(recipeId: string | null) {
  // recipeId can be null (creating a new recipe) - nothing to fetch yet
  const recipeQuery = trpc.recipes.getById.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null }
  );
  const imagesQuery = trpc.recipes.images.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null && recipeQuery.isSuccess }
  );

  const recipe = recipeQuery.data;
  const images: RecipeImageWithUrl[] = imagesQuery.data ?? [];

  // `instructions` is a `Json` column typed `unknown` at the wire boundary,
  // so it needs parsing before use rather than being trusted as-is.
  const parsedInstructions = useMemo(
    () => parseInstructions(recipe?.instructions),
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
