/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("a"));
    expect(result.current).toBe("a");
  });

  it("doesn't update until the delay has passed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    expect(result.current).toBe("a");
  });

  it("updates to the latest value once the delay passes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("b");
  });

  it("only reflects the last value from a burst of rapid changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });
    rerender({ value: "ab" });
    rerender({ value: "abc" });
    rerender({ value: "abcd" });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("abcd");
  });

  it("respects a custom delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 1000), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("a");
    act(() => jest.advanceTimersByTime(700));
    expect(result.current).toBe("b");
  });
});
