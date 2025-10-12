import React from 'react';
import ReloadIcon from '@/assets/svgs/common/reload.svg'

interface SearchOnMapBtnProps {
  lat: number;
  lng: number;
  onClick: (lat: number, lng: number) => void;
}

const SearchOnMapBtn: React.FC<SearchOnMapBtnProps> = ({ lat, lng, onClick }) => (
  <button
    className="flex items-center justify-center w-[140px] h-[32px] rounded-[12px] bg-white px-[4px] py-[12px] gap-[8px] shadow-[0_0_8px_0_rgba(0,0,0,0.25)]"
    onClick={() => onClick(lat, lng)}
  >
    <img src={ReloadIcon} alt="재검색 아이콘"/>
    <span className="font-pretendard text-[14px] text-sub-color font-normal leading-[24px] ">현 지도에서 검색</span>
  </button>
);

export default SearchOnMapBtn;