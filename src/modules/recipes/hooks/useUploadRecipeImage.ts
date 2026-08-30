"use client";

import { trpc } from "@/lib/trpc";

/**
 * The three-step upload itself — presign, PUT straight to the bucket, then
 * attach — as one unit shared by both `useRecipeImages`'s immediate-upload
 * path and its `flushTo` batch path.
 */
export function useUploadRecipeImage() {
  const createUpload = trpc.recipes.createImageUpload.useMutation();
  const attach = trpc.recipes.attachImage.useMutation();

  const uploadOne = async (recipeId: string, file: File) => {
    const { storageKey, uploadUrl } = await createUpload.mutateAsync({
      recipeId,
      contentType: file.type,
      contentLength: file.size,
    });

    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    await attach.mutateAsync({ recipeId, storageKey });
  };

  return { uploadOne };
}
