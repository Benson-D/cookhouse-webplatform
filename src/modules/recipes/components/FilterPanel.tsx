"use client";

import { useState } from "react";
import { ExpandRow, TagChip } from "@/components/common";
import { COOK_TIME_OPTIONS, groupTagsByType, labelForTagGroup } from "../utils";
import type { Tag } from "../types";

const CUISINE_PREVIEW_COUNT = 6;

function CuisineGroup({
  tags,
  selectedTagIds,
  onToggleTag,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tags : tags.slice(0, CUISINE_PREVIEW_COUNT);
  const remaining = tags.length - visible.length;

  return (
    <>
      <div className="flex flex-wrap gap-[7px] pb-2">
        {visible.map((tag) => (
          <TagChip
            key={tag.id}
            label={tag.name}
            selected={selectedTagIds.includes(tag.id)}
            onToggle={() => onToggleTag(tag.id)}
          />
        ))}
      </div>
      {remaining > 0 && (
        <ExpandRow
          label={`${remaining} more cuisine${remaining === 1 ? "" : "s"}`}
          actionLabel="view all"
          onClick={() => setExpanded(true)}
        />
      )}
    </>
  );
}

/**
 * Grouped by `Tag.type`, floating over the grid on desktop and stacking
 * inline on mobile via one responsive class difference (see the wrapper in
 * `FilterButton`, which owns the open/close state this panel doesn't).
 */
export function FilterPanel({
  tags,
  selectedTagIds,
  onToggleTag,
  maxCookingTime,
  onSetMaxCookingTime,
  onClose,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  maxCookingTime: number | null;
  onSetMaxCookingTime: (value: number | null) => void;
  onClose: () => void;
}) {
  const groups = groupTagsByType(tags);

  return (
    <div className="static mt-2.5 w-full rounded-[10px] border border-line bg-surface p-3.5 sm:absolute sm:top-[calc(100%+8px)] sm:right-0 sm:z-20 sm:mt-0 sm:w-[300px] sm:max-h-[min(70vh,480px)] sm:overflow-y-auto sm:shadow-frame">
      <div className="mb-2.5 flex items-center justify-between font-display text-sm font-semibold text-ink">
        <span>Filters</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="text-[15px] text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </div>

      {groups.map((group) => {
        const type = group[0]?.type ?? null;
        const isCuisine = type === "cuisine";

        return (
          <div key={type ?? "other"}>
            <div className="mb-[9px] mt-[18px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint first:mt-0">
              {labelForTagGroup(type)}
            </div>
            {isCuisine ? (
              <CuisineGroup tags={group} selectedTagIds={selectedTagIds} onToggleTag={onToggleTag} />
            ) : (
              <div className="flex flex-wrap gap-[7px] pb-2">
                {group.map((tag) => (
                  <TagChip
                    key={tag.id}
                    label={tag.name}
                    selected={selectedTagIds.includes(tag.id)}
                    onToggle={() => onToggleTag(tag.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mb-[9px] mt-[18px] text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
        Cook time
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {COOK_TIME_OPTIONS.map((option) => (
          <TagChip
            key={option.value}
            label={option.label}
            selected={maxCookingTime === option.value}
            onToggle={() =>
              onSetMaxCookingTime(maxCookingTime === option.value ? null : option.value)
            }
          />
        ))}
      </div>
    </div>
  );
}
