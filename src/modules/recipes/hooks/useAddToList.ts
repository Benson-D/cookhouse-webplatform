"use client";

import { useEffect, useRef, useState } from "react";
import { useAddFromRecipes } from "@/modules/grocery-lists/hooks/useAddFromRecipes";

/** How long the post-add "Added" confirmation shows before reverting — this app has no toast system. */
const ADDED_CONFIRMATION_MS = 2500;

/**
 * Adds one recipe's ingredients to the active grocery list, then shows a
 * brief "Added ✓" confirmation before reverting — owns the timer and its
 * cleanup so `RecipeDetailScreen` doesn't have to hold this state itself.
 */
export function useAddToList(recipeId: string) {
  const { addFromRecipes, isAdding, error } = useAddFromRecipes();
  const [justAdded, setJustAdded] = useState(false);
  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    },
    []
  );

  const handleAddToList = async () => {
    await addFromRecipes([recipeId]);
    setJustAdded(true);
    confirmationTimer.current = setTimeout(() => setJustAdded(false), ADDED_CONFIRMATION_MS);
  };

  return { handleAddToList, isAdding, justAdded, error };
}
