import { z } from "zod";

/**
 * Form schemas for the recipe create/edit flow.
 *
 * These deliberately do **not** reuse the backend's `createRecipeInput`
 * directly. That schema describes the wire shape — numbers are numbers, an
 * ingredient is already an id. A form field holds a *string* that may be
 * blank, and an ingredient starts as typed text needing resolution to a
 * canonical row. So these mirror the backend's rules while accepting what
 * inputs actually produce, and `toCreateInput` / `toUpdateInput` convert.
 *
 * Every numeric field is therefore `string in → number | undefined out`. That
 * split is why the form is typed on two parameters: `RecipeFormInput` is what
 * the fields hold and what `register` writes, `RecipeFormValues` is what the
 * submit handler receives after parsing. Collapsing them (via `z.coerce` or
 * `z.preprocess`, whose input type is `unknown`) is what makes
 * `zodResolver` fail to typecheck against `useForm`.
 */

const blank = (value: string) => value.trim() === "";

/** "" means "not given" — absent, not invalid. */
const optionalText = z.string().transform((value) => (blank(value) ? undefined : value.trim()));

const optionalInt = (message: string, min: number) =>
  z
    .string()
    .transform((value) => (blank(value) ? undefined : Number(value)))
    .refine((value) => value === undefined || (Number.isInteger(value) && value >= min), {
      message,
    });

const optionalPositiveNumber = z
  .string()
  .transform((value) => (blank(value) ? undefined : Number(value)))
  .refine((value) => value === undefined || (Number.isFinite(value) && value > 0), {
    message: "Must be more than zero",
  });

/** Phase 1 of the create flow: a name alone is enough to get an id. */
export const recipeNameSchema = z.object({
  name: z.string().trim().min(1, "Give the recipe a name"),
});

export type RecipeNameValues = z.infer<typeof recipeNameSchema>;

/**
 * `ingredientName` rides alongside the id purely so the row can render what
 * was picked without a second lookup; only the id is ever submitted.
 */
const ingredientRowSchema = z.object({
  ingredientId: z.string().min(1, "Pick an ingredient"),
  ingredientName: z.string(),
  unitId: optionalText,
  amount: optionalPositiveNumber,
  notes: optionalText,
});

const stepRowSchema = z.object({
  text: z.string().trim().min(1, "Describe this step"),
  timerSeconds: optionalInt("Must be a whole number of seconds", 0),
});

export const recipeFormSchema = z
  .object({
    name: z.string().trim().min(1, "Give the recipe a name"),
    description: optionalText,
    servings: optionalInt("Must be a whole number above zero", 1),
    prepTime: optionalInt("Must be a whole number of minutes", 0),
    cookingTime: optionalInt("Must be a whole number of minutes", 0),
    ingredients: z.array(ingredientRowSchema),
    instructions: z.array(stepRowSchema),
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    // `RecipeIngredient` is keyed on (recipeId, ingredientId), so the same
    // ingredient twice isn't a duplicate row — it's a primary-key collision
    // that fails the whole save. Caught here, on the offending row, rather
    // than surfacing as an opaque write error after submit.
    const seen = new Set<string>();
    values.ingredients.forEach((row, index) => {
      if (!row.ingredientId) return;
      if (seen.has(row.ingredientId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ingredients", index, "ingredientId"],
          message: `${row.ingredientName || "This ingredient"} is already listed — combine the amounts into one row`,
        });
        return;
      }
      seen.add(row.ingredientId);
    });
  });

/** What the fields hold: every scalar is a string. */
export type RecipeFormInput = z.input<typeof recipeFormSchema>;
/** What the submit handler receives: parsed and validated. */
export type RecipeFormValues = z.output<typeof recipeFormSchema>;

/**
 * Maps parsed form values onto the API's shape.
 *
 * Step numbers are derived from position rather than held in the form: the
 * ordering *is* the numbering, and a separate field would let the two
 * disagree after a reorder.
 */
function toRecipeFields(values: RecipeFormValues) {
  return {
    name: values.name,
    description: values.description,
    servings: values.servings,
    prepTime: values.prepTime,
    cookingTime: values.cookingTime,
    instructions: values.instructions.map((step, index) => ({
      step: index + 1,
      text: step.text,
      ...(step.timerSeconds !== undefined && {
        timerSeconds: step.timerSeconds,
      }),
    })),
    ingredients: values.ingredients.map((row) => ({
      ingredientId: row.ingredientId,
      unitId: row.unitId,
      amount: row.amount,
      notes: row.notes,
    })),
    tagIds: values.tagIds,
  };
}

export function toCreateInput(values: RecipeFormValues) {
  return toRecipeFields(values);
}

export function toUpdateInput(id: string, values: RecipeFormValues) {
  return { id, ...toRecipeFields(values) };
}

/** The blank form. Strings throughout, because that's what the inputs hold. */
export const emptyRecipeForm: RecipeFormInput = {
  name: "",
  description: "",
  servings: "",
  prepTime: "",
  cookingTime: "",
  ingredients: [],
  instructions: [],
  tagIds: [],
};

/**
 * Loads an existing recipe back into form values.
 *
 * Numbers become strings and nulls become "" — the inputs are text inputs, and
 * a null would render the literal word "null" in the field.
 */
export function fromRecipeDetail(
  recipe: {
    name: string;
    description: string | null;
    servings: number | null;
    prepTime: number | null;
    cookingTime: number | null;
    ingredients: {
      ingredientId: string;
      unitId: string | null;
      amount: number | null;
      notes: string | null;
      ingredient: { name: string };
    }[];
    tags: { tag: { id: string } }[];
  },
  instructions: { text: string; timerSeconds?: number }[]
): RecipeFormInput {
  const text = (value: string | number | null | undefined) =>
    value === null || value === undefined ? "" : String(value);

  return {
    name: recipe.name,
    description: text(recipe.description),
    servings: text(recipe.servings),
    prepTime: text(recipe.prepTime),
    cookingTime: text(recipe.cookingTime),
    ingredients: recipe.ingredients.map((row) => ({
      ingredientId: row.ingredientId,
      ingredientName: row.ingredient.name,
      unitId: text(row.unitId),
      amount: text(row.amount),
      notes: text(row.notes),
    })),
    instructions: instructions.map((step) => ({
      text: step.text,
      timerSeconds: text(step.timerSeconds),
    })),
    tagIds: recipe.tags.map(({ tag }) => tag.id),
  };
}
