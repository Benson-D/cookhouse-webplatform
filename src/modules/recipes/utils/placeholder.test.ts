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
});
