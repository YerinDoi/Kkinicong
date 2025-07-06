interface ChipGroupProps {
    options: string[]; // 버튼에 들어갈 텍스트 배열
    selected: string; // 현재 선택된 버튼 텍스트
    onChange: (value: string) => void; // 버튼 클릭 시 실행될 함수
    className?: string;
  }
  
  export default function ChipGroup({
    options,
    selected,
    onChange,
    className = '',
  }: ChipGroupProps) {
    return (
      <div className={`flex px-[20px] pt-[16px] gap-[8px] whitespace-nowrap scrollbar-hide ${className}`}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`
              px-[16px] py-[4px] h-[35px] rounded-[12px] border border-[#919191] font-pretendard text-[16px] font-normaml leading-normal tracking-[0.016px]
              ${selected === option ? 'bg-[#B1D960] border-[#B1D960] text-black ' : 'bg-[#F4F6F8]'}
            `}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
  