"use client";

import { useFormContext } from "react-hook-form";
import { CHNumInput, CHTextArea, CHTextInput } from "@/common";
import type { GalleryItem } from "../types";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import type { Tag } from "../types";
import { ImageUploader } from "./ImageUploader";
import { IngredientRows } from "./IngredientRows";
import { InstructionsRows } from "./InstructionsRows";
import { TagPicker } from "./TagPicker";

type Ingredient = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string | null };

/**
 * Everything between the name field and the save/cancel actions.
 *
 * Pulls `register`/`control`/`formState` from context rather than taking them
 * as props — same as `IngredientRows`/`InstructionsRows`, which this composes — since
 * this only ever renders inside the form's own `FormProvider`.
 */
export function RecipeFormBody({
  isEditing,
  units,
  ingredientOptions,
  onSearchIngredients,
  onResolveIngredient,
  tags,
  selectedTagIds,
  onToggleTag,
  imageItems,
  isUploadingImages,
  uploadError,
  onAddImage,
  onRemoveImage,
}: {
  isEditing: boolean;
  units: Unit[];
  ingredientOptions: Ingredient[];
  onSearchIngredients: (query: string) => void;
  onResolveIngredient: (name: string) => Promise<Ingredient>;
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  imageItems: GalleryItem[];
  isUploadingImages: boolean;
  uploadError: string | null;
  onAddImage: (file: File) => void;
  onRemoveImage: (key: string) => void;
}) {
  const { register, control, formState } = useFormContext<
    RecipeFormInput,
    unknown,
    RecipeFormValues
  >();

  return (
    <div className="flex flex-col gap-[18px]">
      <CHTextArea
        label="Description"
        id="recipe-description"
        rows={2}
        placeholder="One pot, pantry staples, done inside 35 minutes."
        {...register("description")}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <CHTextInput
          label="Servings"
          id="recipe-servings"
          inputMode="numeric"
          {...register("servings")}
          error={formState.errors.servings?.message}
        />
        <CHNumInput
          label="Prep (min)"
          id="recipe-prep"
          {...register("prepTime")}
          error={formState.errors.prepTime?.message}
        />
        <CHNumInput
          label="Cook (min)"
          id="recipe-cook"
          {...register("cookingTime")}
          error={formState.errors.cookingTime?.message}
        />
      </div>

      <ImageUploader
        label="Photos"
        hint={
          isEditing
            ? "The first photo is the cover."
            : "The first photo is the cover. These upload when you save."
        }
        items={imageItems}
        isUploading={isUploadingImages}
        uploadError={uploadError}
        onAdd={onAddImage}
        onRemove={onRemoveImage}
      />

      <IngredientRows
        label="Ingredients"
        control={control}
        ingredientOptions={ingredientOptions}
        units={units}
        onSearchIngredients={onSearchIngredients}
        onResolveIngredient={onResolveIngredient}
      />

      <InstructionsRows label="Method" control={control} />

      <TagPicker label="Tags" tags={tags} selectedTagIds={selectedTagIds} onToggle={onToggleTag} />
    </div>
  );
}
