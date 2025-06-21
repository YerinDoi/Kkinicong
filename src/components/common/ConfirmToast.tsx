import React from 'react';
import ConfirmIcon from '@/assets/svgs/common/confirm-icon.svg';

interface ConfirmToastProps {
  text: string | string[];
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({ text }) => {
  return (
    <div className="flex py-[16px] pl-[33px] gap-[32px] w-[338px] font-pretendard bg-[#F4F6F8] rounded-[12px]">
      <img src={ConfirmIcon} className="w-[40px] h-[40px]" />
      <div className="text-[#212121] text-sm leading-[18px]">
        {Array.isArray(text) ? (
          text.map((line, idx) => <p key={idx}>{line}</p>)
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmToast;
