import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@cookhouse/api-contract";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type RouterInputs = inferRouterInputs<AppRouter>;

export type ScanResult = RouterOutputs["receipts"]["scan"];
export type ScannedLineItem = ScanResult["lineItems"][number];
export type ConfirmedPurchaseInput = RouterInputs["receipts"]["confirmPurchases"]["items"][number];

/** An ingredient the user picked or created, overriding what Textract matched. */
export type IngredientOverride = { id: string; name: string };

/**
 * One scanned line, plus whatever the reviewer has done to it. `price` and
 * `quantity` are kept as raw input strings, not numbers — these are
 * controlled text fields, not a react-hook-form array, since the row set is
 * seeded once from a scan result rather than user-added.
 */
export type ReviewLineItem = {
  id: string;
  description: string;
  price: string;
  quantity: string;
  matchedIngredientId: string | null;
  matchedIngredientName: string | null;
  override: IngredientOverride | null;
  /** User tapped a matched row to correct it — promotes it into the editable group. */
  promoted: boolean;
  removed: boolean;
};
