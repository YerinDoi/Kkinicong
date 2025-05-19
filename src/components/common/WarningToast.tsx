import React from 'react';
import WarningIcon from '@/assets/svgs/review/warning.svg';

interface WarningToastProps {
  text: string;
}

const WarningToast: React.FC<WarningToastProps> = ({ text }) => {
  return (
    <div className="flex py-[16px] px-[38px] gap-[32px] w-[338px] font-pretendard bg-[#F4F6F8] rounded-[12px]">
      <img src={WarningIcon} className="w-[40px] h-[40px]" />
      <p className="text-black text-sm ">
        {text}
        <br />
        다시 시도해주세요
      </p>
    </div>
  );
};

export default WarningToast;
