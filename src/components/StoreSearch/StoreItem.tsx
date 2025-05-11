import { Store } from '@/types/store';
import Icon, { IconName } from '@/assets/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StoreItemProps {
  store: Store;
}

const StoreItem = ({ store }: StoreItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(store.scrapCount);
  const navigate = useNavigate();
  
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`);
  };

  const categoryIconMap: Record<string, IconName> = {
    한식: 'korean',
    양식: 'western',
    일식: 'japanese',
    중식: 'chinese',
    치킨: 'chicken',
    분식: 'street-food',
    샤브샤브: 'hotpot',
    아시안: 'asian',
    도시락: 'lunch-box',
    간식: 'snack',
    기타: 'etc',
  };

  return (
    <div className="flex gap-[14px] cursor-pointer" onClick={handleStoreClick}>
      <div className="flex min-w-[115px] aspect-square p-[20px] justify-center items-center rounded-[12px] border border-[#DFE1E4] bg-[#F6F7F8]">
        <div className="w-full h-full">
          <Icon
            name={categoryIconMap[store.category] || 'etc'}  // 없는 경우 'etc'로 fallback
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="relative flex-1 flex flex-col justify-between">
        <div className="flex flex-col items-start gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[#919191] text-[12px] tracking-[0.012px] leading-tight">
              {store.category}
            </span>
            <span className="text-[#212121] text-[16px] font-bold tracking-[0.016px] leading-tight">
              {store.name}
            </span>
            <span className="text-[#919191] text-[12px] tracking-[0.012px] leading-tight">
              {store.address}
            </span>
          </div>

          {store.representativeTag && (
            <div className="flex items-center">
              <span className="rounded-[14px] border-[1.5px] border-main-color bg-[#F4F6F8] px-[11px] py-[3px] text-[12px] text-[#212121] tracking-[0.012px] leading-tight">
                {store.representativeTag}
              </span>
            </div>
          )}
          
          <div className="flex items-end justify-between w-full">
            <div className="flex items-center gap-[4px]">
              <Icon name="star" />
              <span className="text-[#919191] text-[12px] font-medium tracking-[0.012px] leading-tight">
                {store.ratingAvg}
              </span>
            </div>

            <div className="flex items-center gap-[8px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();  // 클릭 이벤트 전파 방지
                  handleLikeClick();
                }}
                className="cursor-pointer"
              >
                <Icon name={isLiked ? 'heart-filled' : 'heart'} />
              </button>
              <span
                className={`text-[16px] font-semibold tracking-[0.012px] leading-tight ${
                  isLiked ? 'text-main-color' : 'text-[#C3C3C3]'
                }`}
              >
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreItem;
