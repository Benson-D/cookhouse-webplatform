"use client";

import { useEffect, useRef, useState } from "react";
import type { PendingImage } from "../types";

/**
 * Files picked before a recipe exists, held in memory with object-URL
 * previews — no server involved, `useRecipeImages` decides when to buffer
 * here vs. upload immediately.
 */
export function usePendingImages() {
  const [pending, setPending] = useState<PendingImage[]>([]);

  // Mirrors `pending`'s latest value so the unmount effect can revoke
  // whatever's left (never removed, never flushed) without a stale closure.
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(
    () => () => {
      for (const item of pendingRef.current) URL.revokeObjectURL(item.previewUrl);
    },
    []
  );

  const add = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPending((current) => [
      ...current,
      { key: `${file.name}-${Date.now()}`, file, previewUrl },
    ]);
  };

  const remove = (key: string) => {
    const item = pendingRef.current.find((item) => item.key === key);
    if (!item) return;

    // Freed right away rather than waiting for unmount to hold it longer
    // than necessary.
    URL.revokeObjectURL(item.previewUrl);
    setPending((current) => current.filter((item) => item.key !== key));
  };

  const clear = () => {
    for (const item of pendingRef.current) URL.revokeObjectURL(item.previewUrl);
    setPending([]);
  };

  return { pending, add, remove, clear };
}
