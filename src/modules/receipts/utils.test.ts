import { toReviewItems, needsLook, groupItems, isReadyToConfirm, buildConfirmItems } from "./utils";
import type { ReviewLineItem, ScanResult } from "./types";

function makeItem(overrides: Partial<ReviewLineItem> = {}): ReviewLineItem {
  return {
    id: "1",
    description: "Milk",
    price: "3.99",
    quantity: "1",
    matchedIngredientId: "ing_milk",
    matchedIngredientName: "Milk",
    override: null,
    promoted: false,
    removed: false,
    ...overrides,
  };
}

describe("toReviewItems", () => {
  it("seeds review state from a scan, with nothing promoted or removed", () => {
    const scan = {
      lineItems: [
        {
          description: "Milk",
          price: 3.99,
          quantity: 1,
          matchedIngredientId: "ing_milk",
          matchedIngredientName: "Milk",
        },
      ],
    } as ScanResult;

    expect(toReviewItems(scan)).toEqual([
      {
        id: "0-Milk",
        description: "Milk",
        price: "3.99",
        quantity: "1",
        matchedIngredientId: "ing_milk",
        matchedIngredientName: "Milk",
        override: null,
        promoted: false,
        removed: false,
      },
    ]);
  });

  it("leaves price/quantity blank when the scan didn't find a number", () => {
    const scan = {
      lineItems: [
        {
          description: "Mystery item",
          price: null,
          quantity: null,
          matchedIngredientId: null,
          matchedIngredientName: null,
        },
      ],
    } as ScanResult;

    const [item] = toReviewItems(scan);
    expect(item.price).toBe("");
    expect(item.quantity).toBe("");
  });
});

describe("needsLook", () => {
  it("flags a new (unmatched) ingredient", () => {
    expect(needsLook(makeItem({ matchedIngredientId: null }))).toBe(true);
  });

  it("flags a line with no price", () => {
    expect(needsLook(makeItem({ price: "" }))).toBe(true);
  });

  it("flags a line the reviewer promoted to edit", () => {
    expect(needsLook(makeItem({ promoted: true }))).toBe(true);
  });

  it("doesn't flag a matched, priced, unpromoted line", () => {
    expect(needsLook(makeItem())).toBe(false);
  });
});

describe("groupItems", () => {
  it("splits into needsLook and matchedAutomatically", () => {
    const matched = makeItem({ id: "1" });
    const unmatched = makeItem({ id: "2", matchedIngredientId: null });
    const { needsLook: flagged, matchedAutomatically } = groupItems([matched, unmatched]);
    expect(flagged.map((item) => item.id)).toEqual(["2"]);
    expect(matchedAutomatically.map((item) => item.id)).toEqual(["1"]);
  });

  it("excludes removed lines from both groups", () => {
    const { needsLook: flagged, matchedAutomatically } = groupItems([makeItem({ removed: true })]);
    expect(flagged).toEqual([]);
    expect(matchedAutomatically).toEqual([]);
  });
});

describe("isReadyToConfirm", () => {
  it("is false with no visible items", () => {
    expect(isReadyToConfirm([])).toBe(false);
    expect(isReadyToConfirm([makeItem({ removed: true })])).toBe(false);
  });

  it("is false if any visible item has no price", () => {
    expect(isReadyToConfirm([makeItem(), makeItem({ id: "2", price: "" })])).toBe(false);
  });

  it("is true when every visible item has a price", () => {
    expect(isReadyToConfirm([makeItem(), makeItem({ id: "2" })])).toBe(true);
  });

  it("ignores a removed item's missing price", () => {
    expect(isReadyToConfirm([makeItem(), makeItem({ id: "2", price: "", removed: true })])).toBe(
      true
    );
  });
});

describe("buildConfirmItems", () => {
  it("drops removed lines", () => {
    expect(buildConfirmItems([makeItem({ removed: true })])).toEqual([]);
  });

  it("uses the override name when the reviewer picked one", () => {
    const [result] = buildConfirmItems([
      makeItem({ override: { id: "ing_2", name: "Whole milk" } }),
    ]);
    expect(result.description).toBe("Whole milk");
  });

  it("uses the matched ingredient's canonical name over the raw scan text", () => {
    const [result] = buildConfirmItems([
      makeItem({ description: "2% MILK GAL", matchedIngredientName: "Milk" }),
    ]);
    expect(result.description).toBe("Milk");
  });

  it("falls back to the raw scanned description for a genuinely new item", () => {
    const [result] = buildConfirmItems([
      makeItem({
        description: "Mystery item",
        matchedIngredientId: null,
        matchedIngredientName: null,
      }),
    ]);
    expect(result.description).toBe("Mystery item");
  });

  it("parses price and quantity as numbers, omitting quantity when blank", () => {
    const [result] = buildConfirmItems([makeItem({ price: "4.5", quantity: "" })]);
    expect(result.price).toBe(4.5);
    expect(result.quantity).toBeUndefined();
  });
});
