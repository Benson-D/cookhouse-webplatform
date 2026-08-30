"use client";

import { TagChip } from "@/common";
import { formatCookTimeFilter } from "../utils";
import type { Tag } from "../types";

/** A removable summary chip — the panel-sourced filters (tags outside meal-time, plus cook time) stay visible even with the panel closed. */
function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-[5px] whitespace-nowrap rounded-full border border-transparent bg-accent-soft px-[11px] py-[4.5px] text-[12.5px] font-semibold text-accent">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </span>
  );
}

export function ActiveFiltersRow({
  mealTimeTags,
  panelTags,
  selectedTagIds,
  onToggleTag,
  maxCookingTime,
  onSetMaxCookingTime,
  onClearAll,
}: {
  mealTimeTags: Tag[];
  panelTags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  maxCookingTime: number | null;
  onSetMaxCookingTime: (value: number | null) => void;
  onClearAll: () => void;
}) {
  const activePanelTags = panelTags.filter((tag) => selectedTagIds.includes(tag.id));
  const hasSummary = activePanelTags.length > 0 || maxCookingTime !== null;

  if (mealTimeTags.length === 0 && !hasSummary) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-[7px] px-[22px] pb-4">
      {mealTimeTags.map((tag) => (
        <TagChip
          key={tag.id}
          label={tag.name}
          selected={selectedTagIds.includes(tag.id)}
          onToggle={() => onToggleTag(tag.id)}
        />
      ))}

      {hasSummary && (
        <>
          {mealTimeTags.length > 0 && <span aria-hidden className="mx-1 h-[18px] w-px bg-line" />}

          {activePanelTags.map((tag) => (
            <RemovableChip key={tag.id} label={tag.name} onRemove={() => onToggleTag(tag.id)} />
          ))}

          {maxCookingTime !== null && (
            <RemovableChip
              label={formatCookTimeFilter(maxCookingTime)}
              onRemove={() => onSetMaxCookingTime(null)}
            />
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="ml-0.5 cursor-pointer text-xs text-ink-faint underline decoration-1 underline-offset-2 hover:text-ink"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
