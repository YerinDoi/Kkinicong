// components/Badge.tsx
import React from 'react';

interface MainTagProps {
  text: string;
  onClick?: () => void;
}

const MainTag: React.FC<MainTagProps> = ({ text, onClick }) => {
  const TagElement = onClick ? 'button' : 'span';
  return (
    <TagElement
      onClick={onClick}
      className="inline-flex w-fit items-center h-[24px] bg-[#F4F6F8] text-black-500 border-[1.5px] border-[#65CE58] text-xs px-[12px] py-[6px] rounded-[12px]"
    >
      {text}
    </TagElement>
  );
};

export default MainTag;
