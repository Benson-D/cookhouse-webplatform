import { placeholderGradient } from "./placeholder";

describe("placeholderGradient", () => {
  it("returns the same gradient for the same seed every time", () => {
    expect(placeholderGradient("recipe-123")).toBe(placeholderGradient("recipe-123"));
  });

  it("returns one of the known gradient strings", () => {
    expect(placeholderGradient("anything")).toMatch(/^linear-gradient\(/);
  });

  it("doesn't throw on an empty seed", () => {
    expect(() => placeholderGradient("")).not.toThrow();
  });

  it("differs between at least some seeds, not one gradient for everything", () => {
    expect(placeholderGradient("recipe-a")).not.toBe(placeholderGradient("recipe-b"));
  });

  it("spreads across more than one gradient for recipes created back to back", () => {
    // Prisma cuids share a timestamp-derived prefix for anything created in
    // the same session, differing only in a short trailing portion.
    const ids = [
      "cm3x9f8a10000abc123xyz001",
      "cm3x9f8a10001abc123xyz002",
      "cm3x9f8a10002abc123xyz003",
      "cm3x9f8a10003abc123xyz004",
      "cm3x9f8a10004abc123xyz005",
      "cm3x9f8a10005abc123xyz006",
    ];
    const gradients = new Set(ids.map(placeholderGradient));
    expect(gradients.size).toBeGreaterThan(1);
  });
});
