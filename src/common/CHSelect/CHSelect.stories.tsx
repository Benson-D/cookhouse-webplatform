import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { CHSelect } from "./CHSelect";

type Ingredient = { id: string; name: string };

const INGREDIENTS: Ingredient[] = [
  { id: "1", name: "red lentils" },
  { id: "2", name: "yellow onion" },
  { id: "3", name: "garlic cloves" },
  { id: "4", name: "ginger" },
  { id: "5", name: "ground cumin" },
];

/**
 * `CHSelect` is generic over any item shape via `getOptionId`/`getOptionLabel`
 * — these stories fix it to `{ id, name }`, the same shape ingredients/units
 * already use everywhere it's actually consumed. `value` stays fixed per
 * story rather than wired to real state — picking an option just logs to
 * the Actions panel via the mocked `onSelect`.
 */
const meta = {
  title: "common/CHSelect",
  component: CHSelect<Ingredient>,
  parameters: { layout: "centered" },
  args: {
    value: null,
    options: INGREDIENTS,
    getOptionId: (item: Ingredient) => item.id,
    getOptionLabel: (item: Ingredient) => item.name,
    onSelect: fn(),
    label: "Ingredient",
    placeholder: "search",
  },
} satisfies Meta<typeof CHSelect<Ingredient>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pick-only — no `onCreate`, so typing something with no match offers nothing (e.g. units). */
export const PickOnly: Story = {};

/** With `onCreate` — typing something with no exact match offers to create it (e.g. ingredients). */
export const WithCreate: Story = {
  args: {
    placeholder: "search or add an ingredient",
    onCreate: async (name: string) => ({ id: `new-${name}`, name }),
  },
};

export const Preselected: Story = {
  args: { value: INGREDIENTS[0] },
};

export const Invalid: Story = {
  args: { invalid: true },
};
