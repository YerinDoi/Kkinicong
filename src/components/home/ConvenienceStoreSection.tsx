import Card from '@/assets/svgs/convenienceStore/card.svg';
import { useNavigate } from 'react-router-dom';
import StoreChipCarousel from './ChipCarousel';
import React, { useState } from 'react';

function ConvenienceStoreSection() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('GS25');

  const handleClick = (categoryName: string) => {
    navigate('/store-search'); // 정보 공유하기 페이지로 변경 예정
  };

  const handleChipClick = (categoryName: string) => {
    
  };

 
  return (
    <div className="px-[20px] pb-[24px] flex flex-col gap-[20px]">
      <div className='flex flex-col gap-[16px]'>
        <div className='flex flex-col gap-[8px]'>
          <img src = {Card} className='w-[57px] h-[40px]'/>
          <p className='text-black text-base font-semibold leading-[20px]'>
            편의점 구매 가능 리스트<br/>
            실시간 사용자 후기로 확인해보세요!
          </p>
        </div>
        <div className='py-[4px] w-full flex overflow-x-auto gap-[10px] scrollbar-hide'>
          <StoreChipCarousel selected={selectedBrand} onSelect={setSelectedBrand} />
        </div>

      </div>
      
    </div>
  );
}

export default ConvenienceStoreSection;
