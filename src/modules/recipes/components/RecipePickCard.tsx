import { TagBadge } from "@/common";
import { cn } from "@/lib/cn";
import type { RecipeSummary } from "../types";
import { formatRecipeMeta } from "../utils/recipeMeta";
import { placeholderGradient } from "../utils/placeholder";

/**
 * `RecipeCard`'s sibling for the grocery list's "Add from recipes" picker.
 * Toggles a selection instead of linking through; the heart becomes a
 * checkbox in the grocery list's own rounded-square shape, for one visual
 * language across the app.
 *
 * A `<button>` around the whole card, not a stretched link like `RecipeCard`
 * — there's nothing here to navigate to, the entire card *is* the control.
 */
export function RecipePickCard({
  recipe,
  selected,
  onToggle,
}: {
  recipe: RecipeSummary;
  selected: boolean;
  onToggle: () => void;
}) {
  const meta = formatRecipeMeta(recipe);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className="group flex flex-col gap-[9px] text-left"
    >
      <div className="relative aspect-[4/3]">
        {/* Shadow lives on a separate `::after` (opacity only), same technique as `RecipeCard`. */}
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-lg border border-line-soft transition-transform duration-260 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:shadow-frame after:content-[''] after:transition-opacity after:duration-260 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:opacity-100",
            selected && "outline outline-2 outline-offset-2 outline-accent"
          )}
          style={recipe.coverImageUrl ? undefined : { background: placeholderGradient(recipe.id) }}
        >
          {recipe.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- presigned bucket URL, host not yet fixed
            <img src={recipe.coverImageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div
          className={cn(
            "absolute left-2 top-2 grid h-[22px] w-[22px] place-items-center rounded-md border-[1.5px] text-[11px] font-bold",
            selected
              ? "animate-check-pop border-accent bg-accent text-accent-ink"
              : "border-white/55 bg-white/80 text-transparent"
          )}
        >
          ✓
        </div>
      </div>

      <span
        className={cn(
          "font-display text-[15.5px] font-semibold leading-[1.25] transition-colors duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
          selected ? "text-accent" : "text-ink group-hover:text-accent"
        )}
      >
        {recipe.name}
      </span>

      {meta && <span className="tabular font-mono text-xs text-ink-faint">{meta}</span>}

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {recipe.tags.map(({ tag }) => (
            <TagBadge key={tag.id} label={tag.name} />
          ))}
        </div>
      )}
    </button>
  );
}
