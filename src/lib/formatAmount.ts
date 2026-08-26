/** Trims a trailing `.0` so amounts read "3" and "2.5", never "3.0". */
function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

/**
 * An amount + unit as one string — "2.5 cups", "6", "400 g".
 *
 * Returns an em dash when there is no amount, never "0" — a null amount is a
 * real, valid state (a recipe's "salt, to taste"; a grocery-list line where
 * the household's recipes disagreed on units and the quantity was dropped
 * rather than guessed at), not missing data to paper over.
 *
 * Shared by the recipes and grocery-list modules — both render an
 * `amount`/`quantity` + `MeasurementUnit` pair the same way.
 */
export function formatAmount(
  amount: number | null | undefined,
  unit: { abbreviation?: string | null; name: string } | null | undefined
): string {
  if (amount === null || amount === undefined) {
    return "—";
  }
  const label = unit ? (unit.abbreviation ?? unit.name) : null;
  return label ? `${formatNumber(amount)} ${label}` : formatNumber(amount);
}
