import { CHButton } from "@/common";

/** Sticky so the count and confirm action stay reachable on a long, scrolled list — the case this screen most needs to handle on a phone. */
export function PickerFooter({
  selectedCount,
  onSubmit,
  isSubmitting,
}: {
  selectedCount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-[22px] py-3.5">
      <span className="text-[13.5px] text-ink-soft">
        <b className="font-semibold text-ink">
          {selectedCount} recipe{selectedCount === 1 ? "" : "s"}
        </b>{" "}
        selected · merges into the current list
      </span>
      <CHButton
        variant="primary"
        onClick={onSubmit}
        disabled={selectedCount === 0 || isSubmitting}
      >
        {isSubmitting ? "Adding…" : "Add to list"}
      </CHButton>
    </div>
  );
}
