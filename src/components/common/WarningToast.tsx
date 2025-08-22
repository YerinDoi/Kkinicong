import React from 'react';
import WarningIcon from '@/assets/svgs/review/warning.svg';

interface WarningToastProps {
  text: string | string[];
}

const WarningToast: React.FC<WarningToastProps> = ({ text }) => {
  return (
    <div className="flex py-[16px] pl-[38px] gap-[32px] w-[338px] items-center font-pretendard bg-[#F4F6F8] rounded-[12px] shadow-floating">
      <img src={WarningIcon} className="w-[40px] h-[40px]" />
      <div className="text-body-md-title text-black">
        {Array.isArray(text) ? (
          text.map((line, idx) => <p key={idx}>{line}</p>)
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default WarningToast;
