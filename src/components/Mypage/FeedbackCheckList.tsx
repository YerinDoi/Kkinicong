import React from 'react';
import CheckboxIcon from '@/assets/svgs/review/checkbox.svg';
import UncheckedIcon from '@/assets/svgs/review/unchecked-box.svg';

interface FeedbackCheckListProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

const FeedbackCheckList: React.FC<FeedbackCheckListProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const handleToggle = (label: string) => {
    const exists = value.includes(label);
    const next = exists ? value.filter((v) => v !== label) : [...value, label];
    onChange(next);
  };

  return (
    <ul className={`flex flex-col gap-[12px] ${className ?? ''}`}>
      {options.map((opt, idx) => {
        const id = `feedback-issue-${idx}`;
        const checked = value.includes(opt);
        return (
          <li key={id} className="flex items-start gap-[8px]">
            <button
              type="button"
              aria-pressed={checked}
              onClick={() => handleToggle(opt)}
              className="mt-[2px] w-[20px] h-[20px]"
            >
              <img
                src={checked ? CheckboxIcon : UncheckedIcon}
                alt={checked ? '선택됨' : '선택 안 됨'}
                className="w-full h-full"
              />
            </button>
            <button
              type="button"
              onClick={() => handleToggle(opt)}
              className="text-left leading-[24px] text-[#212121] text-[14px] font-body-md-title font-normal font-pretendard"
            >
              {opt}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default FeedbackCheckList;
