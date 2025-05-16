import Icon from '@/assets/icons';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const weekdays = ['일', '월', '화', '수', '목', '금', '토'] as const;
const mondayFirst = [...weekdays.slice(1), weekdays[0]];

type Weekday = (typeof weekdays)[number];
type WeeklyHours = {
  [key in Weekday]: [string, string] | null;
};
type StoreStatus = '영업중' | '영업 종료' | '휴무';

function getStoreStatus(weekly?: WeeklyHours): StoreStatus {
  if (!weekly) return '휴무';

  const todayKey = weekdays[new Date().getDay()];
  const todayHours = weekly[todayKey];

  if (!todayHours || !Array.isArray(todayHours)) return '휴무';

  const now = dayjs();

  if (now.isAfter(todayHours[1])) return '영업 종료';
  return '영업중';
}

interface Props {
  weekly?: WeeklyHours;
}

const BusinessHours: React.FC<Props> = ({ weekly }) => {
  const isAllDaysClosed = !weekly || Object.values(weekly).every((value) => value === null); //영업시간 데이터 없으면 표시x
  if (isAllDaysClosed) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);

  const todayIndex = new Date().getDay();
  const todayKey = weekdays[todayIndex];
  const todayHours = weekly?.[todayKey];
  const status = getStoreStatus(weekly);

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
      setDropdownWidth(Math.max(dropdownRef.current.offsetWidth, 160));
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-fit text-sm text-[#616161]">
      <div className="flex gap-[12px] cursor-pointer">
        <span
          className={`inline-flex items-center rounded-[6px] border-[1px] px-[8px] py-[4px] text-sm leading-[18px] h-[26px] 
            ${status === '영업중' ? 'border-[#65CE58]' : 'border-[#919191]'}`}
        >
          {status}
        </span>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex gap-[8px] items-center"
        >
          <span>
            {status === '영업중' && todayHours
              ? `${todayHours[1]}에 영업 종료`
              : status === '영업 종료' && todayHours
                ? `${todayHours[0]}에 오픈`
                : `정기 휴무 (매주 ${todayKey}요일)`}
          </span>
          <Icon name={isOpen ? 'dropup' : 'dropdown'} />
        </div>
      </div>

      {isOpen && weekly && (
        <div
          className="absolute pt-[16px] bg-white z-10 px-[8px] flex flex-col gap-[4px]"
          style={{ width: `${dropdownWidth}px` }}
        >
          {mondayFirst.map((day) => {
            const hours = weekly[day];
            const isToday = day === todayKey;
            return (
              <div
                key={day}
                className={`flex justify-between ${isToday ? 'text-[#616161]' : 'text-[#919191]'}`}
              >
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
