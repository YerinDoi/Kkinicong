// components/Badge.tsx
import React from 'react';

interface MainTagProps {
  text: string;
}

const MainTag: React.FC<MainTagProps> = ({ text }) => {
  return (
    <span className="inline-flex w-fit items-center h-[24px] bg-[#F4F6F8] text-black-500 border-[1.5px] border-[#65CE58] text-xs px-[12px] py-[6px] rounded-[12px]">
      {text}
    </span>
  );
};

export default MainTag;
