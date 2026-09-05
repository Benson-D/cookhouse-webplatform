/**
 * Common kitchen fractions — halves, thirds, quarters, eighths — matched
 * within a small tolerance to absorb float noise. An amount that doesn't
 * land near one of these (an arbitrary decimal like 0.6) falls back to the
 * plain number instead of forcing a wrong-looking fraction.
 */
const KITCHEN_FRACTIONS = [
  { value: 1 / 8, label: "⅛" },
  { value: 1 / 4, label: "¼" },
  { value: 1 / 3, label: "⅓" },
  { value: 3 / 8, label: "⅜" },
  { value: 1 / 2, label: "½" },
  { value: 5 / 8, label: "⅝" },
  { value: 2 / 3, label: "⅔" },
  { value: 3 / 4, label: "¾" },
  { value: 7 / 8, label: "⅞" },
];

const FRACTION_TOLERANCE = 0.01;

/**
 * "1.75" → "1¾", using real Unicode vulgar-fraction characters rather than
 * "3/4" text — one codepoint, renders correctly in any font, no font-feature
 * dependency. Purely cosmetic: nothing re-parses this string as a number, so
 * it's never round-tripped back through `Number()`.
 */
export function toFractionLabel(amount: number): string {
  const whole = Math.floor(amount);
  const fractional = amount - whole;

  if (fractional < FRACTION_TOLERANCE) {
    return String(whole);
  }

  const match = KITCHEN_FRACTIONS.find(
    (candidate) => Math.abs(candidate.value - fractional) < FRACTION_TOLERANCE
  );
  if (!match) {
    return Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(2)));
  }

  return whole > 0 ? `${whole}${match.label}` : match.label;
}
