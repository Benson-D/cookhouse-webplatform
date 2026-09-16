/** Parsed shape of `Recipe.instructions`, which Prisma types only as `Json`. */
export type Instruction = {
  step: number;
  text: string;
  timerSeconds?: number;
  /** Starts a new named section at this step — some recipes are really two or three sub-recipes in sequence. */
  heading?: string;
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
      heading: typeof entry.heading === "string" ? entry.heading : undefined,
    }))
    .sort((a, b) => a.step - b.step);
}

export type InstructionGroup = { heading?: string; items: Instruction[] };

/**
 * Splits a flat instruction list into sections: a new group starts at every
 * step carrying a `heading`, and numbering restarts within each group. An
 * unheaded recipe stays one continuous group. Display-only — `step` itself
 * stays exactly as stored (continuous, position-derived).
 */
export function groupByHeading(instructions: Instruction[]): InstructionGroup[] {
  const groups: InstructionGroup[] = [];

  for (const instruction of instructions) {
    if (instruction.heading !== undefined || groups.length === 0) {
      groups.push({ heading: instruction.heading, items: [] });
    }
    groups[groups.length - 1].items.push(instruction);
  }

  return groups;
}

/** Step timers render as "1:00" / "20:00". */
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
