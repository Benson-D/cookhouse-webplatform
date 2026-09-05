import { CHButton, CHLink } from "@/common";
import { DeleteRecipeLink } from "./DeleteRecipeLink";

/** The recipe's mutating actions — add to list, favorite, edit, delete — plus feedback for the add-to-list action. */
export function RecipeDetailActions({
  recipeId,
  isFavorited,
  isFavoritePending,
  onToggleFavorite,
  isAdding,
  justAdded,
  onAddToList,
  addErrorMessage,
  deleteArmed,
  onTapDelete,
  isDeleting,
}: {
  recipeId: string;
  isFavorited: boolean;
  isFavoritePending: boolean;
  onToggleFavorite: () => void;
  isAdding: boolean;
  justAdded: boolean;
  onAddToList: () => void;
  addErrorMessage?: string;
  deleteArmed: boolean;
  onTapDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <>
      <div className="mt-5 flex items-center gap-[9px]">
        <CHButton variant="primary" onClick={onAddToList} disabled={isAdding || justAdded}>
          {isAdding ? "Adding…" : justAdded ? "Added ✓" : "Add to grocery list"}
        </CHButton>

        <CHButton pressed={isFavorited} onClick={onToggleFavorite} disabled={isFavoritePending}>
          {isFavorited ? "♥ Saved" : "♡ Save"}
        </CHButton>

        <CHLink variant="ghost" href={`/recipes/${recipeId}/edit`}>
          Edit
        </CHLink>

        <DeleteRecipeLink armed={deleteArmed} onTap={onTapDelete} isDeleting={isDeleting} />
      </div>

      {addErrorMessage && (
        <p className="mt-2 text-[13px] text-danger" role="alert">
          {addErrorMessage}
        </p>
      )}
    </>
  );
}
