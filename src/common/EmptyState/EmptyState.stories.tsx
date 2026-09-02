import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHLink } from "../CHLink/CHLink";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "common/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: { title: "Nothing on the list yet" },
};

export const WithMessage: Story = {
  args: {
    title: "Nothing on the list yet",
    message: "Add an item, or pull in the ingredients from a few recipes.",
  },
};

/** The spending screen's actual empty state — message plus a real action. */
export const WithAction: Story = {
  args: {
    title: "No spending yet",
    message: "Shows up here once you scan a receipt or log a purchase.",
    action: (
      <CHLink variant="primary" href="/receipts/new">
        Scan a receipt
      </CHLink>
    ),
  },
};
