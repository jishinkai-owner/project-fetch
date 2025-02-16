import type { Meta, StoryObj } from "@storybook/react";
import Climbing from "./Climbing";

const meta = {
  title: "Components/Climbing",
  component: Climbing,
  parameters: {
    nextjs: {
        appDirectory: true,
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Climbing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
  },
};