/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useRecipeFilters } from "./useRecipeFilters";

describe("useRecipeFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with every filter empty and no active filters", () => {
    const { result } = renderHook(() => useRecipeFilters());
    expect(result.current.search).toBe("");
    expect(result.current.selectedTagIds).toEqual([]);
    expect(result.current.favoritesOnly).toBe(false);
    expect(result.current.maxCookingTime).toBeNull();
    expect(result.current.hasActiveFilters).toBe(false);
  });

  describe("search", () => {
    it("handleSearch updates search immediately", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleSearch("pasta"));
      expect(result.current.search).toBe("pasta");
    });

    it("debouncedSearch trails search until the debounce delay passes", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleSearch("pasta"));
      expect(result.current.debouncedSearch).toBe("");
      act(() => jest.advanceTimersByTime(300));
      expect(result.current.debouncedSearch).toBe("pasta");
    });
  });

  describe("tags", () => {
    it("handleToggleTag adds a tag not yet selected", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleToggleTag("tag-1"));
      expect(result.current.selectedTagIds).toEqual(["tag-1"]);
    });

    it("handleToggleTag removes a tag that's already selected", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleToggleTag("tag-1"));
      act(() => result.current.handleToggleTag("tag-1"));
      expect(result.current.selectedTagIds).toEqual([]);
    });

    it("handleClearTags empties every selected tag", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleToggleTag("tag-1"));
      act(() => result.current.handleToggleTag("tag-2"));
      act(() => result.current.handleClearTags());
      expect(result.current.selectedTagIds).toEqual([]);
    });
  });

  it("handleFavoritesOnlyChange updates favoritesOnly", () => {
    const { result } = renderHook(() => useRecipeFilters());
    act(() => result.current.handleFavoritesOnlyChange(true));
    expect(result.current.favoritesOnly).toBe(true);
  });

  it("handleMaxCookingTimeChange updates maxCookingTime", () => {
    const { result } = renderHook(() => useRecipeFilters());
    act(() => result.current.handleMaxCookingTimeChange(30));
    expect(result.current.maxCookingTime).toBe(30);
  });

  it("calls onChange on every filter change", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useRecipeFilters({ onChange }));
    act(() => result.current.handleSearch("pasta"));
    act(() => result.current.handleToggleTag("tag-1"));
    act(() => result.current.handleClearTags());
    act(() => result.current.handleFavoritesOnlyChange(true));
    act(() => result.current.handleMaxCookingTimeChange(30));
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  describe("hasActiveFilters", () => {
    it("is true once a search term is entered (after it debounces)", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleSearch("pasta"));
      act(() => jest.advanceTimersByTime(300));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("is true once a tag is selected", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleToggleTag("tag-1"));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("is true once favoritesOnly is on", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleFavoritesOnlyChange(true));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("is true once a max cooking time is set", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleMaxCookingTimeChange(30));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("ignores whitespace-only search, even once debounced", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleSearch("   "));
      act(() => jest.advanceTimersByTime(300));
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe("activeFilterCount", () => {
    it("counts selected tags plus a set max cooking time", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleToggleTag("tag-1"));
      act(() => result.current.handleToggleTag("tag-2"));
      act(() => result.current.handleMaxCookingTimeChange(30));
      expect(result.current.activeFilterCount).toBe(3);
    });

    it("ignores search and favoritesOnly, which have their own controls", () => {
      const { result } = renderHook(() => useRecipeFilters());
      act(() => result.current.handleSearch("pasta"));
      act(() => result.current.handleFavoritesOnlyChange(true));
      expect(result.current.activeFilterCount).toBe(0);
    });
  });
});
