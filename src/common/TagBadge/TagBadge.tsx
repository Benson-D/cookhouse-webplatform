/** Read-only label pill — smaller, square, non-interactive. Used for recipe tags and receipt-review flags alike. */
export function TagBadge({ label }: { label: string }) {
  return (
    <span className="rounded bg-surface-2 px-[7px] py-0.5 text-[10.5px] tracking-[0.02em] text-ink-soft">
      {label}
    </span>
  );
}
