import { Meta, StoryObj } from '@storybook/react';
import WarningToast from '@/components/common/WarningToast';

const meta: Meta<typeof WarningToast> = {
  title: 'Components/WarningToast',
  component: WarningToast,
};

export default meta;
type Story = StoryObj<typeof WarningToast>;

// 🔧 공통 렌더 wrapper
const renderWithPosition = (
  args: React.ComponentProps<typeof WarningToast>,
) => (
  <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
    <WarningToast {...args} />
  </div>
);

export const Default: Story = {
  args: {
    text: '업로드 가능한 용량을 초과했어요',
  },
  render: renderWithPosition,
};

export const Format: Story = {
  args: {
    text: '지원하지 않는 형식이에요',
  },
  render: renderWithPosition,
};

export const Fail: Story = {
  args: {
    text: '이미지 업로드에 실패했어요',
  },
  render: renderWithPosition,
};
