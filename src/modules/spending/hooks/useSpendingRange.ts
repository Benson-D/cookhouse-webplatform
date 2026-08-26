"use client";

import { useMemo, useState } from "react";
import { resolveRangePreset } from "../utils";
import type { RangePreset } from "../types";

/**
 * The one shared date range every report on the screen reads from.
 *
 * Memoized on `preset` alone — `resolveRangePreset` calls `new Date()` for
 * "now", which differs by a few milliseconds on every call. Without the
 * memo, every render mints a structurally new `{from, to}`, every query
 * built from it looks like a brand-new input, and each of the five reports
 * restarts its fetch before the last one can ever settle.
 */
export function useSpendingRange() {
  const [preset, setPreset] = useState<RangePreset>("thisMonth");
  const range = useMemo(() => resolveRangePreset(preset), [preset]);
  return { preset, setPreset, range };
}
