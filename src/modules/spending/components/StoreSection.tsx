"use client";

import { useState } from "react";
import { CHSectionLabel, TagChip } from "@/common";
import { formatCategory, formatStoreName, storeBreakdownRows } from "../utils";
import type { StoreSpend } from "../types";
import { StoreChart } from "./StoreChart";
import { TopItemsList } from "./TopItemsList";

/**
 * Spend by store, narrowable to one category via a single-select chip row.
 * On desktop a bar's breakdown is a hover tooltip; on mobile, where there's
 * no hover, tapping a bar shows it as a list under the chart instead — the
 * same tap-to-drill-down the month chart uses.
 */
export function StoreSection({
  stores,
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  stores: StoreSpend[];
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}) {
  const [selectedStoreName, setSelectedStoreName] = useState<string | null>(null);
  // Derived, not stored: a store that drops out of the chart (new category or
  // range) simply stops being selected.
  const selectedStore = stores.find((store) => store.store === selectedStoreName) ?? null;

  return (
    <div className="px-[22px] pb-[22px]">
      <CHSectionLabel className="mb-2 mt-1">By store</CHSectionLabel>

      {categories.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-[7px]">
          <TagChip
            label="All"
            selected={selectedCategory === null}
            onToggle={() => onSelectCategory(null)}
          />
          {categories.map((category) => (
            <TagChip
              key={category}
              label={formatCategory(category)}
              selected={selectedCategory === category}
              onToggle={() => onSelectCategory(selectedCategory === category ? null : category)}
            />
          ))}
        </div>
      )}

      {stores.length === 0 ? (
        <p className="m-0 text-[12.5px] text-ink-faint">No purchases in this category.</p>
      ) : (
        <>
          <div className="mb-2 font-mono text-[11px] text-ink-faint md:hidden">
            Tap a store for its top items
          </div>

          <StoreChart
            stores={stores}
            onSelectStore={(store) =>
              setSelectedStoreName(store === selectedStoreName ? null : store)
            }
          />

          {selectedStore && (
            <div className="mt-5 md:hidden">
              <TopItemsList
                title={
                  selectedStore.foldedStores
                    ? "Other — stores included"
                    : `Top items — ${formatStoreName(selectedStore.store)}`
                }
                items={storeBreakdownRows(selectedStore)}
                emptyMessage="No purchases at this store."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
