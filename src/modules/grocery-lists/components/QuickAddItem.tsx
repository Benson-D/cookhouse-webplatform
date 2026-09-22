"use client";

import { useState, type ReactNode, type SubmitEvent } from "react";
import { CHButton } from "@/common";
import { useAddGroceryItem } from "../hooks/useAddGroceryItem";

/**
 * A quick-add field for putting an item on the grocery list by name alone,
 * no recipe involved. There's no ingredient or unit picker here — a name is
 * enough to add a row, and a quantity or unit can be filled in later without
 * changing the row's shape.
 */
export function QuickAddItem({ trailingContent }: { trailingContent?: ReactNode } = {}) {
  const [name, setName] = useState("");
  const { addByName, isAdding, error } = useAddGroceryItem();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    await addByName(trimmed);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 px-[22px] pb-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[180px] flex-1 items-center gap-[9px] rounded-lg border border-line bg-surface-2 px-3 py-2">
          <span aria-hidden className="text-ink-faint">
            ＋
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Add an item — no recipe needed"
            aria-label="Add an item"
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        <CHButton type="submit" variant="primary" disabled={!name.trim() || isAdding}>
          {isAdding ? "Adding…" : "Add"}
        </CHButton>
        {trailingContent}
      </div>

      {error && (
        <p className="m-0 text-[13px] text-danger" role="alert">
          {error.message}
        </p>
      )}
    </form>
  );
}
