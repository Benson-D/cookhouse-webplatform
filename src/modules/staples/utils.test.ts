import { formatFrequency, computeDueStatus } from "./utils";

describe("formatFrequency", () => {
  it("labels the four known frequencies", () => {
    expect(formatFrequency(7)).toBe("Weekly");
    expect(formatFrequency(14)).toBe("Every 2 weeks");
    expect(formatFrequency(30)).toBe("Monthly");
    expect(formatFrequency(60)).toBe("Every 2 months");
  });

  it("falls back to a plain day count outside the four presets", () => {
    expect(formatFrequency(10)).toBe("Every 10 days");
  });
});

describe("computeDueStatus", () => {
  const now = new Date(2026, 0, 15);

  it("reads as due now with a warn tone when never added", () => {
    expect(computeDueStatus(null, 7, now)).toEqual({
      lastAddedLabel: "never added yet",
      statusLabel: "due now",
      tone: "warn",
    });
  });

  it("reads overdue with a late tone past the frequency window", () => {
    const status = computeDueStatus(new Date(2026, 0, 1), 7, now);
    expect(status.statusLabel).toBe("overdue by 7 days");
    expect(status.tone).toBe("late");
  });

  it("reads due today with a warn tone right at the boundary", () => {
    const status = computeDueStatus(new Date(2026, 0, 8), 7, now);
    expect(status.statusLabel).toBe("due today");
    expect(status.tone).toBe("warn");
  });

  it("reads due tomorrow with a warn tone one day before the boundary", () => {
    const status = computeDueStatus(new Date(2026, 0, 9), 7, now);
    expect(status.statusLabel).toBe("due tomorrow");
    expect(status.tone).toBe("warn");
  });

  it("reads due in N days with a default tone well before the boundary", () => {
    const status = computeDueStatus(new Date(2026, 0, 12), 7, now);
    expect(status.statusLabel).toBe("due in 4 days");
    expect(status.tone).toBe("default");
  });

  it("singularizes the last-added label at exactly one day", () => {
    expect(computeDueStatus(new Date(2026, 0, 14), 7, now).lastAddedLabel).toBe(
      "last added 1 day ago"
    );
  });

  it("pluralizes the last-added label otherwise", () => {
    expect(computeDueStatus(new Date(2026, 0, 1), 7, now).lastAddedLabel).toBe(
      "last added 14 days ago"
    );
  });
});
