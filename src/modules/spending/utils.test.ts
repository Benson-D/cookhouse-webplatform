import {
  resolveRangePreset,
  monthKeyToRange,
  formatMonthShort,
  formatMonthLong,
  formatCurrency,
  formatRangeLabel,
} from "./utils";

describe("resolveRangePreset", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 2, 15, 12)); // Mar 15, 2026
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("thisMonth starts on the 1st and ends now", () => {
    const { from, to } = resolveRangePreset("thisMonth");
    expect(from).toEqual(new Date(2026, 2, 1));
    expect(to).toEqual(new Date(2026, 2, 15, 12));
  });

  it("lastMonth spans the full previous calendar month", () => {
    const { from, to } = resolveRangePreset("lastMonth");
    expect(from).toEqual(new Date(2026, 1, 1));
    expect(to.getMonth()).toBe(1);
    expect(to.getDate()).toBe(28);
  });

  it("thisYear starts January 1st", () => {
    expect(resolveRangePreset("thisYear").from).toEqual(new Date(2026, 0, 1));
  });

  it("trailing presets start the right number of months back, including the current month", () => {
    expect(resolveRangePreset("3mo").from).toEqual(new Date(2026, 0, 1));
    expect(resolveRangePreset("6mo").from).toEqual(new Date(2025, 9, 1));
    expect(resolveRangePreset("9mo").from).toEqual(new Date(2025, 6, 1));
    expect(resolveRangePreset("12mo").from).toEqual(new Date(2025, 3, 1));
  });
});

describe("monthKeyToRange", () => {
  it("spans the first through last instant of the given month", () => {
    const { from, to } = monthKeyToRange("2026-02");
    expect(from).toEqual(new Date(2026, 1, 1));
    expect(to.getMonth()).toBe(1);
    expect(to.getDate()).toBe(28);
  });
});

describe("formatMonthShort", () => {
  it("formats as a three-letter month", () => {
    expect(formatMonthShort("2026-03")).toBe("Mar");
  });
});

describe("formatMonthLong", () => {
  it("formats as a full month name and year", () => {
    expect(formatMonthLong("2026-03")).toBe("March 2026");
  });
});

describe("formatCurrency", () => {
  it("formats as a dollar amount with two decimals", () => {
    expect(formatCurrency(42)).toBe("$42.00");
    expect(formatCurrency(42.5)).toBe("$42.50");
  });
});

describe("formatRangeLabel", () => {
  it("collapses the month when both dates fall in the same one", () => {
    expect(formatRangeLabel(new Date(2026, 7, 1), new Date(2026, 7, 23))).toBe("Aug 1–23, 2026");
  });

  it("shows both months when the range spans more than one", () => {
    expect(formatRangeLabel(new Date(2026, 2, 1), new Date(2026, 7, 23))).toBe(
      "Mar 1, 2026–Aug 23, 2026"
    );
  });
});
