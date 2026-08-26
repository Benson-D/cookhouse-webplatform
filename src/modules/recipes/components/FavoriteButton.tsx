import { cn } from "@/lib/cn";

/**
 * Favorites are personal, so this reflects only the current user's state —
 * another member of the same household sees their own.
 */
export function FavoriteButton({
  isFavorited,
  isPending,
  onToggle,
  recipeName,
}: {
  isFavorited: boolean;
  isPending?: boolean;
  onToggle: () => void;
  recipeName: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      aria-pressed={isFavorited}
      aria-label={
        isFavorited
          ? `Remove ${recipeName} from your favorites`
          : `Save ${recipeName} to your favorites`
      }
      className={cn(
        "grid h-6 w-6 place-items-center rounded-full bg-white/90 text-xs shadow-raised transition-opacity disabled:opacity-50",
        isFavorited ? "text-[#B4442F]" : "text-[#B4442F]/35 hover:text-[#B4442F]/70"
      )}
    >
      <span aria-hidden>{isFavorited ? "♥" : "♡"}</span>
    </button>
  );
}
