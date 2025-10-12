
import React from 'react';

interface MainTagProps {
  text: string;
  onClick?: () => void;
  rounded?: string;
}

const MainTag: React.FC<MainTagProps> = ({ text, onClick, rounded }) => {
  const TagElement = onClick ? 'button' : 'span';
  const baseClasses =
    'inline-flex w-fit whitespace-nowrap justify-center  h-[24px] bg-bg-gray leading-[24px] text-black-500 border-[1.5px] border-main-color text-body-md-description px-[12px]';
  const roundedClass = rounded || 'rounded-[12px]';

  return (
    <TagElement onClick={onClick} className={`${baseClasses} ${roundedClass}`}>
      {text}
    </TagElement>
  );
};

export default MainTag;
