"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatRelativeTime, initials } from "../utils";
import type { GroceryList } from "../types";

/** How long a first tap stays armed before it silently resets. */
const ARM_TIMEOUT_MS = 3000;

/**
 * Remove all lives here, not as a header button, since it's destructive and
 * rarely used. Tap-to-arm replaces `window.confirm()` so the prompt matches
 * the app's theme instead of blocking with a native popup.
 */
export function GroceryListFooter({
  checkedCount,
  totalCount,
  lastEdited,
  onRemoveAll,
  isRemovingAll,
}: {
  checkedCount: number;
  totalCount: number;
  lastEdited: GroceryList["lastEdited"];
  onRemoveAll: () => void;
  isRemovingAll: boolean;
}) {
  const [armed, setArmed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only fires on unmount — the click handler below clears it on every real
  // transition (arming, firing), so this is just the "navigated away mid-arm" case.
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      resetTimer.current = setTimeout(() => setArmed(false), ARM_TIMEOUT_MS);
      return;
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    setArmed(false);
    onRemoveAll();
  }

  return (
    <div className="flex items-center justify-between border-t border-line-soft px-[22px] py-3 font-mono text-xs text-ink-faint">
      <span>
        {checkedCount} of {totalCount} checked
      </span>

      <div className="flex items-center gap-4">
        {lastEdited && (
          // `at` arrives as an ISO string, not a `Date` — this project's tRPC
          // setup has no superjson-style transformer, so every date crosses
          // the wire as JSON's plain string form.
          <span>
            last edited by {initials(lastEdited.by)} ·{" "}
            {formatRelativeTime(new Date(lastEdited.at))}
          </span>
        )}

        {totalCount > 0 && (
          <button
            type="button"
            onClick={handleClick}
            disabled={isRemovingAll}
            className={cn(
              "cursor-pointer underline decoration-1 underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
              armed ? "font-semibold text-[#B4442F]" : "hover:text-ink-soft"
            )}
          >
            {isRemovingAll ? "Removing…" : armed ? "Tap again to remove all →" : "Remove all"}
          </button>
        )}
      </div>
    </div>
  );
}
