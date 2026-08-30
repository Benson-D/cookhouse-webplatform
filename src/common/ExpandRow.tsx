/**
 * The dashed "N more, view all" row — first used in the receipt review's
 * matched-items list, now shared with the trend table and spending's
 * category/store breakdowns. Label and action text are the caller's call
 * (a expand-once row and a expand/collapse toggle read differently), so
 * this only renders the two text slots and the click.
 */
export function ExpandRow({
  label,
  actionLabel,
  onClick,
}: {
  label: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-dashed border-line px-3 py-2.5 text-[13px] text-ink-soft hover:border-ink-faint hover:bg-surface-2"
    >
      <span>▾ {label}</span>
      <span>{actionLabel}</span>
    </button>
  );
}
