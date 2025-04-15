import type { Meta, StoryObj } from "@storybook/react";
import SNSHolder from "./SNSHolder";

const meta = {
  title: "Components/SNSHolder",
  component: SNSHolder,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SNSHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    twitterUrl: "https://twitter.com/your-account",
    instagramUrl: "https://instagram.com/your-account"
  },
};