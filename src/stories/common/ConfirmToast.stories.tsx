import { Meta, StoryObj } from '@storybook/react';
import ConfirmToast from '@/components/common/ConfirmToast';

const meta: Meta<typeof ConfirmToast> = {
  title: 'Components/ConfirmToast',
  component: ConfirmToast,
};

export default meta;
type Story = StoryObj<typeof ConfirmToast>;

export const Default: Story = {
  args: {
    text: '수정 요청 완료!',
  },
};

export const Report: Story = {
  args: {
    text: '신고 완료!',
  },
};
