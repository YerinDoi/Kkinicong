import React from 'react';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import MainTag from '@/components/StoreReview/MainTag';
import { StoreDetail } from '@/types/store';

interface StoreInfoProps {
  store: StoreDetail;
  badgeText?: string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({
  store,
  badgeText = '재료가 신선해요',
}) => {
  const { storeName, storeCategory, storeAddress ,latitude,
    longitude,} = store;

  if (latitude == null || longitude == null) {
    console.warn('StoreInfo에 좌표가 없습니다:', store);
  }
  return (
    <div className="w-full mx-auto pb-[12px]">
      {/* 상단 텍스트 영역 */}
      <div className="pl-[16px] pb-[16px] relative flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-xs font-medium text-[#919191] height-[14px]">
            {storeCategory}
          </p>
          <div className="relative flex items-center gap-[12px]">
            <h1 className="text-[20px] font-semibold text-black leading-[32px]">
              {storeName}
            </h1>

            {badgeText && <MainTag text={badgeText} />}
          </div>
        </div>

        <p className="text-xs font-medium text-[#919191]">{storeAddress}</p>
      </div>

      {/* 하단 지도 영역 */}
      <div className="w-full h-60">
        {latitude != null && longitude != null ? (
          <StoreDetailMap hideButtons store={store} />
        ) : (
          <div className="text-sm text-red-500 pl-4">지도를 표시할 수 없습니다 (좌표 없음)</div>
        )}
      </div>
    </div>
  );
};

export default StoreInfo;