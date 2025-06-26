import React from 'react';

interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ value, onChange }) => {
  const maxLength = 500;

  return (
    <div className="flex flex-col gap-[12px] font-pretendard">
      <div className="flex text-[#919191] justify-between ">
        <div className="h-[20px] ">
          <span className="text-black font-semibold leading-[20px] text-title-sb-button">
            리뷰를 작성해주세요
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
        placeholder={`다녀온 식당 어땠나요?\n맛이나 친절도, 분위기를 솔직하게 공유해주세요!`}
        className="placeholder-[#919191] text-[#616161] text-body-md-description px-[16px] pt-[12px] pb-[40px] flex border border-[#C3C3C3] rounded-[12px]"
      ></textarea>
    </div>
  );
};

export default CommentBox;
