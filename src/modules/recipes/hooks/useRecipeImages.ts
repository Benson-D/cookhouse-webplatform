"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { RecipeImageWithUrl } from "../types";

/** A file the user picked before the recipe existed, shown from a local preview. */
export type PendingImage = {
  key: string;
  file: File;
  previewUrl: string;
};

/** Either an image the server knows about, or one still waiting to be uploaded. */
export type GalleryItem =
  | { kind: "attached"; key: string; url: string; caption: string | null }
  | { kind: "pending"; key: string; url: string };

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

/**
 * Recipe photos, in both the states the form can be in.
 *
 * Upload is three steps — `createImageUpload` mints a presigned PUT, the
 * browser sends the bytes **straight to the bucket**, then `attachImage`
 * records the key. All three need a `recipeId`, which doesn't exist while a
 * new recipe is being filled in.
 *
 * So with no id, picked files are held in memory with object-URL previews and
 * `flushTo` uploads them once the recipe has been created. With an id, uploads
 * happen immediately. The form submits once either way; this hook absorbs the
 * ordering.
 *
 * A file uploaded but never attached leaves an orphan object in the bucket —
 * the server never learns the PUT happened, so a lifecycle rule on the
 * `recipes/` prefix is the intended cleanup, not anything here.
 */
export function useRecipeImages(recipeId: string | null) {
  const utils = trpc.useUtils();
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Every object URL still alive is already sitting in `pending` — no second
  // array to keep in sync by hand. This ref just mirrors `pending`'s latest
  // value so the unmount effect can revoke whatever's left (never removed,
  // never flushed) without a stale closure.
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(
    () => () => {
      for (const item of pendingRef.current) URL.revokeObjectURL(item.previewUrl);
    },
    []
  );

  const query = trpc.recipes.images.useQuery(
    { id: recipeId ?? "" },
    { enabled: recipeId !== null }
  );

  const createUpload = trpc.recipes.createImageUpload.useMutation();
  const attach = trpc.recipes.attachImage.useMutation();
  const removeImage = trpc.recipes.removeImage.useMutation({
    onSuccess: () => {
      if (recipeId) utils.recipes.images.invalidate({ id: recipeId });
    },
  });

  async function uploadOne(targetRecipeId: string, file: File) {
    const { storageKey, uploadUrl } = await createUpload.mutateAsync({
      recipeId: targetRecipeId,
      contentType: file.type,
    });

    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    await attach.mutateAsync({ recipeId: targetRecipeId, storageKey });
  }

  async function add(file: File) {
    setUploadError(null);

    if (!recipeId) {
      // No recipe yet — buffer locally, nothing to upload against.
      const previewUrl = URL.createObjectURL(file);
      setPending((current) => [
        ...current,
        { key: `${file.name}-${Date.now()}`, file, previewUrl },
      ]);
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
  }

  function remove(key: string) {
    const buffered = pending.find((item) => item.key === key);
    if (buffered) {
      // Pending image — remove locally, and free its blob URL right away
      // rather than waiting for unmount to hold it longer than necessary.
      URL.revokeObjectURL(buffered.previewUrl);
      setPending((current) => current.filter((item) => item.key !== key));
      return;
    }

    // Attached image — the server needs to know.
    removeImage.mutate({ imageId: key });
  }

  /**
   * Uploads everything buffered against a recipe that now exists. Called by the
   * form right after `create` resolves.
   *
   * Sequential rather than parallel: each upload is two API calls plus a PUT,
   * and firing ten at once mostly buys a burst of presign requests.
   *
   * Revokes every preview only once the whole batch has succeeded, not one at
   * a time as each file finishes — revoking an earlier file's preview while a
   * later one in the same batch still fails would leave `pending` pointing at
   * a dead URL for a file that's still sitting there un-uploaded.
   */
  async function flushTo(newRecipeId: string) {
    if (pending.length === 0) return;

    setIsUploading(true);
    try {
      for (const item of pending) {
        await uploadOne(newRecipeId, item.file);
      }
      for (const item of pending) URL.revokeObjectURL(item.previewUrl);
      setPending([]);
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
  }

  const attached: GalleryItem[] = (query.data ?? []).map(
    (image: RecipeImageWithUrl) => ({
      kind: "attached",
      key: image.id,
      url: image.url,
      caption: image.caption,
    })
  );
  const buffered: GalleryItem[] = pending.map((item) => ({
    kind: "pending",
    key: item.key,
    url: item.previewUrl,
  }));

  return {
    items: [...attached, ...buffered],
    add,
    remove,
    flushTo,
    isUploading,
    uploadError,
  };
}
