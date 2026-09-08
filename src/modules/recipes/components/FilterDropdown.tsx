"use client";

import { useState } from "react";
import { CHButton } from "@/common";
import { FilterPanel } from "./FilterPanel";
import type { Tag } from "../types";

export function FilterDropdown({
  tags,
  selectedTagIds,
  onToggleTag,
  maxCookingTime,
  onSetMaxCookingTime,
  activeCount,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  maxCookingTime: number | null;
  onSetMaxCookingTime: (value: number | null) => void;
  activeCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <CHButton
        variant="ghost"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full text-center md:w-auto"
      >
        Filters
        {activeCount > 0 && (
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-ink">
            {activeCount}
          </span>
        )}
      </CHButton>

      {isOpen && (
        <FilterPanel
          tags={tags}
          selectedTagIds={selectedTagIds}
          onToggleTag={onToggleTag}
          maxCookingTime={maxCookingTime}
          onSetMaxCookingTime={onSetMaxCookingTime}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
