import React from 'react';

interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ label, selected = false, onClick, className = '' }) => {
  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      className={`
        flex-shrink-0
        inline-flex w-fit items-center px-[16px] py-[6px] rounded-[12px] text-black
        ${selected ? 'bg-[#B1D960]' : 'bg-[#F4F6F8] border border-[#919191]'}
        text-body-md-description ${className}
      `}
    >
      {label}
    </button>
  );
};

export default Tag;
