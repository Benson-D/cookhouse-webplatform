"use client";

import { cn } from "@/lib/cn";
import { useTapToConfirm } from "@/hooks/useTapToConfirm";
import { formatRelativeTime, getInitials } from "../utils";
import type { GroceryList } from "../types";

/**
 * Remove all lives here, not as a header button, since it's destructive and
 * rarely used. Tap-to-confirm replaces `window.confirm()` so the prompt matches
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
  const { awaitingConfirmation, handleTap } = useTapToConfirm(onRemoveAll);

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
            last edited by {getInitials(lastEdited.by)} ·{" "}
            {formatRelativeTime(new Date(lastEdited.at))}
          </span>
        )}

        {totalCount > 0 && (
          <button
            type="button"
            onClick={handleTap}
            disabled={isRemovingAll}
            className={cn(
              "cursor-pointer underline decoration-1 underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
              awaitingConfirmation ? "font-semibold text-danger" : "hover:text-ink-soft"
            )}
          >
            {isRemovingAll
              ? "Removing…"
              : awaitingConfirmation
                ? "Tap again to remove all →"
                : "Remove all"}
          </button>
        )}
      </div>
    </div>
  );
}
