"use client";

import type { ReactNode } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { CHButton, EmptyState, LoadingState } from "@/common";
import { NoHouseholdScreen } from "./components/NoHouseholdScreen";

/**
 * Blocks household-scoped features until the session actually has an active
 * Clerk Organization.
 *
 * Every recipe and grocery-list procedure is a `householdProcedure`, which
 * throws `FORBIDDEN: Select a household to continue` without one. Catching
 * that here — before any query runs — is what stops the condition surfacing as
 * a generic error on every screen at once.
 */
export function HouseholdGate({ children }: { children: ReactNode }) {
  const { isLoaded, userId, orgId } = useAuth();

  if (!isLoaded) {
    return <LoadingState label="Checking your household…" />;
  }

  if (!userId) {
    return (
      <EmptyState
        title="Sign in to continue"
        message="Cookhouse keeps your household's recipes and lists behind an account."
        action={
          <SignInButton mode="modal">
            <CHButton variant="primary">Sign in</CHButton>
          </SignInButton>
        }
      />
    );
  }

  if (!orgId) {
    return <NoHouseholdScreen />;
  }

  return <>{children}</>;
}
