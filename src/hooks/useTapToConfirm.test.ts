/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useTapToConfirm } from "./useTapToConfirm";

describe("useTapToConfirm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts not awaiting confirmation", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToConfirm(onConfirm));
    expect(result.current.awaitingConfirmation).toBe(false);
  });

  it("starts awaiting confirmation on the first tap without confirming", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToConfirm(onConfirm));
    act(() => result.current.handleTap());
    expect(result.current.awaitingConfirmation).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms and stops awaiting on a second tap while awaiting", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToConfirm(onConfirm));
    act(() => result.current.handleTap());
    act(() => result.current.handleTap());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.awaitingConfirmation).toBe(false);
  });

  it("stops awaiting after the timeout with no second tap", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToConfirm(onConfirm, 3000));
    act(() => result.current.handleTap());
    act(() => jest.advanceTimersByTime(3000));
    expect(result.current.awaitingConfirmation).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("a tap after the timeout starts awaiting again instead of confirming", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useTapToConfirm(onConfirm, 3000));
    act(() => result.current.handleTap());
    act(() => jest.advanceTimersByTime(3000));
    act(() => result.current.handleTap());
    expect(result.current.awaitingConfirmation).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
