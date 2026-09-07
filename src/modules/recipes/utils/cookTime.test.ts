import { formatCookTimeFilter } from "./cookTime";

describe("formatCookTimeFilter", () => {
  it("labels the four known presets", () => {
    expect(formatCookTimeFilter(20)).toBe("Under 20 min");
    expect(formatCookTimeFilter(30)).toBe("Under 30 min");
    expect(formatCookTimeFilter(45)).toBe("Under 45 min");
    expect(formatCookTimeFilter(60)).toBe("Under 1hr");
  });

  it("falls back to a plain minute count outside the four presets", () => {
    expect(formatCookTimeFilter(15)).toBe("Under 15 min");
  });
});
