import {
  getInitials,
  formatStartedDay,
  formatRelativeTime,
  shouldHideAmount,
  shouldHideUnitWord,
  formatSource,
  sortByIngredientName,
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

describe("shouldHideUnitWord", () => {
  it("hides count's generic base unit", () => {
    expect(shouldHideUnitWord({ type: "count", baseUnitId: null })).toBe(true);
  });

  it("shows a real derived count unit like dozen", () => {
    expect(shouldHideUnitWord({ type: "count", baseUnitId: "unit_piece" })).toBe(false);
  });

  it("shows volume and weight units regardless of baseUnitId", () => {
    expect(shouldHideUnitWord({ type: "volume", baseUnitId: null })).toBe(false);
    expect(shouldHideUnitWord({ type: "weight", baseUnitId: null })).toBe(false);
  });

  it("shows an item with no unit at all", () => {
    expect(shouldHideUnitWord(null)).toBe(false);
    expect(shouldHideUnitWord(undefined)).toBe(false);
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

describe("sortByIngredientName", () => {
  it("sorts A-Z by ingredient name", () => {
    const items = [{ ingredient: { name: "Zucchini" } }, { ingredient: { name: "Apple" } }];
    expect(sortByIngredientName(items).map((item) => item.ingredient.name)).toEqual([
      "Apple",
      "Zucchini",
    ]);
  });

  it("doesn't mutate the original array", () => {
    const items = [{ ingredient: { name: "Zucchini" } }, { ingredient: { name: "Apple" } }];
    sortByIngredientName(items);
    expect(items[0].ingredient.name).toBe("Zucchini");
  });
});
