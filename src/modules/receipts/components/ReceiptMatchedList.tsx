"use client";

import { useState } from "react";
import { ExpandRow } from "@/common";
import type { ReviewLineItem } from "../types";

const PREVIEW_COUNT = 6;

/**
 * Compact, read-only rows for everything Textract matched confidently —
 * tapping one promotes it into `ReceiptLineRow`'s editable shape, same as
 * the recipe detail's ingredient list otherwise.
 */
export function ReceiptMatchedList({
  items,
  onPromote,
}: {
  items: ReviewLineItem[];
  onPromote: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const remaining = items.length - visible.length;

  return (
    <>
      <ul className="m-0 mb-0.5 flex list-none flex-col p-0">
        {visible.map((item) => (
          <li
            key={item.id}
            onClick={() => onPromote(item.id)}
            className="flex cursor-pointer items-baseline gap-[11px] border-b border-line-soft py-[7px] text-[13.5px] hover:bg-surface-2"
          >
            <span className="tabular min-w-[72px] font-mono text-[12.5px] text-ink">
              ${Number(item.price).toFixed(2)}
            </span>
            <span>{item.matchedIngredientName}</span>
            {item.quantity && (
              <span className="text-[12.5px] text-ink-faint">×{item.quantity}</span>
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <ExpandRow
          label={`${remaining} more items, all matched automatically`}
          actionLabel="view all"
          onClick={() => setExpanded(true)}
        />
      )}
    </>
  );
}
