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
 * Manages a recipe's photos: uploads a picked file right away once a
 * `recipeId` exists, or buffers it (via `usePendingImages`) until one does.
 * `flushTo` uploads whatever's buffered once the recipe is created.
 *
 * `buffered`/`uploadOne` are composed by the caller, not created here, so
 * there's only ever one buffer/upload instance in play. A file uploaded but
 * never attached leaves an orphan object in the bucket — a lifecycle rule on
 * the `recipes/` prefix is the intended cleanup.
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
