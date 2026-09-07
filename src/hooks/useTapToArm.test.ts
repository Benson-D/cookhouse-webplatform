/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useTapToArm } from "./useTapToArm";

describe("useTapToArm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts unarmed", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToArm(onConfirm));
    expect(result.current.armed).toBe(false);
  });

  it("arms on the first tap without confirming", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToArm(onConfirm));
    act(() => result.current.tap());
    expect(result.current.armed).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms and disarms on a second tap while armed", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToArm(onConfirm));
    act(() => result.current.tap());
    act(() => result.current.tap());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.armed).toBe(false);
  });

  it("auto-disarms after the timeout with no second tap", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToArm(onConfirm, 3000));
    act(() => result.current.tap());
    act(() => jest.advanceTimersByTime(3000));
    expect(result.current.armed).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("a tap after auto-disarm re-arms instead of confirming", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToArm(onConfirm, 3000));
    act(() => result.current.tap());
    act(() => jest.advanceTimersByTime(3000));
    act(() => result.current.tap());
    expect(result.current.armed).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
