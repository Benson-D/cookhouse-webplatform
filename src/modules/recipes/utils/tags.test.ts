import { groupTagsByType, splitMealTimeTags, labelForTagGroup } from "./tags";

type TestTag = { id: string; name: string; type?: string | null };

describe("groupTagsByType", () => {
  it("orders groups as meal_type, cuisine, diet, then other", () => {
    const tags: TestTag[] = [
      { id: "1", name: "Vegan", type: "diet" },
      { id: "2", name: "Italian", type: "cuisine" },
      { id: "3", name: "Breakfast", type: "meal_type" },
    ];
    const groups = groupTagsByType(tags);
    expect(groups.map((group) => group[0].type)).toEqual(["meal_type", "cuisine", "diet"]);
  });

  it("puts an unrecognised type in a trailing group instead of dropping it", () => {
    const tags: TestTag[] = [{ id: "1", name: "Mystery", type: "seasonal" }];
    expect(groupTagsByType(tags)).toEqual([[{ id: "1", name: "Mystery", type: "seasonal" }]]);
  });

  it("groups a null or missing type the same way as an unrecognised one", () => {
    const tags: TestTag[] = [{ id: "1", name: "No type" }];
    expect(groupTagsByType(tags)).toEqual([[{ id: "1", name: "No type" }]]);
  });

  it("omits empty groups rather than returning them blank", () => {
    const tags: TestTag[] = [{ id: "1", name: "Italian", type: "cuisine" }];
    expect(groupTagsByType(tags)).toHaveLength(1);
  });
});

describe("splitMealTimeTags", () => {
  it("pulls out only breakfast/lunch/dinner meal_type tags for the quick row, without removing them from panelTags", () => {
    const tags: TestTag[] = [
      { id: "1", name: "breakfast", type: "meal_type" },
      { id: "2", name: "brunch", type: "meal_type" },
      { id: "3", name: "Italian", type: "cuisine" },
    ];
    const { mealTimeTags, panelTags } = splitMealTimeTags(tags);
    expect(mealTimeTags.map((tag) => tag.name)).toEqual(["breakfast"]);
    expect(panelTags.map((tag) => tag.name)).toEqual(["breakfast", "brunch", "Italian"]);
  });

  it("orders meal-time tags as breakfast, lunch, dinner regardless of input order", () => {
    const tags: TestTag[] = [
      { id: "1", name: "dinner", type: "meal_type" },
      { id: "2", name: "breakfast", type: "meal_type" },
      { id: "3", name: "lunch", type: "meal_type" },
    ];
    const { mealTimeTags } = splitMealTimeTags(tags);
    expect(mealTimeTags.map((tag) => tag.name)).toEqual(["breakfast", "lunch", "dinner"]);
  });
});

describe("labelForTagGroup", () => {
  it("labels the three known groups", () => {
    expect(labelForTagGroup("cuisine")).toBe("Cuisine");
    expect(labelForTagGroup("diet")).toBe("Diet");
    expect(labelForTagGroup("meal_type")).toBe("Meal type");
  });

  it("falls back to 'Other' for anything else, including null", () => {
    expect(labelForTagGroup("seasonal")).toBe("Other");
    expect(labelForTagGroup(null)).toBe("Other");
    expect(labelForTagGroup(undefined)).toBe("Other");
  });
});
