"use client";

import { useOrganization } from "@clerk/nextjs";
import { CHButton, CHLink } from "@/common";
import { cn } from "@/lib/cn";
import { useTapToConfirm } from "@/hooks/useTapToConfirm";
import { formatStartedDay } from "../utils";

/**
 * Add item lives in the quick-add row below, not here. Household size comes
 * from Clerk's `useOrganization`, not a backend call. Complete list is
 * tap-to-confirm, same as Remove all and Delete recipe, since completing is
 * hard to undo — the very next fetch archives this list for good.
 */
export function GroceryListHeader({
  startedAt,
  itemCount,
  onComplete,
  isCompleting,
}: {
  /** ISO string, as it arrives over the wire — this project's tRPC setup has no Date-reviving transformer. */
  startedAt: string;
  itemCount: number;
  onComplete: () => void;
  isCompleting: boolean;
}) {
  const { organization } = useOrganization();
  const memberCount = organization?.membersCount;
  const { awaitingConfirmation, handleTap } = useTapToConfirm(onComplete);

  const subtitle = [
    formatStartedDay(new Date(startedAt)),
    `${itemCount} item${itemCount === 1 ? "" : "s"}`,
    memberCount ? `shared with ${memberCount}` : null,
  ]
    .filter((part): part is string => part !== null)
    .join(" · ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
      <div className="flex flex-col gap-0.5">
        <h1 className="m-0 font-display text-[19px] font-semibold text-ink">Current list</h1>
        <span className="tabular font-mono text-[11.5px] text-ink-faint">{subtitle}</span>
      </div>

      <div className="flex w-full flex-col gap-[9px] md:w-auto md:flex-row md:flex-wrap">
        <CHLink
          variant="ghost"
          href="/grocery-list/add-from-recipes"
          className="w-full text-center md:w-auto"
        >
          Add from recipes
        </CHLink>
        <CHLink variant="ghost" href="/receipts/new" className="w-full text-center md:w-auto">
          Scan receipt
        </CHLink>
        <CHButton
          variant="primary"
          onClick={handleTap}
          disabled={isCompleting || itemCount === 0}
          className={cn(
            "w-full text-center md:w-auto",
            awaitingConfirmation && "border-danger bg-transparent text-danger hover:bg-transparent"
          )}
        >
          {isCompleting
            ? "Completing…"
            : awaitingConfirmation
              ? "Tap again to complete →"
              : "Complete list"}
        </CHButton>
      </div>
    </div>
  );
}
