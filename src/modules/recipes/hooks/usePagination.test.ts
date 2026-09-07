/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("starts at skip 0 with the default page size", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.skip).toBe(0);
    expect(result.current.pageSize).toBe(12);
  });

  it("respects a custom page size", () => {
    const { result } = renderHook(() => usePagination({ pageSize: 5 }));
    expect(result.current.pageSize).toBe(5);
  });

  it("goToNext advances skip by one page", () => {
    const { result } = renderHook(() => usePagination({ pageSize: 5 }));
    act(() => result.current.goToNext());
    expect(result.current.skip).toBe(5);
  });

  it("goToPrevious retreats skip by one page", () => {
    const { result } = renderHook(() => usePagination({ pageSize: 5 }));
    act(() => result.current.goToNext());
    act(() => result.current.goToPrevious());
    expect(result.current.skip).toBe(0);
  });

  it("goToPrevious never goes below 0", () => {
    const { result } = renderHook(() => usePagination({ pageSize: 5 }));
    act(() => result.current.goToPrevious());
    expect(result.current.skip).toBe(0);
  });

  it("reset returns to skip 0 from anywhere", () => {
    const { result } = renderHook(() => usePagination({ pageSize: 5 }));
    act(() => result.current.goToNext());
    act(() => result.current.goToNext());
    act(() => result.current.reset());
    expect(result.current.skip).toBe(0);
  });

  it("reset keeps a stable identity across re-renders", () => {
    const { result, rerender } = renderHook(() => usePagination());
    const firstReset = result.current.reset;
    rerender();
    expect(result.current.reset).toBe(firstReset);
  });
});
