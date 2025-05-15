import Icon from '@/assets/icons';
import { useState, useEffect } from 'react';
import type { WeeklyHours } from '@/types/store';
import BusinessHours from './BusinessHours';
import MainTag from '../StoreReview/MainTag';
import RequestEditButton from './RequestEditButton';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';

interface StoreDetailInfoProps {
  category: string;
  name: string;
  address: string;
  badgeText?: string;
  favoriteCount: number;
  isLiked: boolean;

  weekly?: WeeklyHours;
}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  category,
  name,
  address,
  badgeText,
  favoriteCount,
  isLiked: initialLiked,
  weekly,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(favoriteCount);
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(favoriteCount);
  }, [initialLiked, favoriteCount]);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-[341px] pb-[16px] flex flex-col gap-[12px] mx-auto">
      <div className="flex flex-col gap-[12px] w-full">
        {/*카테고리, 이름, 태그*/}
        <div className="flex flex-col gap-[4px]">
          <p className="text-xs font-medium text-[#919191] height-[14px]">
            {category}
          </p>
          <div className="relative flex items-center gap-[8px]">
            <h1 className="text-[20px] font-semibold text-black leading-[32px]">
              {name}
            </h1>
            {badgeText && <MainTag text={badgeText} />}
          </div>
        </div>
        {/*주소*/}
        <p className="text-xs font-medium text-[#919191] ">{address}</p>
        <div className="flex justify-between items-start w-full ">
          {/*영업시간 태그/드롭다운*/}
          <div className="flex items-center gap-[12px] self-stretch">
            <BusinessHours weekly={weekly} />
          </div>
          {/*찜 아이콘*/}
          <div className="flex justify-end items-center gap-[8px]">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지
                handleLikeClick();
              }}
              className="cursor-pointer"
            >
              <Icon name={isLiked ? 'heart-filled' : 'heart'} />
            </button>
            <span
              className={`text-base font-semibold tracking-[0.012px] leading-tight ${isLiked ? 'text-main-color' : 'text-[#C3C3C3]'}`}
            >
              {likeCount}
            </span>
          </div>
        </div>
        <div className="flex gap-[8px] items-end">
          <RequestEditButton
            storeInfo={{
              name,
              category,
              mapComponent: <StoreDetailMap />,
            }}
          />
          {/*백엔드 연동시 수정*/}
          <p className="text-xs font-medium text-[#C3C3C3] ">
            업데이트 2024.03.02
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailInfo;
