import Link from "next/link";
import { TagBadge } from "@/components/common";
import type { RecipeSummary } from "../types";
import { formatRecipeMeta, placeholderGradient } from "../utils";
import { FavoriteButton } from "./FavoriteButton";

/**
 * One card in the recipe grid.
 *
 * The thumbnail is a generated colour field, not a photo — `recipes.list`
 * returns tags but no images. Real thumbnails need the list query to include
 * the first `RecipeImage`.
 *
 * **The whole card is one link, stretched from the title.** `after:inset-0`
 * expands the title anchor's hit area over the card root, so clicking the
 * thumbnail opens the recipe while there is still exactly one tab stop, named
 * by the title text. The obvious alternative — a second anchor around the
 * image, hidden with `aria-hidden` — is wrong: clicking an anchor focuses it,
 * and focus inside an `aria-hidden` subtree is precisely what the ARIA spec
 * forbids (browsers log it and drop the hiding).
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
        <div
          className="h-full w-full rounded-lg border border-line-soft transition duration-260 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-frame"
          style={{ background: placeholderGradient(recipe.id) }}
        />

        {/*
          Lifted above the stretched link so the heart stays a heart — without
          the z-index it sits under the overlay and toggling it would navigate.
        */}
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
        className="font-display text-[15.5px] font-semibold leading-[1.25] text-ink no-underline transition-colors duration-220 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] after:absolute after:inset-0 after:content-[''] group-hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
