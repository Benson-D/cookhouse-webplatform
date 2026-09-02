/** Not an approved design — muted `surface-2` blocks standing in until this gets a real design pass. */
export function LoadingState({
  label = "Loading…",
  rows = 3,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="px-[22px] py-6" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="h-4 animate-pulse rounded-md bg-surface-2"
            style={{ width: `${88 - index * 14}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Card-shaped skeleton for the recipe grid, matching RecipeCard's proportions. */
export function CardGridLoadingState({ cards = 6 }: { cards?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-[18px] px-[22px] pb-5 pt-1 md:grid-cols-3"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading recipes…</span>
      {Array.from({ length: cards }, (_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-[9px]">
          <div className="aspect-[4/3] rounded-lg border border-line-soft bg-surface-2" />
          <div className="h-4 w-4/5 rounded bg-surface-2" />
          <div className="h-3 w-2/5 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
