/** A quiet accent-coloured "add another" action. */
export function AddLineButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
    >
      + {children}
    </button>
  );
}

/** Removes a repeater row. */
export function RemoveRowButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-md border border-transparent text-center text-[15px] text-ink-faint hover:text-ink"
    >
      ×
    </button>
  );
}
