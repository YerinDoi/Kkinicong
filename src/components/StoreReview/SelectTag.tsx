import React from 'react';
import TagSelector from '@/components/StoreReview/TagSelector';

const MAX_TOTAL = 5;

interface SelectTagProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

const SelectTag: React.FC<SelectTagProps> = ({ selected, onChange }) => {
  const handleTagChange = (groupTags: string[], updated: string[]) => {
    const otherSelected = selected.filter((t) => !groupTags.includes(t));
    const merged = [...otherSelected, ...updated];
    const deduplicated = [...new Set(merged)];

    if (deduplicated.length > MAX_TOTAL) {
      return;
    }

    onChange(deduplicated);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="h-[20px] text-[#919191]">
        <span className="text-black font-semibold leading-[20px] text-base">
          태그를 선택해주세요
        </span>{' '}
        (최대 5개)
      </p>
      <div className="flex flex-col gap-[12px] text-xs font-normal text-[#919191]">
        <p>메뉴가 어땠나요?</p>

        <TagSelector
          tags={['음식이 맛있어요', '재료가 신선해요', '아이들이 먹기 좋아요']}
          selectedTags={selected}
          onChange={(updated) =>
            handleTagChange(
              ['음식이 맛있어요', '재료가 신선해요', '아이들이 먹기 좋아요'],
              updated,
            )
          }
        />

        <p>공간은 어땠나요?</p>
        <TagSelector
          tags={[
            '혼자 가도 편해요',
            '분위기가 좋아요',
            '이야기하기 좋아요',
            '매장이 청결해요',
            '금방 나와요',
          ]}
          selectedTags={selected}
          onChange={(updated) =>
            handleTagChange(
              [
                '혼자 가도 편해요',
                '분위기가 좋아요',
                '이야기하기 좋아요',
                '매장이 청결해요',
                '금방 나와요',
              ],
              updated,
            )
          }
        />
        <p>급식카드 이용에 불편함은 없었나요?</p>
        <TagSelector
          tags={[
            '직원이 친절해요',
            '결제 거절이 없어요',
            '편하게 먹을 수 있어요',
          ]}
          selectedTags={selected}
          onChange={(updated) =>
            handleTagChange(
              [
                '직원이 친절해요',
                '결제 거절이 없어요',
                '편하게 먹을 수 있어요',
              ],
              updated,
            )
          }
        />
        <p>기타</p>
        <TagSelector
          tags={['포장 가능해요', '주차하기 편해요']}
          selectedTags={selected}
          onChange={(updated) =>
            handleTagChange(['포장 가능해요', '주차하기 편해요'], updated)
          }
        />
      </div>
    </div>
  );
};

export default SelectTag;
