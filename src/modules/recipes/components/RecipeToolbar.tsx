import { CHButton, CHLink } from "@/components/common";

/** Search field, favorites toggle, and the new-recipe action. */
export function RecipeToolbar({
  search,
  onSearchChange,
  favoritesOnly,
  onFavoritesOnlyChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-[22px] pb-3.5 pt-[18px]">
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
      >
        ♥ Favorites
      </CHButton>

      <CHLink variant="primary" href="/recipes/new">
        New recipe
      </CHLink>
    </div>
  );
}
