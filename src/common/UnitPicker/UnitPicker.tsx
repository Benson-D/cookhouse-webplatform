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
 * all loaded up front, so filtering happens locally against `onInputChange`
 * rather than a backend query. Never creatable — units are seeded, not
 * user-created.
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
  const [filterText, setFilterText] = useState("");

  const all = useMemo(() => [NO_UNIT, ...units], [units]);
  const options = filterText.trim()
    ? all.filter((unit) => matches(unit.abbreviation ?? unit.name, filterText))
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
      onInputChange={(event) => setFilterText(event.target.value)}
      onChange={(unit) => unit && onSelect(unit)}
    />
  );
}
