import { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import settingIcon from '@/assets/svgs/convenience/setting.svg';

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

const categories = ['전체', '식사류', '간식류', '음료', '과일류', '기타'];

const CategoryFilterSelector: React.FC<Props> = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center shrink-0 py-1 px-3 rounded-[12px] border border-[#919191] bg-[#F4F6F8] whitespace-nowrap text-font-body-md-title font-regular"
      >
        <img
          src={settingIcon}
          alt="카테고리 설정 아이콘"
          className="w-[16px] h-[16px] mr-1"
        />
        <span>{selected}</span>
      </button>

      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col">
          <h2 className="text-center text-[14px] font-medium text-[#000000] py-3">
            카테고리 필터
          </h2>

          <ul className="flex flex-col">
            {categories.map((category) => (
              <li
                key={category}
                className="flex justify-between items-center px-6 py-4 cursor-pointer"
                onClick={() => {
                  onChange(category);
                  setOpen(false);
                }}
              >
                <span
                  className={`text-[16px] ${
                    selected === category
                      ? 'text-[#00B761] font-semibold'
                      : 'text-[#222]'
                  }`}
                >
                  {category}
                </span>

                {selected === category && (
                  <span className="text-[#00B761] text-[18px] font-bold">
                    ✓
                  </span>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen(false)}
            className="mt-auto py-4 text-center text-[16px] font-medium border-t border-[#F0F0F0] text-[#222]"
          >
            닫기
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

export default CategoryFilterSelector;
