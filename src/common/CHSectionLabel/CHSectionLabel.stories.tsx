import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHSectionLabel } from "./CHSectionLabel";

const meta = {
  title: "common/CHSectionLabel",
  component: CHSectionLabel,
  parameters: { layout: "padded" },
  args: {
    children: "Ingredients",
  },
} satisfies Meta<typeof CHSectionLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Spacing overrides are common — every call site tunes `mt`/`mb` for its own placement. */
export const CustomSpacing: Story = {
  args: { children: "By category", className: "mb-1 mt-1" },
};
