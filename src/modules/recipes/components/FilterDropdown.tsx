"use client";

import { useState } from "react";
import { CHButton } from "@/common";
import { cn } from "@/lib/cn";
import { FilterPanel } from "./FilterPanel";
import type { Tag } from "../types";

export function FilterDropdown({
  tags,
  selectedTagIds,
  onToggleTag,
  maxCookingTime,
  onSetMaxCookingTime,
  activeCount,
  className,
  triggerClassName,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  maxCookingTime: number | null;
  onSetMaxCookingTime: (value: number | null) => void;
  activeCount: number;
  /** Classes for the `relative` wrapper. */
  className?: string;
  /** Classes for the trigger button itself. */
  triggerClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <CHButton
        variant="ghost"
        onClick={() => setIsOpen((current) => !current)}
        className={triggerClassName}
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
