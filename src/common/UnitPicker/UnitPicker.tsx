"use client";

import { useMemo, useState } from "react";
import { CHSelect } from "../CHSelect/CHSelect";

type Unit = { id: string; name: string; abbreviation: string | null };

/** Sentinel for "no unit" — a first-class, always-present option, not a special case in the picker. */
const NO_UNIT: Unit = { id: "", name: "no unit", abbreviation: "no unit" };

function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * A `CHSelect` wired to `MeasurementUnit`. Units are seeded reference data,
 * all loaded up front, so filtering is local rather than wired through
 * `onSearch`. No `onCreate` — units are seeded, not user-created.
 */
export function UnitPicker({
  unitId,
  units,
  onSelect,
  label,
}: {
  unitId: string;
  units: Unit[];
  onSelect: (unit: Unit) => void;
  label: string;
}) {
  const [query, setQuery] = useState("");

  const all = useMemo(() => [NO_UNIT, ...units], [units]);
  const options = query.trim()
    ? all.filter((unit) => matches(unit.abbreviation ?? unit.name, query))
    : all;
  const selected = units.find((unit) => unit.id === unitId) ?? NO_UNIT;

  return (
    <CHSelect<Unit>
      ariaLabel={label}
      placeholder="unit"
      value={selected}
      options={options}
      getOptionId={(unit) => unit.id || "none"}
      getOptionLabel={(unit) => unit.abbreviation ?? unit.name}
      onSearch={setQuery}
      onSelect={onSelect}
    />
  );
}
