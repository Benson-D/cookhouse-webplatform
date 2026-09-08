import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

// ─── Static states ─────────────────────────────────────────────────────

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

// ─── Interactive states ────────────────────────────────────────────────

export const FiresOnClick: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/** `disabled` is a real guarantee, not just a dimmed look — the click genuinely never reaches `onClick`. */
export const DisabledPreventsClick: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
