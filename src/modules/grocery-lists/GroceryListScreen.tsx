"use client";

import { EmptyState, ErrorState, LoadingState } from "@/common";
import { useGroceryList } from "./hooks/useGroceryList";
import { GroceryListHeader } from "./components/GroceryListHeader";
import { QuickAddItem } from "./components/QuickAddItem";
import { GroceryListRow } from "./components/GroceryListRow";
import { GroceryListFooter } from "./components/GroceryListFooter";
import { SourceLegend } from "./components/SourceLegend";
import { sortByIngredientName } from "./utils";

/**
 * Logical component: composes `useGroceryList` with the module's
 * presentational pieces. "Add from recipes" is real navigation now (see
 * `GroceryListHeader`), not a dialog, so there's no open/closed state to own.
 */
export function GroceryListScreen() {
  const {
    list,
    isLoading,
    isError,
    error,
    refetch,
    setChecked,
    removeItem,
    complete,
    isCompleting,
    removeAll,
    isRemovingAll,
  } = useGroceryList();

  if (isLoading) {
    return <LoadingState label="Loading your grocery list…" rows={6} />;
  }

  if (isError || !list) {
    return (
      <ErrorState
        title="Couldn't load the grocery list"
        message={error?.message}
        onRetry={() => void refetch()}
      />
    );
  }

  const checkedCount = list.items.filter((item) => item.checked).length;

  return (
    <div className="flex flex-col">
      <GroceryListHeader
        startedAt={list.createdAt}
        itemCount={list.items.length}
        onComplete={() => void complete()}
        isCompleting={isCompleting}
      />

      <QuickAddItem />

      {list.items.length === 0 ? (
        <EmptyState
          title="Nothing on the list yet"
          message="Add an item, or pull in the ingredients from a few recipes."
        />
      ) : (
        <ul className="m-0 flex list-none flex-col px-[22px] pb-2">
          {sortByIngredientName(list.items).map((item) => (
            <GroceryListRow
              key={item.id}
              item={item}
              onToggle={(checked) => setChecked(item.id, checked)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </ul>
      )}

      <GroceryListFooter
        checkedCount={checkedCount}
        totalCount={list.items.length}
        lastEdited={list.lastEdited}
        onRemoveAll={removeAll}
        isRemovingAll={isRemovingAll}
      />

      <SourceLegend />
    </div>
  );
}
