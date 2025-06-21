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
    text: ['수정 요청 완료!', '최대한 빠르게 확인하고 반영할게요'],
  },
};

export const Report: Story = {
  args: {
    text: ['신고 완료!', '최대한 빠르게 확인하고 반영할게요'],
  },
};

export const Upload: Story = {
  args: {
    text: ['등록 완료!', '공유된 정보가 큰 도움이 될거에요'],
  },
};

export const Review: Story = {
  args: {
    text: ['리뷰 작성 완료!', '소중한 의견이 등록되었어요'],
  },
};

export const Post: Story = {
  args: {
    text: '게시글 등록이 완료되었어요',
  },
};
