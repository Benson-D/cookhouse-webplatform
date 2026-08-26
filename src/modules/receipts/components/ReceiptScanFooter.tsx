"use client";

import { useRouter } from "next/navigation";
import { CHButton } from "@/components/common";

export function ReceiptScanFooter({
  itemCount,
  total,
  isReady,
  isConfirming,
  onConfirm,
}: {
  itemCount: number;
  total: number;
  isReady: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
}) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-[22px] py-3.5">
      <span className="tabular text-[13.5px] text-ink-soft">
        {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
        <b className="font-semibold text-ink">${total.toFixed(2)}</b>
      </span>

      <div className="flex gap-[9px]">
        <CHButton variant="ghost" onClick={() => router.push("/grocery-list")}>
          Cancel
        </CHButton>
        <CHButton variant="primary" onClick={onConfirm} disabled={!isReady || isConfirming}>
          {isConfirming ? "Confirming…" : `Confirm ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        </CHButton>
      </div>
    </div>
  );
}
