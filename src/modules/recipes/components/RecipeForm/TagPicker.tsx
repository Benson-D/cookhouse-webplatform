import { CHSectionLabel } from "@/common";
import type { Tag } from "../../types";
import { groupTagsByType, labelForTagGroup } from "../../utils/tags";
import { TruncatedTagGroup } from "../RecipeList/FilterPanel";

/**
 * Tag selection for the form, grouped and truncated via `FilterPanel`'s
 * `TruncatedTagGroup`. Pick-only — tags are admin-created, so no "add a tag".
 */
export function TagPicker({
  label,
  tags,
  selectedTagIds,
  onToggle,
}: {
  label: string;
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-faint">
        {label}
      </span>

      {tags.length === 0 ? (
        <p className="m-0 text-[11.5px] text-ink-faint">
          No tags exist yet. An admin creates them.
        </p>
      ) : (
        groupTagsByType(tags).map((group) => {
          const type = group[0]?.type ?? null;
          return (
            <div key={type ?? "other"}>
              <CHSectionLabel className="first:mt-0">{labelForTagGroup(type)}</CHSectionLabel>
              <TruncatedTagGroup
                tags={group}
                groupLabel={labelForTagGroup(type).toLowerCase()}
                selectedTagIds={selectedTagIds}
                onToggleTag={onToggle}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
