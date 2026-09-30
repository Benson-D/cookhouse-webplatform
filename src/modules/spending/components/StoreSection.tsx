"use client";

import { CHSectionLabel, TagChip } from "@/common";
import { formatCategory } from "../utils";
import type { StoreSpend } from "../types";
import { StoreChart } from "./StoreChart";

/** Spend by store, narrowable to one category via a single-select chip row. */
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
        <StoreChart stores={stores} />
      )}
    </div>
  );
}
