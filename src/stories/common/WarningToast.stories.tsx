
import { Meta, StoryObj } from '@storybook/react';
import WarningToast from '@/components/common/WarningToast';

const meta: Meta<typeof WarningToast> = {
  title: 'Components/WarningToast',
  component: WarningToast,
};

export default meta;
type Story = StoryObj<typeof WarningToast>;

export const Default: Story = {
  args: {
    text: '업로드 가능한 용량을 초과했어요',
  },
};

export const Format: Story = {
  args: {
    text: '지원하지 않는 형식이에요',
  },
};

export const Fail: Story = {
  args: {
    text: '이미지 업로드에 실패했어요',
  },
};