import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TagBadge } from "./TagBadge";

const meta = {
  title: "common/TagBadge",
  component: TagBadge,
  parameters: { layout: "centered" },
  args: {
    label: "vegan",
  },
} satisfies Meta<typeof TagBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A row of several — the shape they actually appear in on a recipe card. */
export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[5px]">
      <TagBadge label="indian" />
      <TagBadge label="vegan" />
      <TagBadge label="gluten-free" />
      <TagBadge label="dinner" />
    </div>
  ),
};
