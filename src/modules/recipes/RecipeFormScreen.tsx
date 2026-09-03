"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorState, LoadingState } from "@/common";
import { useRecipe } from "./hooks/useRecipe";
import { useSaveRecipe } from "./hooks/useSaveRecipe";
import { useIngredientSearchPicker, useUnits } from "@/hooks/useIngredientSearchPicker";
import { useRecipeImages } from "./hooks/useRecipeImages";
import { useTags } from "./hooks/useTags";
import { RecipeFormHeader } from "./components/RecipeFormHeader";
import { RecipeFormBody } from "./components/RecipeFormBody";
import { RecipeFormFooter } from "./components/RecipeFormFooter";
import {
  emptyRecipeForm,
  fromRecipeDetail,
  recipeFormSchema,
  type RecipeFormInput,
  type RecipeFormValues,
} from "./recipe-form.schema";

/**
 * Logical component for both `/recipes/new` and `/recipes/[id]/edit` —
 * composes the hooks with `RecipeFormHeader` / `RecipeFormBody` /
 * `RecipeFormFooter`. One submit, not two steps: see CLAUDE.md's "Recipe
 * create flow" for why the create→upload ordering is absorbed here.
 */
export function RecipeFormScreen({ recipeId }: { recipeId?: string }) {
  const router = useRouter();
  const id = recipeId ?? null;
  const isEditing = id !== null;

  const { recipe, parsedInstructions, isLoading, isError, error, refetch } = useRecipe(id);
  const { create, update, isSaving, saveError } = useSaveRecipe();
  const { tags } = useTags();
  const { units } = useUnits();
  const picker = useIngredientSearchPicker();
  const images = useRecipeImages(id);

  // Three type params: fields hold strings (RecipeFormInput), the submit
  // handler receives them parsed (RecipeFormValues). Collapsing the two is
  // what makes zodResolver fail to typecheck against useForm.
  const form = useForm<RecipeFormInput, unknown, RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: emptyRecipeForm,
    // An existing recipe arrives asynchronously, so `values` re-seeds the form
    // when it lands rather than being captured once at mount.
    values: recipe ? fromRecipeDetail(recipe, parsedInstructions) : undefined,
  });

  // `useWatch`, not `form.watch()` — watch() returns a fresh function each
  // render, which makes the React Compiler skip the whole component.
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
          ingredientOptions={picker.options}
          onSearchIngredients={picker.setSearch}
          onResolveIngredient={picker.resolve}
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
