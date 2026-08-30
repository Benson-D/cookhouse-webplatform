"use client";

import { useMemo, useState } from "react";
import { CHSelect } from "../CHSelect";

type Unit = { id: string; name: string; abbreviation: string | null };

/** Sentinel for "no unit" — a first-class, always-present option, not a special case in the picker. */
const NO_UNIT: Unit = { id: "", name: "no unit", abbreviation: "no unit" };

function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * A `CHSelect` wired specifically to `MeasurementUnit` — units are seeded
 * reference data (~16 rows, all loaded up front), so unlike an ingredient
 * field there's no server round trip to wire through `onSearch`; filtering is
 * local. Owns its own query text, so several of these on one screen (a
 * recipe's ingredient rows, a grocery item form) can't filter each other.
 *
 * Pick-only: no `onCreate`, so `CHSelect` never renders a "create" row —
 * units are seeded, not user-created.
 *
 * Promoted here once the grocery-list module needed the same thing the
 * recipe form's ingredient rows already had.
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
      label={label}
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
