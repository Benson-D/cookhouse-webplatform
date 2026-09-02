import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardGridLoadingState, LoadingState } from "./LoadingState";

const meta = {
  title: "common/LoadingState",
  component: LoadingState,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomRows: Story = {
  args: { label: "Loading recipe…", rows: 5 },
};

/** The recipe-grid-shaped variant — a separate export, not a `LoadingState` prop, since the two skeletons don't share a shape. */
export const CardGrid: StoryObj<typeof CardGridLoadingState> = {
  render: (args) => <CardGridLoadingState {...args} />,
  args: { cards: 6 },
};
