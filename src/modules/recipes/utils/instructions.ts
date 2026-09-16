/** Parsed shape of `Recipe.instructions`, which Prisma types only as `Json`. */
export type Instruction = {
  step: number;
  text: string;
  timerSeconds?: number;
};

/**
 * `instructions` is a `Json` column, so it arrives as `unknown` and cannot be
 * trusted to be well-formed. Anything unrecognisable is dropped rather than
 * crashing the detail screen.
 */
export function parseInstructions(instructions: unknown): Instruction[] {
  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions
    .filter(
      (entry): entry is Instruction =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Instruction).text === "string"
    )
    .map((entry, index) => ({
      step: typeof entry.step === "number" ? entry.step : index + 1,
      text: entry.text,
      timerSeconds: typeof entry.timerSeconds === "number" ? entry.timerSeconds : undefined,
    }))
    .sort((a, b) => a.step - b.step);
}

/** Step timers render as "1:00" / "20:00". */
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
