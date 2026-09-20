"use client";

import { CHSelect, CHTextInput, TagBadge } from "@/common";
import { useCreatableSelect } from "@/hooks/useCreatableSelect";
import { useIngredientSearchPicker } from "@/hooks/useIngredientSearchPicker";
import { resolveAsFreeText } from "../utils";
import type { ReviewLineItem } from "../types";

type Ingredient = { id: string; name: string };

/**
 * A full-row-editable line — either a new ingredient Textract found no match
 * for, one missing a price, or a matched line the reviewer tapped to correct.
 * Matches the recipe form's ingredient-row shape (price/qty/ingredient select)
 * since it's the same "amount + unit-less ingredient" pattern. Owns its own
 * ingredient picker — each row's autocomplete input/search state is
 * independent, unlike the review screen as a whole.
 *
 * Free text, not eager creation: `useCreatableSelect` is wired to
 * `resolveAsFreeText`, a local echo, not `ingredientPicker.findOrCreate` —
 * typing a name with no match just captures that text as the override, it
 * doesn't create anything. `confirmPurchases` does the real ingredient
 * matching server-side once the receipt is confirmed, so eagerly creating
 * one here could make a row that check never gets a chance to reject.
 */
export function ReceiptLineRow({
  item,
  onChange,
  onRemove,
}: {
  item: ReviewLineItem;
  onChange: (patch: Partial<ReviewLineItem>) => void;
  onRemove: () => void;
}) {
  // Display-only fallback so a new item shows what it'll create, not a blank field.
  const matchedIngredient =
    item.matchedIngredientId && item.matchedIngredientName
      ? { id: item.matchedIngredientId, name: item.matchedIngredientName }
      : { id: "", name: item.description };
  const selectedIngredient: Ingredient = item.override ?? matchedIngredient;

  const ingredientPicker = useIngredientSearchPicker();

  const ingredientSelect = useCreatableSelect<Ingredient>({
    options: ingredientPicker.options,
    inputValue: ingredientPicker.searchValue,
    findOrCreate: resolveAsFreeText,
  });

  return (
    <div className="flex flex-col gap-1 border-b border-line-soft py-2.5 last:border-b-0">
      <div className="grid grid-cols-[64px_52px_1fr_24px] items-center gap-2">
        <CHTextInput
          value={item.price}
          onChange={(event) => onChange({ price: event.target.value })}
          inputMode="decimal"
          placeholder="0.00"
          aria-label={`Price for ${item.description}`}
        />
        <CHTextInput
          value={item.quantity}
          onChange={(event) => onChange({ quantity: event.target.value })}
          inputMode="decimal"
          placeholder="1"
          aria-label={`Quantity for ${item.description}`}
        />
        <CHSelect<Ingredient>
          ariaLabel={`Ingredient for ${item.description}`}
          placeholder="search or add an ingredient"
          value={selectedIngredient}
          options={ingredientSelect.options}
          getOptionId={(ingredient) => ingredient.id}
          getOptionLabel={(ingredient) => ingredient.name}
          onInputChange={(event) => ingredientPicker.setSearchValue(event.target.value)}
          onChange={async (ingredient) => {
            if (!ingredient) return;
            const resolved = await ingredientSelect.handleSelect(ingredient);
            onChange({ override: resolved });
          }}
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.description}`}
          className="text-[15px] text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </div>

      <div className="pl-px text-[11.5px] text-ink-faint">
        scanned as &ldquo;{item.description}&rdquo;
        {item.matchedIngredientId === null && (
          <span className="ml-1.5 align-middle">
            <TagBadge label="new ingredient" />
          </span>
        )}
        {item.price.trim() === "" && (
          <span className="ml-1.5 align-middle">
            <TagBadge label="no price detected" />
          </span>
        )}
      </div>
    </div>
  );
}
