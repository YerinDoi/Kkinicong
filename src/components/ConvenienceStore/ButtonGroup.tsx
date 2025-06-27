interface ButtonGroupProps {
  options: string[]; // 버튼에 들어갈 텍스트 배열
  selected: string; // 현재 선택된 버튼 텍스트
  onChange: (value: string) => void; // 버튼 클릭 시 실행될 함수
  className?: string;
}

export default function ButtonGroup({
  options,
  selected,
  onChange,
  className = '',
}: ButtonGroupProps) {
  return (
    <div className={`flex gap-2 whitespace-nowrap scrollbar-hide ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(selected === option ? '' : option)}
          className={`
            px-4 py-1 rounded-[12px] border border-[#919191] text-[14px] font-regular 
            ${selected === option ? 'bg-[#B1D960] border-[#B1D960] text-black ' : 'bg-[#F4F6F8]'}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
