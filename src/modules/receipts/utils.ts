import type { ConfirmedPurchaseInput, ReviewLineItem, ScanResult } from "./types";

/** Seeds review state from a fresh scan — nothing is promoted or removed yet. */
export function toReviewItems(scan: ScanResult): ReviewLineItem[] {
  return scan.lineItems.map((item, index) => ({
    id: `${index}-${item.description}`,
    description: item.description,
    price: item.price !== null ? String(item.price) : "",
    quantity: item.quantity !== null ? String(item.quantity) : "",
    matchedIngredientId: item.matchedIngredientId,
    matchedIngredientName: item.matchedIngredientName,
    override: null,
    promoted: false,
    removed: false,
  }));
}

/**
 * A line needs a look if it's a new ingredient, if it's missing a price
 * (required to confirm), or if the reviewer tapped it to correct something.
 */
export function needsLook(item: ReviewLineItem): boolean {
  return item.matchedIngredientId === null || item.price.trim() === "" || item.promoted;
}

export function groupItems(items: ReviewLineItem[]) {
  const visible = items.filter((item) => !item.removed);
  return {
    needsLook: visible.filter(needsLook),
    matchedAutomatically: visible.filter((item) => !needsLook(item)),
  };
}

/** What a line resolves to at commit — the override name, the matched ingredient's canonical name, or the raw scanned text for a genuinely new one. */
function resolvedDescription(item: ReviewLineItem): string {
  if (item.override) return item.override.name;
  if (item.matchedIngredientId && item.matchedIngredientName) return item.matchedIngredientName;
  return item.description;
}

/** Every visible line has a usable price and isn't blank — the two things Confirm requires. */
export function isReadyToConfirm(items: ReviewLineItem[]): boolean {
  const visible = items.filter((item) => !item.removed);
  return visible.length > 0 && visible.every((item) => item.price.trim() !== "");
}

export function buildConfirmItems(items: ReviewLineItem[]): ConfirmedPurchaseInput[] {
  return items
    .filter((item) => !item.removed)
    .map((item) => ({
      description: resolvedDescription(item),
      price: Number(item.price),
      quantity: item.quantity.trim() ? Number(item.quantity) : undefined,
    }));
}
