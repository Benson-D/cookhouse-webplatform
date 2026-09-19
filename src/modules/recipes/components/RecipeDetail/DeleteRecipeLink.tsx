import { cn } from "@/lib/cn";

/**
 * A quiet text link, not a fourth button — destructive and rare, so it
 * shouldn't read as a peer to Add to grocery list / Save / Edit. Tap-to-arm
 * confirms it, styled more seriously than the grocery list's own "Remove
 * all" (red, bold, explicit "permanently") since losing a whole recipe is a
 * bigger loss than clearing a list that rebuilds itself from recipes anyway.
 */
export function DeleteRecipeLink({
  armed,
  onTap,
  isDeleting,
}: {
  armed: boolean;
  onTap: () => void;
  isDeleting: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={isDeleting}
      className={cn(
        "cursor-pointer pl-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-60",
        armed ? "font-semibold text-danger" : "text-ink-faint hover:text-ink"
      )}
    >
      {isDeleting ? "Deleting…" : armed ? "Tap again to permanently delete" : "Delete"}
    </button>
  );
}
