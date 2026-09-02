import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ErrorState } from "./ErrorState";

const meta = {
  title: "common/ErrorState",
  component: ErrorState,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    title: "Couldn't load spending",
    message: "Something went wrong loading your data.",
  },
};

/** `onRetry` is what shows the "Try again" button — omitted entirely (like a not-found state) means no button. */
export const WithRetry: Story = {
  args: {
    title: "Couldn't load this recipe",
    message: "Something went wrong loading your data.",
    onRetry: fn(),
  },
};
