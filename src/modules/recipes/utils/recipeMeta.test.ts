import { formatDuration, formatTotalTime, formatRecipeMeta } from "./recipeMeta";

describe("formatDuration", () => {
  it("shows raw minutes under an hour", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("shows hours and minutes at or above an hour", () => {
    expect(formatDuration(75)).toBe("1hr 15min");
    expect(formatDuration(195)).toBe("3hr 15min");
  });

  it("drops the minutes half on an even hour", () => {
    expect(formatDuration(60)).toBe("1hr");
    expect(formatDuration(120)).toBe("2hr");
  });
});

describe("formatTotalTime", () => {
  it("adds prep and cooking time", () => {
    expect(formatTotalTime(10, 25)).toBe("35 min");
  });

  it("formats an hour or more as hr/min", () => {
    expect(formatTotalTime(30, 45)).toBe("1hr 15min");
  });

  it("treats a missing half as zero", () => {
    expect(formatTotalTime(null, 25)).toBe("25 min");
    expect(formatTotalTime(10, undefined)).toBe("10 min");
  });

  it("returns null when there's no time at all", () => {
    expect(formatTotalTime(null, null)).toBeNull();
    expect(formatTotalTime(0, 0)).toBeNull();
  });
});

describe("formatRecipeMeta", () => {
  it("combines time and servings with a middle dot", () => {
    expect(formatRecipeMeta({ prepTime: 10, cookingTime: 25, servings: 4 })).toBe(
      "35 min · serves 4"
    );
  });

  it("drops the time half when there's none", () => {
    expect(formatRecipeMeta({ prepTime: null, cookingTime: null, servings: 4 })).toBe("serves 4");
  });

  it("drops the servings half when there's none", () => {
    expect(formatRecipeMeta({ prepTime: 10, cookingTime: 25, servings: null })).toBe("35 min");
  });

  it("returns an empty string when there's nothing to show", () => {
    expect(formatRecipeMeta({ prepTime: null, cookingTime: null, servings: null })).toBe("");
  });
});
