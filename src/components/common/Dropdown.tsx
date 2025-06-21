import Icon from '../../assets/icons';
import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  onSelect?: (value: string) => void;
}

const Dropdown = ({ onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('가까운 순');
  const options = ['가까운 순', '리뷰 많은 순', '별점 높은 순', '조회수 순'];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(Math.max(dropdownRef.current.offsetWidth, 94));
    }
  }, [selected]); // selected가 변경될 때마다 너비 재계산 (최소 너비 94px)

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option); // 부모 컴포넌트에 선택된 값 전달
  };

  return (
    <div
      ref={dropdownRef}
      className="flex justify-center rounded-[6px] border border-[#919191] bg-[#F4F6F8] min-w-[94px] h-[28px] px-[12px] py-[4px] z-10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[4px] text-[#616161] text-[14px] not-italic font-medium leading-[18px]"
      >
        <span>{selected}</span>
        <Icon name={isOpen ? 'dropup' : 'dropdown'} />
      </button>

      {isOpen && (
        <div
          className="absolute mt-[22px] rounded-[6px] border border-[#919191] bg-[#F4F6F8] min-w-[94px]"
          style={{ width: `${dropdownWidth}px` }}
        >
          <ul className="py-[2px]">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-[12px] py-[4px] text-center text-[#616161] text-[14px] font-medium leading-[18px] cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
