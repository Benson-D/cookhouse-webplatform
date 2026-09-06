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
