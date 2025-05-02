import React from 'react';
import Star from '@/components/StoreReview/Star';

const Rating: React.FC = () => {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="text-base font-semibold h-[44px] leading-[20px] flex flex-col gap-[4px]">
        <p>별점을 눌러</p>
        <p>만족도를 알려주세요</p>
      </div>
      <Star />
    </div>
  );
};

export default Rating;
