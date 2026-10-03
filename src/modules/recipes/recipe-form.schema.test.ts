import { emptyRecipeForm, recipeFormSchema, type RecipeFormInput } from "./recipe-form.schema";

const form = (overrides: Partial<RecipeFormInput> = {}): RecipeFormInput => ({
  ...emptyRecipeForm,
  name: "Dal",
  ...overrides,
});

const ingredientRow = (ingredientId: string, ingredientName: string, amount = "1") => ({
  ingredientId,
  ingredientName,
  unitId: "",
  amount,
  notes: "",
});

const issueAt = (input: RecipeFormInput, path: (string | number)[]) => {
  const result = recipeFormSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path.join(".") === path.join("."))?.message;
};

describe("recipeFormSchema", () => {
  it("turns blank optional fields into undefined and numeric strings into numbers", () => {
    const parsed = recipeFormSchema.parse(form({ description: "  ", servings: "4", prepTime: "" }));
    expect(parsed.description).toBeUndefined();
    expect(parsed.servings).toBe(4);
    expect(parsed.prepTime).toBeUndefined();
  });

  it("requires a name, after trimming", () => {
    expect(issueAt(form({ name: "   " }), ["name"])).toBe("Give the recipe a name");
  });

  it("rejects a non-whole servings count with its own message", () => {
    expect(issueAt(form({ servings: "2.5" }), ["servings"])).toBe(
      "Must be a whole number above zero"
    );
  });

  it("rejects an ingredient amount of zero", () => {
    const input = form({ ingredients: [ingredientRow("i1", "lentils", "0")] });
    expect(issueAt(input, ["ingredients", 0, "amount"])).toBe("Must be more than zero");
  });

  it("flags the second row of a duplicated ingredient, naming it", () => {
    const input = form({
      ingredients: [ingredientRow("i1", "lentils"), ingredientRow("i1", "lentils")],
    });
    expect(issueAt(input, ["ingredients", 1, "ingredientId"])).toBe(
      "lentils is already listed — combine the amounts into one row"
    );
  });

  it("parses headings and steps, requiring text only on steps", () => {
    const parsed = recipeFormSchema.parse(
      form({
        instructions: [
          { type: "heading", text: "" },
          { type: "step", text: "Rinse the lentils", timerSeconds: "90" },
        ],
      })
    );
    expect(parsed.instructions[1]).toEqual({
      type: "step",
      text: "Rinse the lentils",
      timerSeconds: 90,
    });

    const blankStep = form({ instructions: [{ type: "step", text: " ", timerSeconds: "" }] });
    expect(issueAt(blankStep, ["instructions", 0, "text"])).toBe("Describe this step");
  });
});
