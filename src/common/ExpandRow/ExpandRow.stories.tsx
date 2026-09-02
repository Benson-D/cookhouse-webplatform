import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ExpandRow } from "./ExpandRow";

const meta = {
  title: "common/ExpandRow",
  component: ExpandRow,
  parameters: { layout: "padded" },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ExpandRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Expand-once — no way back, e.g. the receipt review's matched-items list. */
export const ViewAll: Story = {
  args: { label: "2 more cuisines", actionLabel: "view all" },
};

/** Expand/collapse toggle — e.g. the spending trend table's exact figures. */
export const Collapse: Story = {
  args: { label: "Exact figures for all 6 months", actionLabel: "collapse" },
};
