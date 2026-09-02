import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TagChip } from "./TagChip";

const meta = {
  title: "common/TagChip",
  component: TagChip,
  parameters: { layout: "centered" },
  args: {
    label: "vegan",
    onToggle: fn(),
  },
} satisfies Meta<typeof TagChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { selected: false },
};

export const Selected: Story = {
  args: { selected: true },
};

/** Real click behavior — `TagChip` only renders one chip's state, the caller owns selection. */
export const Interactive: Story = {
  args: { selected: false },
  render: (args) => {
    const [selected, setSelected] = useState(false);
    return <TagChip {...args} selected={selected} onToggle={() => setSelected((s) => !s)} />;
  },
};
