import { placeholderGradient } from "./placeholder";

describe("placeholderGradient", () => {
  it("returns one of the known gradient strings", () => {
    expect(placeholderGradient("recipe-1")).toMatch(/^linear-gradient\(/);
  });

  it("doesn't throw on an empty id", () => {
    expect(() => placeholderGradient("")).not.toThrow();
  });

  it("stays the same for the same id across calls, without hashing it", () => {
    expect(placeholderGradient("recipe-2")).toBe(placeholderGradient("recipe-2"));
  });
});
