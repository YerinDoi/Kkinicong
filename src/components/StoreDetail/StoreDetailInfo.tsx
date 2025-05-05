
import Icon from '@/assets/icons';
import { useState, useEffect } from 'react';
import type {WeeklyHours} from '@/types/store'
import BusinessHours from './BusinessHours';

interface StoreDetailInfoProps {
  category: string;
  name: string;
  address: string;
  favoriteCount: number;
  isLiked: boolean;
  status: string;
  open: string;
  close: string;
  weekly?: WeeklyHours;

}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  category,
  name,
  address,
  favoriteCount,
  isLiked: initialLiked,
  status,
  open,
  close,
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
        <div className = "flex justify-between items-end w-full">
          <div className = "flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[4px]">
              <p className="text-xs font-medium text-[#919191] height-[14px]">
                {category}
              </p>
              <h1 className="text-2xl font-semibold text-black leading-[32px]">
                {name}
              </h1>
            </div>
            <p className="text-xs font-medium text-[#919191] ">{address}</p>
          </div>
          <div className="flex justify-end items-center gap-[8px]">
            <button onClick={(e) => {
              e.stopPropagation();  // 클릭 이벤트 전파 방지
              handleLikeClick();
            }} 
            className="cursor-pointer"
            >
              <Icon name={isLiked ? 'heart-filled' : 'heart'}/>
            </button>
            <span
              className={`text-[16px] font-semibold tracking-[0.012px] leading-tight ${isLiked ? 'text-main-color' : 'text-[#C3C3C3]'}`}
            >
              {likeCount}
            </span>
          </div>
        </div>
        <div className = "flex items-center gap-[12px] self-stretch">
          
          <BusinessHours open={open} close={close} status={status as ("휴무" | "영업중" | "영업 종료")} weekly={weekly}/>

        </div>  
        
        
      </div>
          
      

  );
};

export default StoreDetailInfo;
