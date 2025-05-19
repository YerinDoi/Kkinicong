// components/Rating.tsx
import React, { useState } from 'react';
import yellowStar from '@/assets/svgs/review/yellow-star.svg';
import disabledStar from '@/assets/svgs/review/disabled-star.svg';

interface StarProps {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const Star: React.FC<StarProps> = ({ max = 5, value = 0, onChange }) => {
  const [rating, setRating] = useState(value);

  const handleClick = (v: number) => {
    setRating(v);
    onChange?.(v);
  };

  return (
    <div className="flex gap-[12px]">
      {Array.from({ length: max }, (_, i) => (
        <img
          key={i}
          src={i < rating ? yellowStar : disabledStar}
          alt={i < rating ? '선택된 별' : '빈 별'}
          className="w-[40px] h-[38px] cursor-pointer"
          onClick={() => handleClick(i + 1)}
        />
      ))}
    </div>
  );
};

export default Star;
