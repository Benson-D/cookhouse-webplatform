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
    .filter((entry): entry is Instruction => {
      const isInstruction =
        typeof entry === "object" &&
        entry !== null &&
        "text" in entry &&
        typeof entry.text === "string";
      return isInstruction;
    })
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

/**
 * The form's own shape: one flat list, where a `heading` item applies to
 * every `step` item below it until the next `heading`. Two variants, same
 * split as the rest of this form — `Input` is what the fields hold
 * (`timerSeconds` a string), `Values` is what submit receives after zod
 * parses it (`timerSeconds` a number).
 */
export type InstructionItemInput =
  { type: "heading"; text: string } | { type: "step"; text: string; timerSeconds: string };

export type InstructionItemValues =
  { type: "heading"; text: string } | { type: "step"; text: string; timerSeconds?: number };

/** Loads a stored recipe's instructions into the form's flat heading/step list. */
export function transformDataToForm(instructions: Instruction[]): InstructionItemInput[] {
  const items: InstructionItemInput[] = [];

  for (const instruction of instructions) {
    if (instruction.heading !== undefined) {
      items.push({ type: "heading", text: instruction.heading });
    }

    items.push({
      type: "step",
      text: instruction.text,
      timerSeconds: instruction.timerSeconds === undefined ? "" : String(instruction.timerSeconds),
    });
  }

  return items;
}

/**
 * The reverse, for submit: flattens the form's heading/step list back into
 * the stored shape, `heading` landing on the section's first step. A
 * heading with a blank title, or nothing but other headings after it, just
 * contributes nothing — the same harmless, dropped treatment as a heading
 * nobody's put a step under yet.
 */
type StoredInstruction = Omit<Instruction, "step">;

export function transformFormToData(formItems: InstructionItemValues[]): StoredInstruction[] {
  const instructions: StoredInstruction[] = [];
  let heading: string | undefined;

  for (const item of formItems) {
    if (item.type === "heading") {
      heading = item.text.trim() || undefined;
      continue;
    }

    const instruction: StoredInstruction = {
      text: item.text,
    };

    if (item.timerSeconds !== undefined) {
      instruction.timerSeconds = item.timerSeconds;
    }

    if (heading) {
      instruction.heading = heading;
    }

    instructions.push(instruction);
    heading = undefined;
  }

  return instructions;
}

/** Step numbers restart at 1 after every `heading` item; headings themselves get none. */
export function getStepNumbers(items: { type: "heading" | "step" }[]): (number | null)[] {
  const numbers: (number | null)[] = [];
  let counter = 0;

  for (const item of items) {
    if (item.type === "heading") {
      counter = 0;
      numbers.push(null);
    } else {
      counter += 1;
      numbers.push(counter);
    }
  }

  return numbers;
}

/** Step timers render as "1:00" / "20:00". */
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
