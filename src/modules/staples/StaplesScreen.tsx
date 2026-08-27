"use client";

import { ErrorState, LoadingState, SubpageHeader } from "@/components/common";
import { useStaples } from "./hooks/useStaples";
import { StapleRow } from "./components/StapleRow";
import { AddStapleRow } from "./components/AddStapleRow";

/** Its own route reached from the grocery list's source legend, not a modal — infrequent enough (set up once, not every trip) that it doesn't belong in the main list flow. */
export function StaplesScreen() {
  const {
    staples,
    isLoading,
    isError,
    error,
    refetch,
    addStaple,
    isAdding,
    addError,
    removeStaple,
  } = useStaples();

  if (isLoading) {
    return <LoadingState label="Loading staples…" rows={5} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load staples"
        message={error?.message}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <SubpageHeader
        backHref="/grocery-list"
        backLabel="Back to list"
        title="Manage staples"
        right={
          <span className="tabular font-mono text-xs text-ink-faint">
            {staples.length} staple{staples.length === 1 ? "" : "s"}
          </span>
        }
      />

      <div className="px-[22px] pb-6 pt-4">
        {staples.length > 0 && (
          <ul className="m-0 flex list-none flex-col p-0">
            {staples.map((staple) => (
              <StapleRow key={staple.id} staple={staple} onRemove={() => removeStaple(staple.id)} />
            ))}
          </ul>
        )}

        <AddStapleRow
          existingStaples={staples}
          onAdd={(ingredientId, frequencyDays) => void addStaple(ingredientId, frequencyDays)}
          isAdding={isAdding}
        />

        {addError && (
          <p className="mt-2 text-[13px] text-[#B4442F]" role="alert">
            {addError.message}
          </p>
        )}
      </div>
    </div>
  );
}
