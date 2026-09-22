import {
  getInitials,
  formatStartedDay,
  formatRelativeTime,
  shouldHideAmount,
  formatSource,
  displayName,
  sortByDisplayName,
  groupByCategory,
} from "./utils";

describe("getInitials", () => {
  it("combines first and last initials", () => {
    expect(getInitials({ firstName: "Dan", lastName: "Benson", email: "d@x.com" })).toBe("DB");
  });

  it("falls back to the email's first letter with no name", () => {
    expect(getInitials({ firstName: null, lastName: null, email: "z@x.com" })).toBe("Z");
  });

  it("returns an em dash for nobody", () => {
    expect(getInitials(null)).toBe("—");
  });
});

describe("formatStartedDay", () => {
  it("prefixes a weekday abbreviation with 'started'", () => {
    expect(formatStartedDay(new Date(2026, 0, 1))).toMatch(
      /^started (Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/
    );
  });
});

describe("formatRelativeTime", () => {
  const now = new Date(2026, 0, 1, 12, 0, 0);

  it("reads as 'just now' under a minute ago", () => {
    expect(formatRelativeTime(new Date(2026, 0, 1, 11, 59, 30), now)).toBe("just now");
  });

  it("reads in minutes under an hour ago", () => {
    expect(formatRelativeTime(new Date(2026, 0, 1, 11, 45), now)).toBe("15 min ago");
  });

  it("reads in hours under a day ago", () => {
    expect(formatRelativeTime(new Date(2026, 0, 1, 9), now)).toBe("3 hr ago");
  });

  it("reads in days beyond that", () => {
    expect(formatRelativeTime(new Date(2025, 11, 29, 12), now)).toBe("3 days ago");
  });
});

describe("shouldHideAmount", () => {
  it("hides volume- and weight-type units", () => {
    expect(shouldHideAmount({ type: "volume" })).toBe(true);
    expect(shouldHideAmount({ type: "weight" })).toBe(true);
  });

  it("shows count-type units", () => {
    expect(shouldHideAmount({ type: "count" })).toBe(false);
  });

  it("shows an item with no unit at all", () => {
    expect(shouldHideAmount(null)).toBe(false);
    expect(shouldHideAmount(undefined)).toBe(false);
  });
});

describe("formatSource", () => {
  it("labels the three known sources", () => {
    expect(formatSource("recipe")).toBe("recipe");
    expect(formatSource("staple")).toBe("staple");
    expect(formatSource("manual")).toBe("manual");
  });

  it("falls back to the raw value for an unknown source", () => {
    expect(formatSource("import")).toBe("import");
  });
});

describe("displayName", () => {
  it("reads the ingredient's name when there is one", () => {
    expect(displayName({ ingredient: { name: "Zucchini" }, label: null })).toBe("Zucchini");
  });

  it("falls back to the label when there's no matched ingredient", () => {
    expect(displayName({ ingredient: null, label: "soap" })).toBe("soap");
  });
});

describe("sortByDisplayName", () => {
  it("sorts A-Z by display name", () => {
    const items = [
      { ingredient: { name: "Zucchini" }, label: null, checked: false },
      { ingredient: { name: "Apple" }, label: null, checked: false },
    ];
    expect(sortByDisplayName(items).map(displayName)).toEqual(["Apple", "Zucchini"]);
  });

  it("sorts label-only rows alongside matched ones", () => {
    const items = [
      { ingredient: { name: "Zucchini" }, label: null, checked: false },
      { ingredient: null, label: "Blueberry granola", checked: false },
    ];
    expect(sortByDisplayName(items).map(displayName)).toEqual(["Blueberry granola", "Zucchini"]);
  });

  it("doesn't mutate the original array", () => {
    const items = [
      { ingredient: { name: "Zucchini" }, label: null, checked: false },
      { ingredient: { name: "Apple" }, label: null, checked: false },
    ];
    sortByDisplayName(items);
    expect(items[0].ingredient?.name).toBe("Zucchini");
  });

  it("pushes checked items to the bottom, each group still A-Z", () => {
    const items = [
      { ingredient: { name: "Apple" }, label: null, checked: true },
      { ingredient: { name: "Zucchini" }, label: null, checked: false },
      { ingredient: { name: "Milk" }, label: null, checked: true },
      { ingredient: { name: "Bread" }, label: null, checked: false },
    ];
    expect(sortByDisplayName(items).map(displayName)).toEqual([
      "Bread",
      "Zucchini",
      "Apple",
      "Milk",
    ]);
  });
});

describe("groupByCategory", () => {
  it("buckets items into fixed sections in fixed order, dropping empty ones", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Milk", category: "dairy" },
        checked: false,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Apple", category: "produce" },
        checked: false,
      },
    ];
    const { sections } = groupByCategory(items, []);
    expect(sections.map((s) => s.section)).toEqual(["Produce", "Dairy"]);
  });

  it("combines meat and seafood into one section", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Steak", category: "meat" },
        checked: false,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Shrimp", category: "seafood" },
        checked: false,
      },
    ];
    const { sections } = groupByCategory(items, []);
    expect(sections).toHaveLength(1);
    expect(sections[0]!.section).toBe("Meat & Seafood");
    expect(sections[0]!.items.map(displayName)).toEqual(["Shrimp", "Steak"]);
  });

  it("puts spices in their own section, separate from Pantry", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Cumin", category: "spice" },
        checked: false,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Flour", category: "pantry" },
        checked: false,
      },
    ];
    const { sections } = groupByCategory(items, []);
    expect(sections.map((s) => s.section)).toEqual(["Pantry", "Spices"]);
  });

  it("recognizes snacks, beverages, alcohol, and desserts as their own sections", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Chips", category: "snacks" },
        checked: false,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Soda", category: "beverages" },
        checked: false,
      },
      {
        ingredientId: "i3",
        label: null,
        ingredient: { name: "Beer", category: "alcohol" },
        checked: false,
      },
      {
        ingredientId: "i4",
        label: null,
        ingredient: { name: "Cookies", category: "desserts" },
        checked: false,
      },
    ];
    const { sections } = groupByCategory(items, []);
    expect(sections.map((s) => s.section)).toEqual(["Snacks", "Beverages", "Alcohol", "Desserts"]);
  });

  it("falls back to Uncategorized for no category or an unrecognized one", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Mystery", category: null },
        checked: false,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Soap", category: "cleaning" },
        checked: false,
      },
      { ingredientId: null, label: "Odd item", ingredient: null, checked: false },
    ];
    const { sections } = groupByCategory(items, []);
    expect(sections).toHaveLength(1);
    expect(sections[0]!.section).toBe("Uncategorized");
    expect(sections[0]!.items).toHaveLength(3);
  });

  it("prefers a household's override over the ingredient's own category", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Tofu", category: "chilled" },
        checked: false,
      },
    ];
    const { sections } = groupByCategory(items, [
      { ingredientId: "i1", label: null, category: "Pantry" },
    ]);
    expect(sections).toEqual([{ section: "Pantry", items: items }]);
  });

  it("matches a label-only item's override by its label text", () => {
    const items = [{ ingredientId: null, label: "Paper towels", ingredient: null, checked: false }];
    const { sections } = groupByCategory(items, [
      { ingredientId: null, label: "Paper towels", category: "Household" },
    ]);
    expect(sections[0]!.section).toBe("Household");
  });

  it("collects every checked item into one pile, regardless of category, sorted A-Z", () => {
    const items = [
      {
        ingredientId: "i1",
        label: null,
        ingredient: { name: "Zucchini", category: "produce" },
        checked: true,
      },
      {
        ingredientId: "i2",
        label: null,
        ingredient: { name: "Bread", category: "bakery" },
        checked: true,
      },
      {
        ingredientId: "i3",
        label: null,
        ingredient: { name: "Milk", category: "dairy" },
        checked: false,
      },
    ];
    const { sections, checkedOff } = groupByCategory(items, []);
    expect(sections).toEqual([{ section: "Dairy", items: [items[2]] }]);
    expect(checkedOff.map(displayName)).toEqual(["Bread", "Zucchini"]);
  });
});
