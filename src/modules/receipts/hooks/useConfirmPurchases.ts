"use client";

import { trpc } from "@/lib/trpc";

/** Turns reviewed line items into `Purchase` rows — the only write in this whole flow. */
export function useConfirmPurchases() {
  const confirm = trpc.receipts.confirmPurchases.useMutation();

  return {
    confirm: confirm.mutateAsync,
    isConfirming: confirm.isPending,
    confirmError: confirm.error,
  };
}
