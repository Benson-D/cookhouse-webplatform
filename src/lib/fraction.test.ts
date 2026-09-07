import { toFractionLabel } from "./fraction";

describe("toFractionLabel", () => {
  it("returns whole numbers as-is", () => {
    expect(toFractionLabel(2)).toBe("2");
    expect(toFractionLabel(0)).toBe("0");
  });

  it("converts common kitchen fractions", () => {
    expect(toFractionLabel(0.125)).toBe("⅛");
    expect(toFractionLabel(0.25)).toBe("¼");
    expect(toFractionLabel(1 / 3)).toBe("⅓");
    expect(toFractionLabel(0.375)).toBe("⅜");
    expect(toFractionLabel(0.5)).toBe("½");
    expect(toFractionLabel(0.625)).toBe("⅝");
    expect(toFractionLabel(2 / 3)).toBe("⅔");
    expect(toFractionLabel(0.75)).toBe("¾");
    expect(toFractionLabel(0.875)).toBe("⅞");
  });

  it("combines a whole number with a fraction", () => {
    expect(toFractionLabel(1.75)).toBe("1¾");
    expect(toFractionLabel(2.5)).toBe("2½");
  });

  it("falls back to the plain decimal outside tolerance", () => {
    expect(toFractionLabel(0.6)).toBe("0.6");
    expect(toFractionLabel(0.2)).toBe("0.2");
  });

  it("snaps a near-match within tolerance to the nearest fraction", () => {
    expect(toFractionLabel(0.13)).toBe("⅛");
    expect(toFractionLabel(0.505)).toBe("½");
  });
});
