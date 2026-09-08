import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHTextArea } from "./CHTextArea";

const meta = {
  title: "common/CHTextArea",
  component: CHTextArea,
  parameters: { layout: "padded" },
  args: {
    rows: 2,
    placeholder: "One pot, pantry staples, done inside 35 minutes.",
  },
} satisfies Meta<typeof CHTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "One pot, pantry staples, done inside 35 minutes." },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "One pot, pantry staples, done inside 35 minutes." },
};

export const WithLabel: Story = {
  args: { label: "Description", id: "recipe-description" },
};

export const WithHint: Story = {
  args: {
    label: "Description",
    hint: "A short line, not the full recipe.",
    id: "recipe-description",
  },
};

export const WithError: Story = {
  args: { label: "Description", error: "Keep it under 200 characters", id: "recipe-description" },
};

/** Long, multi-line content should wrap and scroll within `rows`, not distort the field's own layout. */
export const LongContent: Story = {
  args: {
    defaultValue:
      "Toast the cumin seeds in a dry pan until fragrant, about 1 minute, then grind. In a large pot, heat oil over medium heat and sauté the onion until soft and golden, 6 to 8 minutes. Add garlic and ginger, cook 1 minute more, then stir in the ground cumin, turmeric, and chili powder.",
  },
};
