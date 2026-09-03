"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CHFormField, CHSectionLabel, CHTextInput, ErrorState, SubpageHeader } from "@/common";
import { useIngredientSearchPicker } from "@/hooks/useIngredientSearchPicker";
import { useReceiptScan } from "./hooks/useReceiptScan";
import { useConfirmPurchases } from "./hooks/useConfirmPurchases";
import { ReceiptPickerPrompt } from "./components/ReceiptPickerPrompt";
import { ReceiptLineRow } from "./components/ReceiptLineRow";
import { ReceiptMatchedList } from "./components/ReceiptMatchedList";
import { ReceiptScanFooter } from "./components/ReceiptScanFooter";
import { buildConfirmItems, groupItems, isReadyToConfirm, toReviewItems } from "./utils";
import type { ReviewLineItem } from "./types";

/**
 * Photo → Textract → review → `Purchase` rows. Lives under `/receipts`, not
 * `/grocery-list` — the entry point sits on the grocery list because that's
 * when a receipt is in hand, but nothing here writes to the list itself.
 *
 * No dedicated upload screen: a native file/camera picker, then straight into
 * review once `scan` returns. The scan result (including which lines matched
 * an existing ingredient) only ever exists in this component's state — it
 * isn't persisted, so a mid-review refresh loses the review, not just the draft.
 */
export function ReceiptScanScreen() {
  const router = useRouter();
  const { scan, isScanning, scanError } = useReceiptScan();
  const { confirm, isConfirming, confirmError } = useConfirmPurchases();
  const picker = useIngredientSearchPicker();

  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [items, setItems] = useState<ReviewLineItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);
  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    []
  );

  async function handlePick(file: File) {
    // Local preview while scanning is in flight — but this is the *original*
    // picked file, so it's still raw HEIC if that's what was chosen, and no
    // browser but Safari renders that. Swapped below for the real, converted
    // image the moment scan() resolves. Only revoked on success: on failure,
    // previewUrl still points at it, so revoking unconditionally here would
    // leave a broken image behind for whatever error state renders next.
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    const result = await scan(file);
    if (!result) return;

    URL.revokeObjectURL(localPreview);
    setPreviewUrl(result.imageUrl);
    setReceiptId(result.receiptId);
    setStoreName(result.vendorName ?? "");
    setItems(toReviewItems(result));
  }

  function updateItem(id: string, patch: Partial<ReviewLineItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    updateItem(id, { removed: true });
  }

  function promoteItem(id: string) {
    updateItem(id, { promoted: true });
  }

  async function handleConfirm() {
    if (!receiptId) return;
    await confirm({
      receiptId,
      storeName: storeName.trim() || undefined,
      items: buildConfirmItems(items),
    });
    router.push("/grocery-list");
  }

  if (!receiptId) {
    return (
      <div className="flex flex-col">
        <SubpageHeader backHref="/grocery-list" title="Scan receipt" />
        <ReceiptPickerPrompt
          onPick={handlePick}
          isDisabled={isScanning}
          previewUrl={previewUrl}
          isScanning={isScanning}
        />
        {scanError && (
          <div className="px-[22px] pb-6">
            <ErrorState title="Couldn't scan that receipt" message={scanError} />
          </div>
        )}
      </div>
    );
  }

  const { needsLook, matchedAutomatically } = groupItems(items);
  const visibleCount = items.filter((item) => !item.removed).length;
  const total = items
    .filter((item) => !item.removed)
    .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="flex flex-col">
      <SubpageHeader
        backHref="/grocery-list"
        title="Review receipt"
        right={
          <span className="tabular font-mono text-xs text-ink-faint">
            {items.length} item{items.length === 1 ? "" : "s"} scanned · {needsLook.length} need
            {needsLook.length === 1 ? "s" : ""} a look
          </span>
        }
      />

      <div className="grid gap-[26px] px-[22px] pb-6 pt-5 md:grid-cols-[1.05fr_1fr]">
        <div>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob: preview, never uploaded anywhere but the receipt bucket
            <img
              src={previewUrl}
              alt="Scanned receipt"
              className="aspect-[3/4] w-full rounded-[9px] border border-line-soft object-cover"
            />
          )}
        </div>

        <div>
          <CHFormField label="Store" className="mb-4">
            <CHTextInput
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              placeholder="Where was this bought?"
            />
          </CHFormField>

          {needsLook.length > 0 && (
            <>
              <CHSectionLabel>Needs a look · {needsLook.length}</CHSectionLabel>
              <div className="flex flex-col">
                {needsLook.map((item) => (
                  <ReceiptLineRow
                    key={item.id}
                    item={item}
                    ingredientOptions={picker.options}
                    onSearchIngredients={picker.setSearch}
                    onResolveIngredient={picker.resolve}
                    onChange={(patch) => updateItem(item.id, patch)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </>
          )}

          {matchedAutomatically.length > 0 && (
            <>
              <CHSectionLabel>Matched automatically</CHSectionLabel>
              <ReceiptMatchedList items={matchedAutomatically} onPromote={promoteItem} />
            </>
          )}

          {confirmError && (
            <p className="mt-3 text-[13px] text-danger" role="alert">
              {confirmError.message}
            </p>
          )}
        </div>
      </div>

      <ReceiptScanFooter
        itemCount={visibleCount}
        total={total}
        isReady={isReadyToConfirm(items)}
        isConfirming={isConfirming}
        onConfirm={() => void handleConfirm()}
      />
    </div>
  );
}
