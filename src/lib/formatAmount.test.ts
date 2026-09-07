import { formatAmount } from "./formatAmount";

describe("formatAmount", () => {
  it("returns an em dash for a null or undefined amount", () => {
    expect(formatAmount(null, { name: "cup" })).toBe("—");
    expect(formatAmount(undefined, { name: "cup" })).toBe("—");
  });

  it("prefers the unit's abbreviation over its name", () => {
    expect(formatAmount(2, { abbreviation: "cup", name: "cup, US customary" })).toBe("2 cup");
  });

  it("falls back to the unit's name with no abbreviation", () => {
    expect(formatAmount(6, { name: "each" })).toBe("6 each");
  });

  it("omits the unit entirely when there is none", () => {
    expect(formatAmount(3, null)).toBe("3");
  });

  it("trims a trailing .0 off whole numbers", () => {
    expect(formatAmount(3, null)).toBe("3");
    expect(formatAmount(3.0, null)).toBe("3");
  });

  it("keeps decimals, rounded to two places", () => {
    expect(formatAmount(2.5, null)).toBe("2.5");
    expect(formatAmount(2.567, null)).toBe("2.57");
  });
});
