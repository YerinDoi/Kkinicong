import type { Meta, StoryObj } from '@storybook/react';
import MainTag from '../../components/StoreReview/MainTag';

const meta: Meta<typeof MainTag> = {
  title: 'Components/MainTag',
  component: MainTag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MainTag>;

export const Default: Story = {
  args: {
    text: '재료가 신선해요',
  },
};
