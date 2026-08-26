"use client";

import { useState, type FormEvent } from "react";
import { CHButton } from "@/components/common";
import { useAddGroceryItem } from "../hooks/useAddGroceryItem";

/**
 * Styled like the recipe list's own search bar on purpose — the point is
 * "no recipe needed." Name-only, no ingredient/unit picker: see
 * `useAddGroceryItem` for why.
 */
export function QuickAddItem() {
  const [name, setName] = useState("");
  const { addByName, isAdding, error } = useAddGroceryItem();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    await addByName(trimmed);
    setName("");
  }

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
      </div>

      {error && (
        <p className="m-0 text-[13px] text-[#B4442F]" role="alert">
          {error.message}
        </p>
      )}
    </form>
  );
}
