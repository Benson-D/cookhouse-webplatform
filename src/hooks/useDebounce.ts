"use client";

import { useEffect, useState } from "react";

/** Trails `value` by `delay`, so typing in a search box isn't one query per keystroke. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
