import React from 'react';

interface QuickActionButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  href?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  text,
  onClick,
  href,
}) => {
  const content = (
    <div className="flex flex-col items-center gap-[5px] cursor-pointer">
      <div className="w-[48px] h-[48px] bg-[#F3F5ED] rounded-[12px] flex items-center justify-center">
        <img src={icon} alt={text} />
      </div>
      <span className="font-pretendard text-[12px] font-regular leading-[150%] tracking-[0.012px] text-black text-center">
        {text}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="inline-block">
      {content}
    </button>
  );
};

export default QuickActionButton;
