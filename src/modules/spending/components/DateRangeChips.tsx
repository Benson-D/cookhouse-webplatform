import { TagChip } from "@/common";
import { RANGE_PRESETS } from "../utils";
import type { RangePreset } from "../types";

export function DateRangeChips({
  preset,
  onChange,
}: {
  preset: RangePreset;
  onChange: (preset: RangePreset) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[7px] px-[22px] pb-4">
      {RANGE_PRESETS.map((option) => (
        <TagChip
          key={option.id}
          label={option.label}
          selected={preset === option.id}
          onToggle={() => onChange(option.id)}
        />
      ))}
    </div>
  );
}
