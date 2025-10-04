import React from 'react';

interface GreenButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const GreenButton: React.FC<GreenButtonProps> = ({
  text,
  onClick,
  disabled = false,
}) => {
  return (

      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-[320px] h-[60px] rounded-[12px] font-bold py-4 text-title-sb-button font-semibold transition ${
          disabled ? 'bg-disabled text-main-gray' : 'bg-main-color text-white'
        }`}
      >
        {text}
      </button>
  
  );
};

export default GreenButton;
