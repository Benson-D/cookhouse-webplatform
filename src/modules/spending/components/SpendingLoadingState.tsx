/**
 * Shaped like the real screen — a hero-sized block, a chart-sized block, and
 * two short row groups — rather than the generic list-row skeleton, which
 * doesn't resemble this layout at all. Same `animate-pulse bg-surface-2`
 * language as `LoadingState`/`CardGridLoadingState`, just a different shape.
 */
export function SpendingLoadingState() {
  return (
    <div className="flex flex-col gap-1 px-[22px] py-6" role="status" aria-live="polite">
      <span className="sr-only">Loading spending…</span>

      <div className="animate-pulse space-y-2 pb-2">
        <div className="h-11 w-48 rounded-md bg-surface-2" />
        <div className="h-3 w-40 rounded bg-surface-2" />
      </div>

      <div className="h-[200px] animate-pulse rounded-lg bg-surface-2" />

      {[5, 4].map((rows) => (
        <div key={rows} className="animate-pulse space-y-2 pt-6">
          <div className="h-3 w-24 rounded bg-surface-2" />
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className="h-4 rounded bg-surface-2"
              style={{ width: `${80 - index * 8}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
