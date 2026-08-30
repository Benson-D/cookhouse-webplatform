import { CHButton, CHLink } from "@/components/common";
import { FilterButton } from "./FilterButton";
import type { Tag } from "../types";

/** Search field, favorites toggle, the filters panel trigger, and the new-recipe action. */
export function RecipeToolbar({
  search,
  onSearchChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  panelTags,
  selectedTagIds,
  onToggleTag,
  maxCookingTime,
  onSetMaxCookingTime,
  activeFilterCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  panelTags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  maxCookingTime: number | null;
  onSetMaxCookingTime: (value: number | null) => void;
  activeFilterCount: number;
}) {
  return (
    // Stacks below md: search full-width, then Favorites, then Filters, then
    // New recipe, each its own full-width row — search first (the primary
    // job), refining it next, creating last. Favorites and Filters are each
    // plain direct children rather than paired in a shared row: Filters'
    // panel renders inline (position: static) at this width and grows the
    // row a lot when open, and a shared flex row stretches its sibling's
    // cell to match — pairing them was tried and dropped for exactly that
    // glitch. One row each sidesteps it entirely. At md: all four become
    // plain flex items in one row via the same classes, matching today's
    // desktop layout.
    <div className="flex flex-col gap-3 px-[22px] pb-3.5 pt-[18px] md:flex-row md:flex-wrap md:items-center">
      <div className="flex min-w-[180px] flex-1 items-center gap-[9px] rounded-lg border border-line bg-surface-2 px-3 py-2">
        <span aria-hidden className="text-ink-faint">
          🔍
        </span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search recipes"
          aria-label="Search recipes"
          className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>

      <CHButton
        pressed={favoritesOnly}
        onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
        className="w-full text-center md:w-auto"
      >
        ♥ Favorites
      </CHButton>

      <FilterButton
        tags={panelTags}
        selectedTagIds={selectedTagIds}
        onToggleTag={onToggleTag}
        maxCookingTime={maxCookingTime}
        onSetMaxCookingTime={onSetMaxCookingTime}
        activeCount={activeFilterCount}
        className="w-full md:w-auto"
        triggerClassName="w-full text-center md:w-auto"
      />

      <CHLink variant="primary" href="/recipes/new" className="w-full text-center md:w-auto">
        New recipe
      </CHLink>
    </div>
  );
}
