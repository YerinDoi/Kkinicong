interface SelectableButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  selectedBgColor?: string; // 기본값: 연두색
  selectedBorderColor?: string; // 기본값: 연두색
  className?: string;
}

export default function SelectableButton({
  label,
  isSelected,
  onClick,
  selectedBgColor = '#B1D960',
  selectedBorderColor = '#B1D960',
  className = '',
}: SelectableButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-[12px] border-[1.5px]
        ${
          isSelected
            ? `bg-[${selectedBgColor}] border-[${selectedBorderColor}] text-black`
            : 'bg-white border-[#C3C3C3] text-[#616161]'
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}
