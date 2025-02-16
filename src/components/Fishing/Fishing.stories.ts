import type { Meta, StoryObj } from "@storybook/react";
import Fishing from "./Fishing";

const meta = {
  title: "Components/Fishing",
  component: Fishing,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
  },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Fishing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
  },
};