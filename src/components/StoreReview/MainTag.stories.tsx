// components/Tag.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import Tag from './MainTag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    text: '재료가 신선해요',
  },
};
