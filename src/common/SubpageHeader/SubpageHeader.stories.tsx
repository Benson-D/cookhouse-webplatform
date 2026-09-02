import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubpageHeader } from "./SubpageHeader";

const meta = {
  title: "common/SubpageHeader",
  component: SubpageHeader,
  parameters: { layout: "padded" },
  args: {
    backHref: "/grocery-list",
  },
} satisfies Meta<typeof SubpageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {
  args: { backLabel: "Cancel", title: "Add from recipes" },
};

/** `right` renders whatever context the screen has — here, the receipt review's item count. */
export const WithRightContent: Story = {
  args: {
    backLabel: "Cancel",
    title: "Review receipt",
    right: (
      <span className="tabular font-mono text-xs text-ink-faint">
        34 items scanned · 2 need a look
      </span>
    ),
  },
};

/** Omitted `title` — used where the page's own heading already shows the title right below, e.g. recipe detail. */
export const NoTitle: Story = {
  args: { backLabel: "All recipes" },
};
