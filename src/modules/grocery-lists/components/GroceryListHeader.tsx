"use client";

import { useOrganization } from "@clerk/nextjs";
import { CHButton, CHLink } from "@/common";
import { formatStartedDay } from "../utils";

/**
 * Add item lives in the quick-add row below, not here. Household size comes
 * from Clerk's `useOrganization`, not a backend call.
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

      <div className="flex flex-wrap gap-[9px]">
        <CHLink variant="ghost" href="/grocery-list/add-from-recipes">
          Add from recipes
        </CHLink>
        <CHLink variant="ghost" href="/receipts/new">
          Scan receipt
        </CHLink>
        <CHButton variant="primary" onClick={onComplete} disabled={isCompleting}>
          {isCompleting ? "Completing…" : "Complete list"}
        </CHButton>
      </div>
    </div>
  );
}
