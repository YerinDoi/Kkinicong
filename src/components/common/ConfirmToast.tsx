import React from 'react';
import ConfirmIcon from '@/assets/svgs/common/confirm-icon.svg';

interface WarningToastProps {
  text: string;
}

const WarningToast: React.FC<WarningToastProps> = ({ text }) => {
  return (
    <div className="flex py-[16px] pl-[33px] gap-[32px] w-[338px] font-pretendard bg-[#F4F6F8] rounded-[12px]">
      <img src={ConfirmIcon} className="w-[40px] h-[40px]" />
      <p className="text-[#212121] text-sm leading-[18px] font-medium">
        {text}
        <br />
        최대한 빠르게 확인하고 반영할게요
      </p>
    </div>
  );
};

export default WarningToast;
