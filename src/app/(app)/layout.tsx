import type { ReactNode } from "react";
import { AppNav } from "@/components/common/AppNav";
import { HouseholdGate } from "@/modules/household/HouseholdGate";

/**
 * Chrome and the household gate for every household-scoped route — recipes,
 * grocery list, and (later) spending.
 *
 * The gate sits here rather than in each Screen so no household-scoped query
 * ever runs without an active organization. A route group rather than a
 * per-route layout, per the plan left when this was recipes-only: promote to
 * a shared wrapper once a second route needs the same thing, instead of
 * copying the layout file.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col">
      <AppNav />
      <HouseholdGate>{children}</HouseholdGate>
    </div>
  );
}
