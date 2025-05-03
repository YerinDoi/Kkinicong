// TagSelector.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import TagSelector from '@/components/StoreReview/TagSelector';
import type { TagSelectorProps } from '@/components/StoreReview/TagSelector';
import { useState } from 'react';

const meta: Meta<typeof TagSelector> = {
  title: 'Components/TagSelector',
  component: TagSelector,
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<TagSelectorProps> = (args) => <TagSelector {...args} />;

export const Default = Template.bind({});
Default.args = {
  tags: [
    '음식이 맛있어요',
    '재료가 신선해요',
    '아이들이 먹기 좋아요',
    '메뉴가 다양해요',
    '혼자 가도 편해요',
    '분위기가 좋아요',
    '이야기하기 좋아요',
    '매장이 청결해요',
    '금방 나와요',
    '직원이 친절해요',
    '결제 거절이 없어요',
    '편하게 먹을 수 있어요',
    '포장 가능해요',
    '주차하기 편해요',
  ],
  selectedTags: [],
  onChange: (updated: string[]) => {
    console.log('Selected tags:', updated);
  },
};

//클릭 시 상태 변화까지 보이게

export const Interactive: StoryFn<TagSelectorProps> = (args) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(args.selectedTags);

  const handleChange = (updated: string[]) => {
    setSelectedTags(updated);
    args.onChange?.(updated);
  };

  return (
    <TagSelector
      {...args}
      selectedTags={selectedTags}
      onChange={handleChange}
    />
  );
};

Interactive.args = {
  ...Default.args,
};
