import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CHNumInput } from "./CHNumInput";

const meta = {
  title: "common/CHNumInput",
  component: CHNumInput,
  parameters: { layout: "centered" },
  args: {
    placeholder: "25",
  },
} satisfies Meta<typeof CHNumInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Static states ─────────────────────────────────────────────────────

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "25" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "25" },
};

export const WithLabel: Story = {
  args: { label: "Prep (min)", id: "prep-time" },
};

export const WithHint: Story = {
  args: { label: "Cook (min)", hint: "Rough estimate is fine.", id: "cook-time" },
};

export const WithError: Story = {
  args: { label: "Servings", error: "Must be a whole number above zero", id: "servings" },
};

// ─── Interactive states ────────────────────────────────────────────────

/** Every non-digit is stripped as you type, not just rejected on submit. */
export const SanitizesNonDigitInput: Story = {
  args: { onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "12a3b4");
    expect(input).toHaveValue("1234");
    expect(args.onChange).toHaveBeenCalled();
  },
};

/** A typed value under `min` clamps up rather than staying invalid — e.g. servings can't be 0. */
export const ClampsBelowMinimum: Story = {
  args: { min: 1, defaultValue: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "0");
    expect(input).toHaveValue("1");
  },
};
