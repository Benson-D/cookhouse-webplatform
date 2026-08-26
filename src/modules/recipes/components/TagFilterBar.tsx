import { Fragment } from "react";
import { TagChip } from "@/components/common";
import { cn } from "@/lib/cn";
import type { Tag } from "../types";
import { groupTagsByType } from "../utils";

/**
 * One run per tag type, split by a thin rule.
 *
 * Selecting several tags matches a recipe carrying *any* of them, so the row
 * reads as "dinner or dessert", never "both at once" — that's the backend's
 * `tagIds` semantics, and the UI must not imply otherwise.
 */
export function TagFilterBar({
  tags,
  selectedTagIds,
  onToggleTag,
  onClear,
}: {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  onClear: () => void;
}) {
  if (tags.length === 0) {
    return null;
  }

  const groups = groupTagsByType(tags);

  return (
    <div className="flex flex-wrap items-center gap-[7px] px-[22px] pb-4">
      <TagChip
        label="All"
        selected={selectedTagIds.length === 0}
        onToggle={onClear}
      />

      {groups.map((group, index) => (
        <Fragment key={group[0].id}>
          <span
            aria-hidden
            className={cn("mx-1 h-[18px] w-px bg-line", index === 0 && "hidden")}
          />
          {group.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.name}
              selected={selectedTagIds.includes(tag.id)}
              onToggle={() => onToggleTag(tag.id)}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
