import { parseInstructions, formatTimer } from "./instructions";

describe("parseInstructions", () => {
  it("returns an empty array for anything that isn't an array", () => {
    expect(parseInstructions(null)).toEqual([]);
    expect(parseInstructions(undefined)).toEqual([]);
    expect(parseInstructions("not an array")).toEqual([]);
    expect(parseInstructions({})).toEqual([]);
  });

  it("parses well-formed entries", () => {
    const result = parseInstructions([
      { step: 1, text: "Preheat the oven" },
      { step: 2, text: "Add the pasta", timerSeconds: 600 },
    ]);
    expect(result).toEqual([
      { step: 1, text: "Preheat the oven", timerSeconds: undefined },
      { step: 2, text: "Add the pasta", timerSeconds: 600 },
    ]);
  });

  it("drops entries with no text", () => {
    const result = parseInstructions([{ step: 1 }, { step: 2, text: "Real step" }]);
    expect(result).toEqual([{ step: 2, text: "Real step", timerSeconds: undefined }]);
  });

  it("drops non-object entries", () => {
    const result = parseInstructions([null, "a string", 42, { step: 1, text: "Real step" }]);
    expect(result).toEqual([{ step: 1, text: "Real step", timerSeconds: undefined }]);
  });

  it("falls back to position when step is missing or not a number", () => {
    const result = parseInstructions([{ text: "First" }, { step: "two", text: "Second" }]);
    expect(result).toEqual([
      { step: 1, text: "First", timerSeconds: undefined },
      { step: 2, text: "Second", timerSeconds: undefined },
    ]);
  });

  it("ignores a non-number timerSeconds", () => {
    const result = parseInstructions([{ step: 1, text: "Step", timerSeconds: "long" }]);
    expect(result[0].timerSeconds).toBeUndefined();
  });

  it("sorts by step number, not by array order", () => {
    const result = parseInstructions([
      { step: 2, text: "Second" },
      { step: 1, text: "First" },
    ]);
    expect(result.map((entry) => entry.text)).toEqual(["First", "Second"]);
  });
});

describe("formatTimer", () => {
  it("formats seconds as m:ss", () => {
    expect(formatTimer(60)).toBe("1:00");
    expect(formatTimer(90)).toBe("1:30");
  });

  it("pads a single-digit remainder", () => {
    expect(formatTimer(65)).toBe("1:05");
  });

  it("handles zero", () => {
    expect(formatTimer(0)).toBe("0:00");
  });
});
