import { CHButton } from "@/components/common";

/** Save error, then Cancel/Save — the form's one exit and one commit action. */
export function RecipeFormFooter({
  isSaving,
  saveError,
  onCancel,
}: {
  isSaving: boolean;
  saveError: { message: string } | null;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-[9px]">
      {saveError && (
        <p className="m-0 text-[13px] text-danger" role="alert">
          {saveError.message}
        </p>
      )}

      <div className="flex justify-end gap-[9px] border-t border-line-soft pt-[15px]">
        <CHButton variant="ghost" onClick={onCancel}>
          Cancel
        </CHButton>
        <CHButton variant="primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save recipe"}
        </CHButton>
      </div>
    </div>
  );
}
