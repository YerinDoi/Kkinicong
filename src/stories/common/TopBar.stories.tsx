// TopBar.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import TopBar from '../../components/common/TopBar';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof TopBar> = {
  title: 'Common/TopBar',
  component: TopBar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="w-full border-b border-gray-200">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta; // ✅ 이 줄 꼭 있어야 함!

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {
    title: '기본 TopBar',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: '가맹점',
    subTitle: '서울 강남구',
  },
};

export const WithRightIcon: Story = {
  args: {
    title: '가맹점',
    rightElement: <button className="text-sm text-gray-600">메뉴</button>,
  },
};

export const WithoutBackButton: Story = {
  args: {
    title: '메인',
    showBackButton: false,
    rightElement: <button className="text-sm text-gray-600">햄버거</button>,
  },
};

export const CustomBackAction: Story = {
  args: {
    title: '홈으로 이동',
    onBack: () => alert('홈으로 이동합니다'),
  },
};
