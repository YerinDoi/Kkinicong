import React from 'react';

interface FeedbackBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ value, onChange }) => {
  const maxLength = 6000;

  return (
    <div className="flex flex-col gap-[12px] font-pretendard px-[8px]">
      <div className="flex text-[#919191] justify-between ">
        <div className="h-[18px] ">
          <span className="text-black font-medium text-title-sb-button">
            의견이 있다면 작성해주세요
          </span>{' '}
          (선택)
        </div>
        <div>
          {value.length}/{maxLength}
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={`끼니콩이 이렇게 변했으면 좋겠어요!`}
        className="placeholder-[#919191] text-[#212121] h-[79px] font-normal text-[12px] leading-[18px] tracking-[0.012px] px-[16px] pt-[16px] pb-[24px] flex border border-[#C3C3C3] rounded-[12px]"
      ></textarea>
    </div>
  );
};

export default FeedbackBox;
