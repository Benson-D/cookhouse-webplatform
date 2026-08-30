import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@cookhouse/api-contract";

/**
 * Prop types for the recipes module, inferred from the router rather than
 * hand-written.
 *
 * Redeclaring these as local interfaces would create a second source of truth
 * that drifts the moment a procedure's shape changes — inferring them means a
 * backend change surfaces as a type error here instead of a runtime surprise.
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type RecipeSummary = RouterOutputs["recipes"]["list"]["recipes"][number];
export type RecipeDetail = RouterOutputs["recipes"]["getById"];
export type RecipeImageWithUrl = RouterOutputs["recipes"]["images"][number];
export type Tag = RouterOutputs["tags"]["list"][number];

// Not router-inferred — these describe the image gallery's own UI shape,
// spanning a server-known image and one still sitting in local state.

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
