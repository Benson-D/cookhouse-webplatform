import { CHSectionLabel } from "@/common";
import type { Tag } from "../types";
import { groupTagsByType, labelForTagGroup } from "../utils/tags";
import { TruncatedTagGroup } from "./FilterPanel";

/**
 * Tag selection for the form — the same chip vocabulary as the list filter,
 * grouped and truncated the same way `FilterPanel` is (`TruncatedTagGroup`,
 * shared from there) so a populated Cuisine/Diet group doesn't render as a
 * flat wall of chips here either.
 *
 * **Pick-only, never type.** Creating a `Tag` is admin-only, so this is a
 * closed list from `tags.list`; there is deliberately no "add a tag" affordance
 * for a non-admin to be refused by.
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
