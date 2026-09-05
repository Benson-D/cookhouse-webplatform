import type { GalleryItem, PendingImage, RecipeImageWithUrl } from "../types";

/** Merges server-known images with whatever's still buffered locally, in gallery order. */
export function buildGalleryItems(
  attachedImages: RecipeImageWithUrl[],
  pending: PendingImage[]
): GalleryItem[] {
  const attached: GalleryItem[] = attachedImages.map((image) => ({
    kind: "attached",
    key: image.id,
    url: image.url,
    caption: image.caption,
  }));
  const buffered: GalleryItem[] = pending.map((item) => ({
    kind: "pending",
    key: item.key,
    url: item.previewUrl,
  }));

  return [...attached, ...buffered];
}
