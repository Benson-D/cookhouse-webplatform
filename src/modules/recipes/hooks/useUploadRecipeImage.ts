"use client";

import { trpc } from "@/lib/trpc";

/**
 * Uploads one recipe photo: gets a presigned URL from the backend, PUTs the
 * file straight to the bucket, then tells the backend to attach it. Shared
 * by `useRecipeImages`'s immediate-upload path and its `flushTo` batch path,
 * so both go through the same three steps instead of duplicating them.
 */
export function useUploadRecipeImage() {
  const createUpload = trpc.recipes.createImageUpload.useMutation();
  const attach = trpc.recipes.attachImage.useMutation();

  /** Presigned URL → direct PUT to the bucket → attach, for one file. */
  const uploadOne = async (recipeId: string, file: File) => {
    const { storageKey, uploadUrl } = await createUpload.mutateAsync({
      recipeId,
      contentType: file.type,
      contentLength: file.size,
    });

    // The bucket's own response to the direct PUT — the backend never sees
    // this request, so this is the only place a failed upload can be caught.
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    // The upload succeeded, but the backend still has no idea — this is what
    // actually records the RecipeImage row for it.
    await attach.mutateAsync({ recipeId, storageKey });
  };

  return { uploadOne };
}
