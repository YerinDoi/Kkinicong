import React from 'react';

interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, selected = false, onClick }) => {
  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      className={`inline-flex w-fit items-center h-[32px] px-[16px] py-[6px] rounded-[12px] border text-xs text-black 
        ${selected ? 'border-[#65CE58] bg-[#B1D960]' : 'bg-[#F4F6F8] border-[#919191]'}
        `}
    >
      {label}
    </button>
  );
};

export default Tag;
