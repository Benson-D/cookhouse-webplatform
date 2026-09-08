import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { CHDecimalField } from "./CHDecimalField";

// ─── Demo components ───────────────────────────────────────────────────

/** CHDecimalField is fully controlled, with no `defaultValue` escape hatch — every story needs its own value/onChange, which is what this wrapper supplies. */
function ControlledDecimalField({
  initialValue = "",
  invalid,
  disabled,
}: {
  initialValue?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  return <CHDecimalField value={value} onChange={setValue} invalid={invalid} disabled={disabled} />;
}

// ─── Storybook metadata ───────────────────────────────────────────────────

const meta = {
  title: "common/CHDecimalField",
  component: ControlledDecimalField,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledDecimalField>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Static states ─────────────────────────────────────────────────────

export const Default: Story = {};

export const WithValue: Story = {
  args: { initialValue: "2" },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, initialValue: "2" },
};

// ─── Interactive states ────────────────────────────────────────────────

/** The core behavior: typing a decimal and blurring reformats it to a kitchen fraction. */
export const FormatsFractionOnBlur: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "1.75");
    await userEvent.tab();
    expect(input).toHaveValue("1¾");
  },
};

/** Focusing back in reveals the raw decimal, not the fraction — editing the actual number stays simple. */
export const RevealsRawDecimalOnFocus: Story = {
  args: { initialValue: "1.75" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    expect(input).toHaveValue("1¾");
    await userEvent.click(input);
    expect(input).toHaveValue("1.75");
  },
};

/** No clean kitchen-fraction match falls back to the plain decimal instead of a wrong-looking fraction. */
export const FallsBackForNonFractionValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "0.6");
    await userEvent.tab();
    expect(input).toHaveValue("0.6");
  },
};
