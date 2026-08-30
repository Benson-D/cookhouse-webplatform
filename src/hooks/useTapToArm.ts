"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_TIMEOUT_MS = 3000;

/**
 * First `tap()` arms and silently disarms after `timeoutMs`; a second tap
 * while armed calls `onConfirm` and disarms immediately. Replaces
 * `window.confirm()` for destructive actions so the prompt matches the
 * app's own styling instead of a blocking native popup.
 */
export function useTapToArm(onConfirm: () => void, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const [armed, setArmed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only fires on unmount — tap() clears it on every real transition
  // (arming, firing), so this is just the "navigated away mid-arm" case.
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  function tap() {
    if (!armed) {
      setArmed(true);
      resetTimer.current = setTimeout(() => setArmed(false), timeoutMs);
      return;
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    setArmed(false);
    onConfirm();
  }

  return { armed, tap };
}
