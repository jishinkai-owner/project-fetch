import type { Meta, StoryObj } from "@storybook/react";
import Traveling from "./Traveling";

const meta = {
  title: "Components/Traveling",
  component: Traveling,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
  },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Traveling>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
  },
};
