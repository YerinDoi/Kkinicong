import React from 'react';
import ConfirmIcon from '@/assets/svgs/common/confirm-icon.svg';
import OptimizedImage from './OptimizedImage';

interface ConfirmToastProps {
  text: string | string[];
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({ text }) => {
  return (
    <div className="flex py-[16px] pl-[33px] gap-[32px] w-[338px] h-[72px] font-pretendard bg-bg-gray rounded-[12px] shadow-floating">
      <OptimizedImage src={ConfirmIcon} alt="확인 아이콘" className="w-[40px] h-[40px]" />
      <div className="flex flex-col justify-center text-[#212121] text-sm leading-[18px]">
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
