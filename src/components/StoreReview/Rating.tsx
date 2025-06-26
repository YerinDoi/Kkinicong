import React from 'react';
import Star from '@/components/StoreReview/Star';

interface RatingProps {
  value: number;
  onChange: (val: number) => void;
}

const Rating: React.FC<RatingProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="text-title-sb-button font-semibold h-[44px] leading-[20px] flex flex-col gap-[4px]">
        <p>별점을 눌러</p>
        <p>만족도를 알려주세요</p>
      </div>
      <Star value={value} onChange={onChange} />
    </div>
  );
};

export default Rating;
