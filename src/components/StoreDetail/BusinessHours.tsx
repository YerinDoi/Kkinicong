import Icon from '@/assets/icons';
import { useState, useEffect, useRef } from 'react';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const mondayFirst = [...weekdays.slice(1), weekdays[0]];

type WeeklyHours = {
  [key in typeof weekdays[number]]: [string, string] | null;
};

interface Props {
  open: string;
  close: string;
  status: '휴무' | '영업중' | '영업 종료';
  weekly?: WeeklyHours;
}

const BusinessHours: React.FC<Props> = ({ weekly, status }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); //드롭다운 바깥 클릭 감지를 위한 DOM 참조
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);//드롭다운 너비 고정

  //밖 클릭하면 드롭다운 닫기
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

  //너비 자동 계산, 열릴 때 최소 160px
  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(Math.max(dropdownRef.current.offsetWidth, 160));
    }
  }, [isOpen]);

  const today = new Date();
  const todayKey = weekdays[today.getDay()];
  const todayHours = weekly?.[todayKey];
 

  return (
    <div
      ref={dropdownRef}
      className="relative w-fit text-sm text-[#616161]">
      <div className="flex gap-[12px] cursor-pointer">
      <span
        className={`inline-flex items-center rounded-[6px] border-[1px] px-[8px] py-[4px] text-sm leading-[18px] h-[26px] 
          ${status === '영업중'
            ? 'border-[#65CE58]'
            : 'border-[#919191]'
          }`}
      >
        {status}
      </span>

        <div 
         onClick={() => setIsOpen(!isOpen)} className = "flex gap-[8px] items-center">
          <span>
            {status === '영업중' && todayHours && Array.isArray(todayHours)
              ? `${todayHours[1]}에 영업 종료`
              : status === '영업 종료' && todayHours && Array.isArray(todayHours)
              ? `${todayHours[0]}에 오픈`
              : `정기 휴무 (매주 ${todayKey}요일)`
            }
          </span>

          <Icon name={isOpen ? 'dropup' : 'dropdown'} />

        </div>
        
      </div>

      {isOpen && weekly && (
        <div
          className="absolute mt-[16px] bg-white z-10 px-[8px] flex flex-col gap-[4px]"
          style={{ width: `${dropdownWidth}px` }}
        >
          {mondayFirst.map((day) => {
            const hours = weekly[day];
            const isToday = day === weekdays[today.getDay()];
            return (
              <div key={day} className={`flex justify-between ${
                isToday ? 'text-[#616161]' : 'text-[#919191]'
              }`}>
                  {day}
                  {Array.isArray(hours)
                    ? ` ${hours[0]} ~ ${hours[1]}`
                    : ` 정기 휴무 (매주 ${day}요일)`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusinessHours;
