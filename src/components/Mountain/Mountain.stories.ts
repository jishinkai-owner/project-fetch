import type { Meta, StoryObj } from "@storybook/react";
import Mountain from "./Mountain";

const meta = {
  title: "Components/Mountain",
  component: Mountain,
  parameters: {
    nextjs: {
        appDirectory: true,
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Mountain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
  },
};