import Icon from '@/assets/icons';
import { useState } from 'react';
import type { WeeklyHours } from '@/types/store';
import BusinessHours from './BusinessHours';
import MainTag from '../StoreReview/MainTag';
import RequestEditButton from './RequestEditButton';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import dayjs from 'dayjs';
import LoginRequiredBottomSheet from '../common/LoginRequiredBottomSheet';
import axios from '@/api/axiosInstance';

interface StoreDetailInfoProps {
  storeId?: number;
  category: string;
  name: string;
  address: string;
  badgeText?: string;
  favoriteCount: number;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  setLikeCount: (count: number) => void;
  weekly?: WeeklyHours;
  updatedDate: string;
}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  storeId,
  category,
  name,
  address,
  badgeText,
  favoriteCount,
  isLiked,
  setIsLiked,
  setLikeCount,
  weekly,
  updatedDate,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleLikeClick = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsBottomSheetOpen(true);
      return;
    }

    try {
      const response = await axios({
        method: isLiked ? 'delete' : 'post',
        url: `/api/v1/store/scrap/${storeId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        setIsLiked(response.data.results.isScrapped);
        setLikeCount(response.data.results.scrapCount);
      } else {
        console.error('서버 응답 실패:', response.data.message);
      }
    } catch (error) {
      console.error('스크랩 처리 중 오류 발생:', error);
    }
  };

  return (
    <div className="w-[341px] pb-[16px] flex flex-col gap-[12px] mx-auto">
      <div className="flex flex-col gap-[12px] w-full">
        {/* 카테고리, 이름, 태그 */}
        <div className="flex flex-col gap-[4px]">
          <p className="text-xs font-medium text-[#919191]">{category}</p>
          <div className="relative flex items-center gap-[8px]">
            <h1 className="text-[20px] font-semibold text-black leading-[32px]">
              {name}
            </h1>
            {badgeText && <MainTag text={badgeText} />}
          </div>
        </div>

        {/* 주소 */}
        <p className="text-xs font-medium text-[#919191]">{address}</p>

        {/* 영업시간 + 찜 아이콘 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-[12px] self-stretch">
            <BusinessHours weekly={weekly} />
          </div>
          <div className="flex justify-end items-center gap-[8px]">
            <button onClick={handleLikeClick} className="cursor-pointer">
              <Icon name={isLiked ? 'heart-filled' : 'heart'} />
            </button>
            <span
              className={`text-base font-semibold tracking-[0.012px] leading-tight ${
                isLiked ? 'text-main-color' : 'text-[#C3C3C3]'
              }`}
            >
              {favoriteCount}
            </span>
          </div>
        </div>

        {/* 수정요청 버튼 + 업데이트 날짜 */}
        <div className="flex gap-[8px] items-end">
          {storeId !== undefined && (
            <RequestEditButton
              storeId={storeId}
              storeInfo={{
                name,
                category,
                mapComponent: <StoreDetailMap />,
              }}
            />
          )}
          <p className="text-xs font-medium text-[#C3C3C3]">
            업데이트 {dayjs(updatedDate).format('YYYY.MM.DD')}
          </p>
        </div>
      </div>

      <LoginRequiredBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </div>
  );
};

export default StoreDetailInfo;
