export const COOK_TIME_OPTIONS = [
  { label: "Under 20 min", value: 20 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 45 min", value: 45 },
  { label: "Under 1hr", value: 60 },
] as const;

/** Backend takes a plain int with no fixed enum, so anything outside the four presets still needs a label. */
export function formatCookTimeFilter(maxCookingTime: number): string {
  return (
    COOK_TIME_OPTIONS.find((option) => option.value === maxCookingTime)?.label ??
    `Under ${maxCookingTime} min`
  );
}
