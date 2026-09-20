"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorState, LoadingState } from "@/common";
import { useRecipe } from "./hooks/useRecipe";
import { useSaveRecipe } from "./hooks/useSaveRecipe";
import { useUnits } from "@/hooks/useIngredientSearchPicker";
import { useRecipeImages } from "./hooks/useRecipeImages";
import { usePendingImages } from "./hooks/usePendingImages";
import { useUploadRecipeImage } from "./hooks/useUploadRecipeImage";
import { useTags } from "./hooks/useTags";
import { RecipeFormHeader } from "./components/RecipeForm/RecipeFormHeader";
import { RecipeFormBody } from "./components/RecipeForm/RecipeFormBody";
import { RecipeFormFooter } from "./components/RecipeForm/RecipeFormFooter";
import {
  emptyRecipeForm,
  fromRecipeDetail,
  recipeFormSchema,
  type RecipeFormInput,
  type RecipeFormValues,
} from "./recipe-form.schema";

/**
 * Recipe create/edit form.
 *
 * Handles recipe fields, images, ingredients, instructions, and tags.
 * A new recipe is created before pending images are uploaded because image
 * uploads require the recipe id returned by the create operation.
 */
export function RecipeFormScreen({ recipeId }: { recipeId?: string }) {
  const router = useRouter();
  const id = recipeId ?? null;
  const isEditing = id !== null;

  const { recipe, parsedInstructions, isLoading, isError, error, refetch } = useRecipe(id);
  const { create, update, isSaving, saveError } = useSaveRecipe();
  const { tags } = useTags();
  const { units } = useUnits();
  const pendingImages = usePendingImages();
  const { uploadOne } = useUploadRecipeImage();
  const images = useRecipeImages(id, pendingImages, uploadOne);

  // fromRecipeDetail returns a fresh object each call, so memoize it — a
  // "new" values object on every render re-seeds the form each time.
  const values = useMemo(
    () => (recipe ? fromRecipeDetail(recipe, parsedInstructions) : undefined),
    [recipe, parsedInstructions]
  );

  // Recipe data loads asynchronously, so `values` re-seeds the form when it
  // becomes available. Input and parsed submit types differ because of Zod.
  const form = useForm<RecipeFormInput, unknown, RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: emptyRecipeForm,
    values,
  });

  // `useWatch`, not `form.watch()` — watch() re-renders the whole form on
  // any field change; useWatch re-renders only for this one.
  const selectedTagIds = useWatch({ control: form.control, name: "tagIds" });

  if (isLoading) {
    return <LoadingState label="Loading recipe…" rows={6} />;
  }

  if (isEditing && (isError || !recipe)) {
    const notFound = error?.data?.code === "NOT_FOUND";
    return (
      <ErrorState
        title={notFound ? "Recipe not found" : "Couldn't load this recipe"}
        message={
          notFound
            ? "It may have been deleted, or it belongs to a different household."
            : error?.message
        }
        onRetry={notFound ? undefined : () => void refetch()}
      />
    );
  }

  const onToggleTag = (tagId: string) => {
    form.setValue(
      "tagIds",
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((tag) => tag !== tagId)
        : [...selectedTagIds, tagId]
    );
  };

  const onSubmit = async (values: RecipeFormValues) => {
    if (id) {
      await update(id, values);
      router.push(`/recipes/${id}`);
      return;
    }

    const newId = await create(values);
    try {
      await images.flushTo(newId);
    } catch {
      // The recipe saved; only a photo failed. Stay put so the error the hook
      // set stays visible and the remaining files aren't silently dropped.
      return;
    }
    router.push(`/recipes/${newId}`);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[26px] px-[22px] pb-6 pt-5"
      >
        <RecipeFormHeader isEditing={isEditing} />

        <RecipeFormBody
          isEditing={isEditing}
          units={units}
          tags={tags}
          selectedTagIds={selectedTagIds}
          onToggleTag={onToggleTag}
          imageItems={images.items}
          isUploadingImages={images.isUploading}
          uploadError={images.uploadError}
          onAddImage={images.add}
          onRemoveImage={images.remove}
        />

        <RecipeFormFooter
          isSaving={isSaving || images.isUploading}
          saveError={saveError}
          onCancel={() => router.push(isEditing ? `/recipes/${id}` : "/recipes")}
        />
      </form>
    </FormProvider>
  );
}
