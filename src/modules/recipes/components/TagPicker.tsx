import { TagChip } from "@/common";
import type { Tag } from "../types";
import { groupTagsByType } from "../utils/tags";

/**
 * Tag selection for the form — the same chip vocabulary as the list filter.
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
        <div className="flex flex-wrap items-center gap-[7px]">
          {groupTagsByType(tags).map((group, index) => (
            <div key={group[0].id} className="flex flex-wrap items-center gap-[7px]">
              {index > 0 && <span aria-hidden className="mx-1 h-[18px] w-px bg-line" />}
              {group.map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.name}
                  selected={selectedTagIds.includes(tag.id)}
                  onToggle={() => onToggle(tag.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
