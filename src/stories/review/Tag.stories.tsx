import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Tag from '@/components/common/Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      defaultValue: '음식이 맛있어요',
    },
    selected: {
      control: 'boolean',
      defaultValue: false,
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '음식이 맛있어요',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    label: '재료가 신선해요',
    selected: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const InteractiveTag = () => {
      const [isSelected, setIsSelected] = useState(args.selected);
      return (
        <Tag
          label={args.label}
          selected={isSelected}
          onClick={() => {
            setIsSelected(!isSelected);
            args.onClick?.();
          }}
        />
      );
    };

    return <InteractiveTag />;
  },
  args: {
    label: '클릭해서 선택',
    selected: false,
  },
};
