import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHLink } from "./CHLink";

const meta = {
  title: "common/CHLink",
  component: CHLink,
  parameters: { layout: "centered" },
  args: {
    href: "/recipes/new",
    children: "New recipe",
    variant: "ghost",
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "ghost"] },
  },
} satisfies Meta<typeof CHLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};
