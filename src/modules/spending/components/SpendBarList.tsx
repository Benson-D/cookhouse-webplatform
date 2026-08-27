"use client";

import { useState } from "react";
import { ExpandRow } from "@/components/common";
import { formatCurrency } from "../utils";
import type { SpendBarRow } from "../types";

/**
 * Category and store breakdowns are one bar-list component each, not a
 * separate chart and table — a chart next to a table of the same handful of
 * totals is the same numbers twice. One row: label, exact amount, and an
 * inline bar for relative size. Rows are pre-sorted descending by the
 * backend, so the first row is always the longest bar.
 */
export function SpendBarList({
  rows,
  previewCount,
  moreLabel,
  /** 14px matches every use but the last section on the page, which wants a bit more room before the page ends. */
  paddingBottom = 14,
}: {
  rows: SpendBarRow[];
  previewCount: number;
  moreLabel: (remaining: number) => string;
  paddingBottom?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (rows.length === 0) {
    return <p className="m-0 px-[22px] text-[13px] text-ink-faint">Nothing in this range yet.</p>;
  }

  const maxTotal = rows[0].total;
  const visible = expanded ? rows : rows.slice(0, previewCount);
  const remaining = rows.length - visible.length;

  return (
    <div className="px-[22px]" style={{ paddingBottom }}>
      <div className="flex flex-col">
        {visible.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[128px_1fr_68px] items-center gap-3 py-[6px] text-[13.5px]"
          >
            <span className="truncate text-ink">{row.label}</span>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${maxTotal > 0 ? (row.total / maxTotal) * 100 : 0}%` }}
              />
            </div>
            <span className="tabular text-right font-mono text-ink">{formatCurrency(row.total)}</span>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-0.5">
          <ExpandRow label={moreLabel(remaining)} actionLabel="view all" onClick={() => setExpanded(true)} />
        </div>
      )}
    </div>
  );
}
