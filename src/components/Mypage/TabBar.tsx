import React from 'react';

interface TabBarProps {
  value: string;
  onChange: (tab: string) => void;
  tabs: string[];
}

const TabBar: React.FC<TabBarProps> = ({ value, onChange, tabs }) => {
  return (
    <div className="relative flex w-full mt-[12px] mb-[4px]">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`
            flex-1 pb-[8px] text-center font-pretendard font-medium text-[16px] tracking-[0.016px] transition-colors
            ${value === tab ? 'text-black' : 'text-[#919191]'}
          `}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}

      {/* 바닥줄 (회색) */}
      <div className="absolute left-0 bottom-0 w-full h-[2px] rounded-[10px] bg-[#C3C3C3] z-0" />

      {/* 하이라이트 바 */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-black rounded-[10px] transition-all duration-200"
        style={{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${tabs.indexOf(value) * 100}%)`,
        }}
      />
    </div>
  );
};

export default TabBar;
