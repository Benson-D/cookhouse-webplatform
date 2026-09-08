import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHTextInput } from "./CHTextInput";

const meta = {
  title: "common/CHTextInput",
  component: CHTextInput,
  parameters: { layout: "centered" },
  args: {
    placeholder: "Weeknight Red Lentil Dal",
  },
} satisfies Meta<typeof CHTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Static states ─────────────────────────────────────────────────────

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Weeknight Red Lentil Dal" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Weeknight Red Lentil Dal" },
};

export const WithLabel: Story = {
  args: { label: "Recipe name", id: "recipe-name" },
};

export const WithHint: Story = {
  args: { label: "Photos", hint: "The first photo is the cover.", placeholder: "Choose files…" },
};

export const WithError: Story = {
  args: { label: "Recipe name", error: "Give the recipe a name" },
};

// ─── Demo components ───────────────────────────────────────────────────

/**
 * Unlabeled, `CHTextInput` renders via `display: contents` so each one acts
 * as its own direct flex item — this row (matching real usage in
 * IngredientRows) is what actually proves that, since a single input in
 * isolation never exercises sibling layout at all.
 */
function UnlabeledRowDemo() {
  return (
    <div className="flex w-[360px] gap-2">
      <CHTextInput placeholder="1" aria-label="Amount" className="w-16" />
      <CHTextInput placeholder="cup" aria-label="Unit" className="w-20" />
      <CHTextInput placeholder="ingredient" aria-label="Ingredient" className="flex-1" />
    </div>
  );
}

export const UnlabeledInRow: Story = {
  render: () => <UnlabeledRowDemo />,
};
