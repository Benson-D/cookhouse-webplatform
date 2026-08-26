"use client";

import { OrganizationList } from "@clerk/nextjs";

/**
 * Shown when a signed-in user has no active household.
 *
 * `OrganizationList` covers both halves of the problem — joining one of your
 * existing households, or creating the first one — so this is a dead end the
 * user can always leave, which is the whole point of gating here rather than
 * letting every downstream query fail with FORBIDDEN.
 */
export function NoHouseholdScreen() {
  return (
    <div className="mx-auto flex w-full max-w-[62ch] flex-col gap-5 px-6 py-14">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Choose a household
        </p>
        <h1 className="m-0 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-ink">
          Recipes and lists belong to a household
        </h1>
        <p className="m-0 text-base text-ink-soft">
          Everything in Cookhouse — recipes, the shared grocery list, spending —
          is scoped to one household. Pick one to continue, or start a new one
          and invite the people you cook with.
        </p>
      </div>

      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/recipes"
        afterCreateOrganizationUrl="/recipes"
      />
    </div>
  );
}
