"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_TIMEOUT_MS = 3000;

/**
 * Two-tap confirm in place of `window.confirm()`, styled like the rest of
 * the app. First tap awaits confirmation (auto-cancels after `timeoutMs`);
 * a second tap confirms.
 */
export function useTapToConfirm(onConfirm: () => void, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only fires on unmount — handleTap() clears it on every real transition
  // (starting to await, confirming), so this is just the "navigated away
  // mid-wait" case.
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  function handleTap() {
    if (!awaitingConfirmation) {
      setAwaitingConfirmation(true);
      resetTimer.current = setTimeout(() => setAwaitingConfirmation(false), timeoutMs);
      return;
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    setAwaitingConfirmation(false);
    onConfirm();
  }

  return { awaitingConfirmation, handleTap };
}
