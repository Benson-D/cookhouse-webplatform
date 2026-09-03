"use client";

import { trpc } from "@/lib/trpc";
import { toCreateInput, toUpdateInput, type RecipeFormValues } from "../recipe-form.schema";

/**
 * The two writes behind the recipe form — one submit each, not one flow split
 * across two.
 *
 * `create` takes the whole form. Images are the awkward part: `attachImage`
 * needs a `recipeId` that doesn't exist until this resolves, so the form holds
 * picked files client-side and uploads them *after* `create` returns an id.
 * That write-ordering constraint is absorbed here rather than exposed to the
 * user as a "name it first" step.
 *
 * Both invalidate the list; `update` also invalidates the detail query so the
 * recipe page reflects the edit instead of serving a stale cache entry.
 */
export function useSaveRecipe() {
  const utils = trpc.useUtils();

  const create = trpc.recipes.create.useMutation({
    onSuccess: () => utils.recipes.list.invalidate(),
  });

  const update = trpc.recipes.update.useMutation({
    onSuccess: (recipe) =>
      Promise.all([
        utils.recipes.list.invalidate(),
        utils.recipes.getById.invalidate({ id: recipe.id }),
      ]),
  });

  return {
    /** Creates the recipe in full and returns its new id. */
    create: (values: RecipeFormValues) =>
      create.mutateAsync(toCreateInput(values)).then((recipe) => recipe.id),
    /** Updates an existing recipe in full. */
    update: (id: string, values: RecipeFormValues) => update.mutateAsync(toUpdateInput(id, values)),

    isSaving: create.isPending || update.isPending,
    saveError: create.error ?? update.error,
  };
}
