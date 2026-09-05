"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { buildGalleryItems } from "../utils/gallery";
import type { GalleryItem } from "../types";
import type { usePendingImages } from "./usePendingImages";

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

/**
 * Recipe photos, in both the states the form can be in.
 *
 * Uploading needs a `recipeId`, which doesn't exist while a new recipe is
 * being filled in. So with no id, picked files go to `buffered` (from
 * `usePendingImages`) and `flushTo` uploads them once the recipe has been
 * created. With an id, `uploadOne` (from `useUploadRecipeImage`) runs right
 * away. The form submits once either way; this hook decides which path a
 * given file takes. Both hooks are composed by the caller and passed in
 * rather than called here, so there's exactly one buffer/upload instance in
 * play, not a second one this hook could accidentally create on its own.
 *
 * A file uploaded but never attached leaves an orphan object in the bucket —
 * the server never learns the PUT happened, so a lifecycle rule on the
 * `recipes/` prefix is the intended cleanup, not anything here.
 */
export function useRecipeImages(
  recipeId: string | null,
  buffered: ReturnType<typeof usePendingImages>,
  uploadOne: (recipeId: string, file: File) => Promise<void>
) {
  const utils = trpc.useUtils();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const query = trpc.recipes.images.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null }
  );

  const removeImage = trpc.recipes.removeImage.useMutation({
    onSuccess: () => {
      if (recipeId) utils.recipes.images.invalidate({ id: recipeId });
    },
  });

  const add = async (file: File) => {
    setUploadError(null);

    if (!recipeId) {
      // No recipe yet — buffer locally, nothing to upload against.
      buffered.add(file);
      return;
    }

    // Recipe exists — upload now.
    setIsUploading(true);
    try {
      await uploadOne(recipeId, file);
      await utils.recipes.images.invalidate({ id: recipeId });
    } catch (error) {
      // Storage config is read lazily server-side, so an unconfigured bucket
      // surfaces here on first upload rather than at boot.
      setUploadError(errorMessage(error) ?? "Couldn't upload that image");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (key: string) => {
    const isBuffered = buffered.pending.some((item) => item.key === key);
    if (isBuffered) {
      buffered.remove(key);
      return;
    }

    // Attached image — the server needs to know.
    removeImage.mutate({ imageId: key });
  };

  /**
   * Uploads everything buffered, once the form's `create` call returns an id.
   * Sequential, not parallel, to avoid bursting the presign endpoint.
   * `buffered.clear()` only runs after the whole batch succeeds.
   */
  const flushTo = async (newRecipeId: string) => {
    if (buffered.pending.length === 0) return;

    setIsUploading(true);
    try {
      for (const item of buffered.pending) {
        await uploadOne(newRecipeId, item.file);
      }
      buffered.clear();
    } catch (error) {
      const detail = errorMessage(error);
      setUploadError(
        detail
          ? `Recipe saved, but an image didn't upload: ${detail}`
          : "Recipe saved, but an image didn't upload"
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const items: GalleryItem[] = buildGalleryItems(query.data ?? [], buffered.pending);

  return {
    items,
    add,
    remove,
    flushTo,
    isUploading,
    uploadError,
  };
}
