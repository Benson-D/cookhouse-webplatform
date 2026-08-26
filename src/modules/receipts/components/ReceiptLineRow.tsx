"use client";

import { CHSelect, CHTextInput, TagBadge } from "@/components/common";
import type { ReviewLineItem } from "../types";

type Ingredient = { id: string; name: string };

/**
 * A full-row-editable line — either a new ingredient Textract found no match
 * for, one missing a price, or a matched line the reviewer tapped to correct.
 * Matches the recipe form's ingredient-row shape (price/qty/ingredient select)
 * since it's the same "amount + unit-less ingredient" pattern.
 */
export function ReceiptLineRow({
  item,
  ingredientOptions,
  onSearchIngredients,
  onResolveIngredient,
  onChange,
  onRemove,
}: {
  item: ReviewLineItem;
  ingredientOptions: Ingredient[];
  onSearchIngredients: (query: string) => void;
  onResolveIngredient: (name: string) => Promise<Ingredient>;
  onChange: (patch: Partial<ReviewLineItem>) => void;
  onRemove: () => void;
}) {
  // Display-only fallback so a new item shows what it'll create, not a blank field.
  const matchedIngredient =
    item.matchedIngredientId && item.matchedIngredientName
      ? { id: item.matchedIngredientId, name: item.matchedIngredientName }
      : { id: "", name: item.description };
  const selectedIngredient: Ingredient = item.override ?? matchedIngredient;

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
          label={`Ingredient for ${item.description}`}
          placeholder="search or add an ingredient"
          value={selectedIngredient}
          options={ingredientOptions}
          getOptionId={(ingredient) => ingredient.id}
          getOptionLabel={(ingredient) => ingredient.name}
          onSearch={onSearchIngredients}
          onSelect={(ingredient) => onChange({ override: ingredient })}
          onCreate={onResolveIngredient}
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
