import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHButton } from "./CHButton";

const meta = {
  title: "common/CHButton",
  component: CHButton,
  parameters: { layout: "centered" },
  args: {
    children: "Add to grocery list",
    variant: "ghost",
    disabled: false,
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "ghost"] },
  },
} satisfies Meta<typeof CHButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Primary: Story = {
  args: { variant: "primary", children: "New recipe" },
};

/** The toggle-on look used by favoriting/filtering buttons — a `pressed` `CHButton` looks the same regardless of `variant`. */
export const Pressed: Story = {
  args: { pressed: true, children: "♥ Saved" },
};

export const Disabled: Story = {
  args: { variant: "primary", disabled: true, children: "Adding…" },
};
