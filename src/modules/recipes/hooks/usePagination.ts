"use client";

import { useCallback, useState } from "react";

/** Well under the server-side cap of 100, and a clean multiple of the 3-col grid. */
const DEFAULT_PAGE_SIZE = 12;

/** Offset-based paging (skip/take). Module-local until a second screen needs it. */
export function usePagination({ pageSize = DEFAULT_PAGE_SIZE }: { pageSize?: number } = {}) {
  const [skip, setSkip] = useState(0);

  const goToPrevious = () => setSkip((current) => Math.max(0, current - pageSize));
  const goToNext = () => setSkip((current) => current + pageSize);
  // Memoized so its identity stays stable for whatever consumer depends on it.
  const reset = useCallback(() => setSkip(0), []);

  return { skip, pageSize, goToPrevious, goToNext, reset };
}
