import type { Meta, StoryObj } from "@storybook/react";
import Menu from "./Menu";

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
  },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: (path: string) => {
      console.log(`Clicked path: ${path}`);
    },
  },
};