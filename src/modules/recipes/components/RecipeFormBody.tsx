"use client";

import { useFormContext } from "react-hook-form";
import { CHNumInput, CHTextArea, CHTextInput } from "@/components/common";
import type { GalleryItem } from "../hooks/useRecipeImages";
import type { RecipeFormInput, RecipeFormValues } from "../recipe-form.schema";
import type { Tag } from "../types";
import { Field } from "./FormControls";
import { ImageUploader } from "./ImageUploader";
import { IngredientRows } from "./IngredientRows";
import { StepRows } from "./StepRows";
import { TagPicker } from "./TagPicker";

type Ingredient = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string | null };

/**
 * Everything between the name field and the save/cancel actions.
 *
 * Pulls `register`/`control`/`formState` from context rather than taking them
 * as props — same as `IngredientRows`/`StepRows`, which this composes — since
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
  const { register, control, formState } =
    useFormContext<RecipeFormInput, unknown, RecipeFormValues>();

  return (
    <div className="flex flex-col gap-[18px]">
      <Field label="Description" htmlFor="recipe-description">
        <CHTextArea
          id="recipe-description"
          rows={2}
          placeholder="One pot, pantry staples, done inside 35 minutes."
          {...register("description")}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label="Servings"
          htmlFor="recipe-servings"
          error={formState.errors.servings?.message}
        >
          <CHTextInput
            id="recipe-servings"
            inputMode="numeric"
            {...register("servings")}
            invalid={Boolean(formState.errors.servings)}
          />
        </Field>
        <Field
          label="Prep (min)"
          htmlFor="recipe-prep"
          error={formState.errors.prepTime?.message}
        >
          <CHNumInput
            id="recipe-prep"
            {...register("prepTime")}
            invalid={Boolean(formState.errors.prepTime)}
          />
        </Field>
        <Field
          label="Cook (min)"
          htmlFor="recipe-cook"
          error={formState.errors.cookingTime?.message}
        >
          <CHNumInput
            id="recipe-cook"
            {...register("cookingTime")}
            invalid={Boolean(formState.errors.cookingTime)}
          />
        </Field>
      </div>

      <Field
        label="Photos"
        hint={
          isEditing
            ? "The first photo is the cover."
            : "The first photo is the cover. These upload when you save."
        }
      >
        <ImageUploader
          items={imageItems}
          isUploading={isUploadingImages}
          uploadError={uploadError}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
        />
      </Field>

      <Field label="Ingredients">
        <IngredientRows
          control={control}
          ingredientOptions={ingredientOptions}
          units={units}
          onSearchIngredients={onSearchIngredients}
          onResolveIngredient={onResolveIngredient}
        />
      </Field>

      <Field label="Method">
        <StepRows control={control} />
      </Field>

      <Field label="Tags">
        <TagPicker
          tags={tags}
          selectedTagIds={selectedTagIds}
          onToggle={onToggleTag}
        />
      </Field>
    </div>
  );
}
