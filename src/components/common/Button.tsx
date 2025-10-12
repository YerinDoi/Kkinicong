import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  heightClass?: string;
  widthClass?: string;
  bgColorClass?: string;
  textColorClass?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  heightClass = 'auto',
  widthClass = 'w-full',
  bgColorClass = 'bg-[#FFF]',
  textColorClass = 'text-text-gray',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`${widthClass} ${heightClass} leading-[20px] font-pretendard justify-center items-center border-sub-gray border-[1.5px] py-[12px] px-[20px] text-title-sb-button font-semibold text-center rounded-[12px] ${bgColorClass} ${textColorClass} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
