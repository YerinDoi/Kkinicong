import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import Star from '../../components/StoreReview/Star';

const meta = {
  title: 'Components/Star',
  component: Star,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    max: {
      control: { type: 'number', min: 1, max: 10 },
      defaultValue: 5,
    },
    value: {
      control: { type: 'number', min: 0, max: 10 },
      defaultValue: 3,
    },
    onChange: { action: '별 클릭됨' },
  },
  args: {
    value: 3,
    max: 5,
    onChange: fn(), // 클릭 동작 감지
  },
} satisfies Meta<typeof Star>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Full: Story = {
  args: {
    value: 5,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const ControlledStar = () => {
      const [val, setVal] = useState(args.value);
      return (
        <Star
          {...args}
          value={val}
          onChange={(v) => {
            setVal(v);
            args.onChange?.(v); // storybook action 로그도 같이 호출
          }}
        />
      );
    };
    return <ControlledStar />;
  },
};
