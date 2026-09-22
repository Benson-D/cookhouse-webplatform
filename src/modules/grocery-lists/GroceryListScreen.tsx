"use client";

import { useSyncExternalStore } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/common";
import { useGroceryList } from "./hooks/useGroceryList";
import { useCheckGroceryItem } from "./hooks/useCheckGroceryItem";
import { useRemoveGroceryItem } from "./hooks/useRemoveGroceryItem";
import { useCompleteGroceryList } from "./hooks/useCompleteGroceryList";
import { useClearGroceryList } from "./hooks/useClearGroceryList";
import { useSetGroceryCategoryOverride } from "./hooks/useSetGroceryCategoryOverride";
import { GroceryListHeader } from "./components/GroceryListHeader";
import { QuickAddItem } from "./components/QuickAddItem";
import { GroceryListRow } from "./components/GroceryListRow";
import { CategorizedGroceryList } from "./components/CategorizedGroceryList";
import { GroceryViewToggle, type GroceryListView } from "./components/GroceryViewToggle";
import { GroceryListFooter } from "./components/GroceryListFooter";
import { SourceLegend } from "./components/SourceLegend";
import { sortByDisplayName } from "./utils";

const VIEW_STORAGE_KEY = "cookhouse-grocery-view";
const viewListeners = new Set<() => void>();

/** Per-device only, same as `ThemeToggle` — a `useSyncExternalStore` read of `localStorage` rather than a setState-in-effect, so the server's default view and the client's first render never disagree. */
function subscribeView(onChange: () => void) {
  viewListeners.add(onChange);
  return () => viewListeners.delete(onChange);
}

function getViewSnapshot(): GroceryListView {
  return window.localStorage.getItem(VIEW_STORAGE_KEY) === "categories" ? "categories" : "list";
}

function getServerViewSnapshot(): GroceryListView {
  return "list";
}

function storeView(next: GroceryListView) {
  window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  viewListeners.forEach((listener) => listener());
}

/**
 * Logical component: composes the query and mutation hooks with the
 * module's presentational pieces. "Add from recipes" is real navigation now
 * (see `GroceryListHeader`), not a dialog, so there's no open/closed state
 * to own.
 */
export function GroceryListScreen() {
  const { list, isLoading, isError, error, refetch } = useGroceryList();
  const { setChecked } = useCheckGroceryItem();
  const { removeItem } = useRemoveGroceryItem();
  const { complete, isCompleting } = useCompleteGroceryList();
  const { removeAll, isRemovingAll } = useClearGroceryList();
  const { setCategoryOverride } = useSetGroceryCategoryOverride();

  const view = useSyncExternalStore(subscribeView, getViewSnapshot, getServerViewSnapshot);

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

      <QuickAddItem
        trailingContent={
          list.items.length > 0 && (
            <div className="mt-3 w-full md:mt-0 md:w-auto">
              <GroceryViewToggle view={view} onChange={storeView} />
            </div>
          )
        }
      />

      {list.items.length === 0 ? (
        <EmptyState
          title="Nothing on the list yet"
          message="Add an item, or pull in the ingredients from a few recipes."
        />
      ) : view === "categories" ? (
        <CategorizedGroceryList
          items={list.items}
          overrides={list.categoryOverrides}
          onToggle={setChecked}
          onRemove={removeItem}
          onMoveToCategory={setCategoryOverride}
        />
      ) : (
        <ul className="m-0 flex list-none flex-col px-[22px] pb-2">
          {sortByDisplayName(list.items).map((item) => (
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
