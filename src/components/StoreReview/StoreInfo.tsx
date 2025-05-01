import React from 'react';
import map from '@/assets/svgs/review/reviewmap.svg';
import MainTag from '@/components/StoreReview/MainTag';

interface StoreInfoProps {
  category: string;
  name: string;
  address: string;
  badgeText?: string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({
  category,
  name,
  address,
  badgeText = '재료가 신선해요',
}) => {
  return (
    <div className="w-full mx-auto pb-[12px]">
      {/* 상단 텍스트 영역 */}
      <div className="pl-[16px] pb-[16px] relative flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-xs font-medium text-[#919191] height-[14px]">
            {category}
          </p>
          <div className="relative flex items-center gap-[12px]">
            <h1 className="text-2xl font-semibold text-black leading-[32px]">
              {name}
            </h1>

            {badgeText && <MainTag text={badgeText} />}
          </div>
        </div>

        <p className="text-xs font-medium text-[#919191] ">{address}</p>
      </div>

      {/* 하단 지도 영역 */}
      <div className="w-full h-60 bg-gray-200">
        {/* 지도 이미지 (임시) */}
        <img src={map} alt="지도" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default StoreInfo;
