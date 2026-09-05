import Link from "next/link";
import { TagBadge } from "@/common";
import type { RecipeSummary } from "../types";
import { formatRecipeMeta } from "../utils/recipeMeta";
import { placeholderGradient } from "../utils/placeholder";
import { FavoriteButton } from "./FavoriteButton";

/**
 * One card in the recipe grid.
 *
 * **The whole card is one link, stretched from the title** via `after:inset-0`
 * — not a second hidden anchor around the image, since focus inside an
 * `aria-hidden` subtree is invalid per the ARIA spec.
 */
export function RecipeCard({
  recipe,
  isFavoritePending,
  onToggleFavorite,
}: {
  recipe: RecipeSummary;
  isFavoritePending: boolean;
  onToggleFavorite: () => void;
}) {
  const meta = formatRecipeMeta(recipe);

  return (
    <div className="group relative flex flex-col gap-[9px]">
      <div className="relative aspect-[4/3]">
        {/* Shadow lives on a separate `::after` (opacity only) so box-shadow's repaint cost stays off the transform-animating element. */}
        <div
          className="relative h-full w-full overflow-hidden rounded-lg border border-line-soft transition-transform duration-260 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:shadow-frame after:content-[''] after:transition-opacity after:duration-260 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:opacity-100"
          style={recipe.coverImageUrl ? undefined : { background: placeholderGradient(recipe.id) }}
        >
          {recipe.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- presigned bucket URL, host not yet fixed
            <img src={recipe.coverImageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton
            isFavorited={recipe.isFavorited}
            isPending={isFavoritePending}
            onToggle={onToggleFavorite}
            recipeName={recipe.name}
          />
        </div>
      </div>

      <Link
        href={`/recipes/${recipe.id}`}
        className="font-display text-[15.5px] font-semibold leading-[1.25] text-ink no-underline transition-colors duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:inset-0 after:content-[''] group-hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {recipe.name}
      </Link>

      {meta && <div className="tabular font-mono text-xs text-ink-faint">{meta}</div>}

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {recipe.tags.map(({ tag }) => (
            <TagBadge key={tag.id} label={tag.name} />
          ))}
        </div>
      )}
    </div>
  );
}
