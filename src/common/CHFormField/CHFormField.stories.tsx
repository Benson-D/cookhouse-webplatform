import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CHFormField } from "./CHFormField";
import { CHTextInput } from "../CHTextInput/CHTextInput";

const meta = {
  title: "common/CHFormField",
  component: CHFormField,
  parameters: { layout: "padded" },
  args: {
    label: "Recipe name",
    children: <CHTextInput placeholder="Weeknight Red Lentil Dal" />,
  },
} satisfies Meta<typeof CHFormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    label: "Photos",
    hint: "The first photo is the cover.",
    children: <CHTextInput placeholder="Choose files…" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Recipe name",
    error: "Give the recipe a name",
    children: <CHTextInput invalid />,
  },
};
